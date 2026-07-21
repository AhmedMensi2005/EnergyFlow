from django.urls import path
from .views import (
    LoginView,
    ForgotPasswordView,
    ResetPasswordView
)


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
]