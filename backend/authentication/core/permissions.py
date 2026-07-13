from rest_framework.permissions import BasePermission
from authentication.models import Admin


class IsAdmin(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return Admin.objects.filter(pk=request.user.pk).exists()