from datetime import timedelta

from django.contrib.auth.models import User
from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets, generics, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import (
    Pet, VetVisit, Vaccination, Medication, WeightRecord, Document,
    CommunityPost, Comment, CaregiverAccess,
)
from .permissions import IsPetOwnerOrCaregiver, IsOwner
from .serializers import (
    RegisterSerializer, PetSerializer, VetVisitSerializer, VaccinationSerializer,
    MedicationSerializer, WeightRecordSerializer, DocumentSerializer,
    CaregiverAccessSerializer, CommunityPostSerializer, CommentSerializer,
)


class RegisterView(generics.CreateAPIView):
    """Public endpoint to create a new user account."""
    queryset = User.objects.none()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


def _accessible_pets(user):
    return Pet.objects.filter(
        Q(owner=user) | Q(caregivers__caregiver=user)
    ).distinct()


class PetViewSet(viewsets.ModelViewSet):
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated, IsPetOwnerOrCaregiver]

    def get_queryset(self):
        return _accessible_pets(self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class BasePetScopedViewSet(viewsets.ModelViewSet):
    """Shared behavior for records that hang off a Pet (visits, vaccinations, etc.)."""
    permission_classes = [permissions.IsAuthenticated, IsPetOwnerOrCaregiver]
    pet_related_name = None  # e.g. 'vet_visits'

    def get_queryset(self):
        user = self.request.user
        return self.queryset_model.objects.filter(
            Q(pet__owner=user) | Q(pet__caregivers__caregiver=user)
        ).distinct()


class VetVisitViewSet(BasePetScopedViewSet):
    serializer_class = VetVisitSerializer
    queryset_model = VetVisit
    filterset_fields = ['pet']


class VaccinationViewSet(BasePetScopedViewSet):
    serializer_class = VaccinationSerializer
    queryset_model = Vaccination
    filterset_fields = ['pet']


class MedicationViewSet(BasePetScopedViewSet):
    serializer_class = MedicationSerializer
    queryset_model = Medication
    filterset_fields = ['pet', 'is_active']


class WeightRecordViewSet(BasePetScopedViewSet):
    serializer_class = WeightRecordSerializer
    queryset_model = WeightRecord
    filterset_fields = ['pet']


class DocumentViewSet(BasePetScopedViewSet):
    serializer_class = DocumentSerializer
    queryset_model = Document
    filterset_fields = ['pet', 'document_type']


class CaregiverAccessViewSet(viewsets.ModelViewSet):
    serializer_class = CaregiverAccessSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only the pet's owner manages who has access to it.
        return CaregiverAccess.objects.filter(pet__owner=self.request.user)

    def perform_create(self, serializer):
        pet = serializer.validated_data.get('pet')
        if pet.owner_id != self.request.user.id:
            raise permissions.PermissionDenied("You don't own this pet.")
        serializer.save()


class CommunityPostViewSet(viewsets.ModelViewSet):
    queryset = CommunityPost.objects.all().order_by('-created_at')
    serializer_class = CommunityPostSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filterset_fields = ['post']

    def get_queryset(self):
        return Comment.objects.all().order_by('created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ReminderView(APIView):
    """
    Upcoming vaccinations, vet follow-ups, and medication doses due within
    `days` (default 14) across every pet the user owns or has access to.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            days = int(request.query_params.get('days', 14))
        except ValueError:
            days = 14
        today = timezone.localdate()
        horizon = today + timedelta(days=days)
        pets = _accessible_pets(request.user)

        vaccinations = Vaccination.objects.filter(
            pet__in=pets, next_due_date__isnull=False, is_completed=False,
            next_due_date__gte=today, next_due_date__lte=horizon,
        ).order_by('next_due_date')

        vet_visits = VetVisit.objects.filter(
            pet__in=pets, follow_up_date__isnull=False, follow_up_completed=False,
            follow_up_date__gte=today, follow_up_date__lte=horizon,
        ).order_by('follow_up_date')

        medications = Medication.objects.filter(
            pet__in=pets, is_active=True, next_dose_date__isnull=False,
            next_dose_date__gte=today, next_dose_date__lte=horizon,
        ).order_by('next_dose_date')

        overdue_vaccinations = Vaccination.objects.filter(
            pet__in=pets, next_due_date__isnull=False, is_completed=False,
            next_due_date__lt=today,
        ).order_by('next_due_date')

        return Response({
            'as_of': today,
            'horizon_days': days,
            'vaccinations_due': VaccinationSerializer(vaccinations, many=True).data,
            'vaccinations_overdue': VaccinationSerializer(overdue_vaccinations, many=True).data,
            'vet_follow_ups_due': VetVisitSerializer(vet_visits, many=True).data,
            'medications_due': MedicationSerializer(medications, many=True).data,
        })
