from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from ..models import (
    Pet, VetVisit, Vaccination, Medication, WeightRecord, Document,
    CommunityPost, Comment, CaregiverAccess,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class PetSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    my_permission = serializers.SerializerMethodField()

    class Meta:
        model = Pet
        fields = [
            'id', 'owner', 'image', 'name', 'species', 'breed', 'age',
            'allergies', 'personality', 'daily_routine', 'care_instructions',
            'created_at', 'my_permission',
        ]
        read_only_fields = ['id', 'owner', 'created_at']

    def get_my_permission(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        if obj.owner_id == request.user.id:
            return 'owner'
        # `my_caregiver_access` is prefetched (scoped to the current user)
        # by PetViewSet.get_queryset — avoids an extra query per pet.
        access_list = getattr(obj, 'my_caregiver_access', None)
        if access_list is None:
            access = obj.caregivers.filter(caregiver=request.user).first()
            return access.permission if access else None
        return access_list[0].permission if access_list else None


class VetVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = VetVisit
        fields = [
            'id', 'pet', 'visit_date', 'reason', 'vet_name', 'description',
            'follow_up_date', 'follow_up_completed',
        ]


class VaccinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vaccination
        fields = [
            'id', 'pet', 'vaccine_name', 'date_administered', 'next_due_date',
            'reminder_sent', 'is_completed',
        ]
        read_only_fields = ['reminder_sent']


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = [
            'id', 'pet', 'name', 'dosage', 'frequency', 'custom_schedule_notes',
            'start_date', 'end_date', 'next_dose_date', 'reminder_sent',
            'is_active', 'notes', 'created_at',
        ]
        read_only_fields = ['reminder_sent', 'created_at']


class WeightRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightRecord
        fields = ['id', 'pet', 'weight', 'unit', 'recorded_date', 'notes']


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'pet', 'title', 'document_type', 'file', 'uploaded_at', 'notes']
        read_only_fields = ['uploaded_at']


class CaregiverAccessSerializer(serializers.ModelSerializer):
    caregiver = UserSerializer(read_only=True)
    caregiver_username = serializers.CharField(write_only=True)

    class Meta:
        model = CaregiverAccess
        fields = ['id', 'pet', 'caregiver', 'caregiver_username', 'permission', 'invited_at']
        read_only_fields = ['invited_at']

    def validate(self, attrs):
        username = attrs.pop('caregiver_username')
        try:
            attrs['caregiver'] = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({'caregiver_username': 'No user with that username exists.'})

        pet = attrs.get('pet') or getattr(self.instance, 'pet', None)
        if pet and attrs['caregiver'] == pet.owner:
            raise serializers.ValidationError({'caregiver_username': 'Pet owner cannot be added as a caregiver.'})
        return attrs


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at']
        read_only_fields = ['author', 'created_at']


class CommunityPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    # Populated by the `.annotate(comment_count=Count('comments'))` on
    # CommunityPostViewSet's queryset — falls back to a live count for any
    # other caller (e.g. serializing a single unannotated instance).
    comment_count = serializers.SerializerMethodField()

    def get_comment_count(self, obj):
        if hasattr(obj, 'comment_count') and isinstance(obj.comment_count, int):
            return obj.comment_count
        return obj.comments.count()

    class Meta:
        model = CommunityPost
        fields = [
            'id', 'author', 'title', 'content', 'created_at',
            'upvotes_count', 'comments', 'comment_count',
        ]
        read_only_fields = ['author', 'created_at', 'upvotes_count']
