from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


# Create your models here.
class Pet(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pets')
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=50)
    breed = models.CharField(max_length=100, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    personality = models.TextField(blank=True, null=True)
    daily_routine = models.TextField(blank=True, null=True)
    care_instructions = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.species})"


class VetVisit(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='vet_visits')
    visit_date = models.DateField()
    reason = models.CharField(max_length=25)
    vet_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    follow_up_date = models.DateField(blank=True, null=True)
    follow_up_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-visit_date']

    def __str__(self):
        return f"{self.pet.name}"


class Vaccination(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='vaccinations')
    vaccine_name = models.CharField(max_length=100)
    date_administered = models.DateField()
    next_due_date = models.DateField(blank=True, null=True)
    reminder_sent = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['next_due_date']

    def __str__(self):
        return f"{self.vaccine_name}"


class Medication(models.Model):
    class Frequency(models.TextChoices):
        ONCE_DAILY = 'once_daily', 'Once daily'
        TWICE_DAILY = 'twice_daily', 'Twice daily'
        WEEKLY = 'weekly', 'Weekly'
        MONTHLY = 'monthly', 'Monthly'
        AS_NEEDED = 'as_needed', 'As needed'
        CUSTOM = 'custom', 'Custom'

    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='medications')
    name = models.CharField(max_length=150)
    dosage = models.CharField(max_length=100, blank=True, null=True)
    frequency = models.CharField(max_length=20, choices=Frequency.choices, default=Frequency.ONCE_DAILY)
    custom_schedule_notes = models.CharField(max_length=200, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    next_dose_date = models.DateField(blank=True, null=True)
    reminder_sent = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        ordering = ['next_dose_date']

    def __str__(self):
        return f"{self.name} for {self.pet.name}"


class WeightRecord(models.Model):
    class Unit(models.TextChoices):
        LB = 'lb', 'lbs'
        KG = 'kg', 'kg'

    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='weight_records')
    weight = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    unit = models.CharField(max_length=2, choices=Unit.choices, default=Unit.LB)
    recorded_date = models.DateField()
    notes = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        ordering = ['-recorded_date']

    def __str__(self):
        return f"{self.pet.name} - {self.weight}{self.unit} on {self.recorded_date}"


class Document(models.Model):
    class DocumentType(models.TextChoices):
        LAB_RESULT = 'lab_result', 'Lab result'
        VET_REPORT = 'vet_report', 'Vet report'
        INSURANCE = 'insurance', 'Insurance'
        OTHER = 'other', 'Other'

    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=150)
    document_type = models.CharField(max_length=20, choices=DocumentType.choices, default=DocumentType.OTHER)
    file = models.FileField(upload_to='pet_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.title} ({self.pet.name})"


class CommunityPost(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    upvotes_count = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title}"


class Comment(models.Model):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"


class CaregiverAccess(models.Model):
    """
    Grants another registered user (family member / pet sitter) access to a pet's
    profile and care info. Replaces the old broken FamilyMembers model.
    """
    class Permission(models.TextChoices):
        VIEW_ONLY = 'view', 'View only'
        CAN_EDIT = 'edit', 'Can edit'

    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='caregivers')
    caregiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_pets')
    permission = models.CharField(max_length=10, choices=Permission.choices, default=Permission.VIEW_ONLY)
    invited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('pet', 'caregiver')
        verbose_name_plural = 'Caregiver access'

    def __str__(self):
        return f"{self.caregiver.username} -> {self.pet.name} ({self.permission})"
