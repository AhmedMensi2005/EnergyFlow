from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return hasattr(
            request.user,
            "superadmin"
        )


class IsAdmin(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return hasattr(
            request.user,
            "admin"
        )


class IsAdminOrSuperAdmin(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return (
            hasattr(
                request.user,
                "admin"
            )
            or
            hasattr(
                request.user,
                "superadmin"
            )
        )


class IsOperateur(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return hasattr(
            request.user,
            "operateur"
        )


class IsAdminOrOperateur(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return (
            hasattr(
                request.user,
                "admin"
            )
            or
            hasattr(
                request.user,
                "operateur"
            )
        )