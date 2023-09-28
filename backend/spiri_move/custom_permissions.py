from django.utils.translation import gettext_lazy as _
from rest_framework.permissions import BasePermission


class ParticipantPermission(BasePermission):
    """
     Check if the user is authenticated and has the participant role.
     we can use it as permission for participant authorization
    """
    message = _('Adding participation not allowed for you.')

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_participant()
