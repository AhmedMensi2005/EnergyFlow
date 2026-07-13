from django.urls import path

from .views import (
    CreateAdminView,
    CreateOperateurView,
    UserListView,
    UserDetailView,
    UserUpdateView,
    ChangePasswordView,
    ForgotPasswordView,
    ResetPasswordView
)
from .views import DeleteOperateurView

urlpatterns = [
    path(
        "",
        UserListView.as_view(),
        name="user-list",
    ),

    path(
        "create-admin/",
        CreateAdminView.as_view(),
        name="create-admin",
    ),

    path(
        "create-operateur/",
        CreateOperateurView.as_view(),
        name="create-operateur",
    ),

    path(
        "<int:pk>/",
        UserDetailView.as_view(),
        name="user-detail",
    ),
    path(
        "<int:pk>/update/",
        UserUpdateView.as_view()
    ),

    path(
        "<int:pk>/password/",
        ChangePasswordView.as_view()
    ),

    path(
        "operator/<int:pk>/delete/",
        DeleteOperateurView.as_view()
    ),
    path(
        "forgot-password/",
        ForgotPasswordView.as_view()
    ),

    path(
        "reset-password/<int:user_id>/<str:token>/",
        ResetPasswordView.as_view()
    ),

]