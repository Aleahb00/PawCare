from rest_framework import permissions

from ..models import Pet, CaregiverAccess


def _get_pet(obj):
    """Resolve the Pet instance for either a Pet or a pet-related record."""
    return obj if isinstance(obj, Pet) else getattr(obj, 'pet', None)


class IsPetOwnerOrCaregiver(permissions.BasePermission):
    """
    Read access: pet owner or anyone with CaregiverAccess (view/edit) to the pet.
    Write access: pet owner, or a caregiver whose permission is 'edit'.
    """

    def has_object_permission(self, request, view, obj):
        pet = _get_pet(obj)
        if pet is None:
            return False

        user = request.user
        if pet.owner_id == user.id:
            return True

        access = CaregiverAccess.objects.filter(pet=pet, caregiver=user).first()
        if access is None:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True
        return access.permission == CaregiverAccess.Permission.CAN_EDIT


class IsOwner(permissions.BasePermission):
    """Simple author/owner-only permission for objects with an `author` field."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return getattr(obj, 'author_id', None) == request.user.id
