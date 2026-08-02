from django.urls import path
from .views import (
    LoginView,
    ForgotPasswordView,
    ResetPasswordView
)
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path(
        "login/",
        LoginView.as_view()
    ),
    path(
        "forgot-password/",
        ForgotPasswordView.as_view()
    ),

    path(
        "reset-password/<uid>/<token>/",
        ResetPasswordView.as_view()
    ),

    path(
            "refresh/",
            TokenRefreshView.as_view(),
            name="token_refresh"
        ),
]