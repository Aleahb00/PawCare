from datetime import timedelta

from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status

from .models import Pet, VetVisit, Vaccination, Medication, CaregiverAccess


class ModelTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username='owner', password='pass12345')
        self.pet = Pet.objects.create(owner=self.owner, name='Bubba', species='Dog')

    def test_pet_str(self):
        self.assertEqual(str(self.pet), 'Bubba (Dog)')

    def test_vaccination_ordering_by_due_date(self):
        later = Vaccination.objects.create(
            pet=self.pet, vaccine_name='Rabies',
            date_administered=timezone.localdate(),
            next_due_date=timezone.localdate() + timedelta(days=30),
        )
        sooner = Vaccination.objects.create(
            pet=self.pet, vaccine_name='Bordetella',
            date_administered=timezone.localdate(),
            next_due_date=timezone.localdate() + timedelta(days=5),
        )
        self.assertEqual(list(Vaccination.objects.all()), [sooner, later])


class PetApiPermissionTests(TestCase):
    """Users should only see/manage pets they own or have caregiver access to."""

    def setUp(self):
        self.owner = User.objects.create_user(username='owner', password='pass12345')
        self.stranger = User.objects.create_user(username='stranger', password='pass12345')
        self.caregiver = User.objects.create_user(username='sitter', password='pass12345')

        self.pet = Pet.objects.create(owner=self.owner, name='Bubba', species='Dog')
        CaregiverAccess.objects.create(
            pet=self.pet, caregiver=self.caregiver,
            permission=CaregiverAccess.Permission.VIEW_ONLY,
        )

    def test_owner_can_list_own_pet(self):
        client = APIClient()
        client.force_authenticate(self.owner)
        response = client.get('/api/pets/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [p['name'] for p in response.data['results']]
        self.assertIn('Bubba', names)

    def test_stranger_cannot_see_pet(self):
        client = APIClient()
        client.force_authenticate(self.stranger)
        response = client.get('/api/pets/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [p['name'] for p in response.data['results']]
        self.assertNotIn('Bubba', names)

    def test_stranger_gets_404_on_direct_pet_access(self):
        client = APIClient()
        client.force_authenticate(self.stranger)
        response = client.get(f'/api/pets/{self.pet.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_view_only_caregiver_cannot_edit_pet(self):
        client = APIClient()
        client.force_authenticate(self.caregiver)
        response = client.patch(f'/api/pets/{self.pet.id}/', {'name': 'Hacked'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_request_is_rejected(self):
        client = APIClient()
        response = client.get('/api/pets/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ReminderApiTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username='owner', password='pass12345')
        self.pet = Pet.objects.create(owner=self.owner, name='Bubba', species='Dog')
        self.client = APIClient()
        self.client.force_authenticate(self.owner)
        self.today = timezone.localdate()

    def test_reminders_includes_upcoming_and_excludes_far_future(self):
        Vaccination.objects.create(
            pet=self.pet, vaccine_name='Rabies',
            date_administered=self.today,
            next_due_date=self.today + timedelta(days=5),
        )
        Vaccination.objects.create(
            pet=self.pet, vaccine_name='Distemper',
            date_administered=self.today,
            next_due_date=self.today + timedelta(days=200),
        )
        response = self.client.get('/api/reminders/', {'days': 14})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        due_names = [v['vaccine_name'] for v in response.data['vaccinations_due']]
        self.assertIn('Rabies', due_names)
        self.assertNotIn('Distemper', due_names)

    def test_overdue_vaccination_is_flagged_separately(self):
        Vaccination.objects.create(
            pet=self.pet, vaccine_name='Rabies',
            date_administered=self.today - timedelta(days=400),
            next_due_date=self.today - timedelta(days=10),
        )
        response = self.client.get('/api/reminders/')
        overdue_names = [v['vaccine_name'] for v in response.data['vaccinations_overdue']]
        due_names = [v['vaccine_name'] for v in response.data['vaccinations_due']]
        self.assertIn('Rabies', overdue_names)
        self.assertNotIn('Rabies', due_names)

    def test_completed_vaccination_is_excluded_from_reminders(self):
        Vaccination.objects.create(
            pet=self.pet, vaccine_name='Rabies',
            date_administered=self.today - timedelta(days=400),
            next_due_date=self.today - timedelta(days=10),
            is_completed=True,
        )
        response = self.client.get('/api/reminders/')
        overdue_names = [v['vaccine_name'] for v in response.data['vaccinations_overdue']]
        self.assertNotIn('Rabies', overdue_names)

    def test_completed_vet_follow_up_is_excluded_from_reminders(self):
        VetVisit.objects.create(
            pet=self.pet, visit_date=self.today, reason='Checkup', vet_name='Dr. Lee',
            follow_up_date=self.today + timedelta(days=3), follow_up_completed=True,
        )
        response = self.client.get('/api/reminders/')
        follow_up_reasons = [v['reason'] for v in response.data['vet_follow_ups_due']]
        self.assertNotIn('Checkup', follow_up_reasons)

    def test_active_medication_due_soon_is_included(self):
        Medication.objects.create(
            pet=self.pet, name='Heartgard', start_date=self.today,
            next_dose_date=self.today + timedelta(days=1), is_active=True,
        )
        response = self.client.get('/api/reminders/')
        med_names = [m['name'] for m in response.data['medications_due']]
        self.assertIn('Heartgard', med_names)


class RegistrationApiTests(TestCase):
    def test_register_creates_user(self):
        client = APIClient()
        response = client.post('/api/auth/register/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'S0meStrongPass!',
            'first_name': 'New',
            'last_name': 'User',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_rejects_duplicate_email(self):
        User.objects.create_user(username='existing', email='dup@example.com', password='pass12345')
        client = APIClient()
        response = client.post('/api/auth/register/', {
            'username': 'newuser2',
            'email': 'dup@example.com',
            'password': 'S0meStrongPass!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
