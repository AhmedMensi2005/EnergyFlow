from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import os

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode
)
from django.utils.encoding import force_bytes

from django.template.loader import render_to_string

from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

from authentication.models import Utilisateur


class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(
            request=request,
            email=email,
            password=password
        )

        print("USER:", user)

        if user is None:

            return Response(
                {
                    "error": "Invalid email or password"
                },
                status=401
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "email": user.email,
                    "username": user.username
                }
            },
            status=200
        )


class ForgotPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")

        try:
            user = Utilisateur.objects.get(
                email=email
            )

        except Utilisateur.DoesNotExist:

            return Response(
                {
                    "error": "No account with this email."
                },
                status=404
            )

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(user)

        reset_link = (
            f"{os.getenv('FRONTEND_URL')}"
            f"/reset-password/{uid}/{token}"
        )

        html = render_to_string(
            "emails/reset_password.html",
            {
                "username": user.username,
                "reset_link": reset_link
            }
        )

        email = EmailMultiAlternatives(
            subject="Reset your EnergyFlow password",
            body=strip_tags(html),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email]
        )

        email.attach_alternative(
            html,
            "text/html"
        )

        email.send()

        return Response(
            {
                "message":
                "Password reset link sent successfully."
            }
        )


class ResetPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request, uid, token):

        try:

            uid = urlsafe_base64_decode(uid).decode()

            user = Utilisateur.objects.get(
                pk=uid
            )

        except (Utilisateur.DoesNotExist, ValueError, TypeError, UnicodeDecodeError):

            return Response(
                {
                    "error": "Invalid or expired reset link."
                },

                status=400
            )

        if not default_token_generator.check_token(
            user,
            token
        ):

            return Response(
                {
                    "error": "Invalid link"
                },
                status=400
            )

        password = request.data.get("password")
        confirm = request.data.get("password_confirm")

        if password != confirm:

            return Response(
                {
                    "error": "Passwords do not match"
                },
                status=400
            )

        user.set_password(password)
        user.save()

        return Response(
            {
                "message":
                "Password reset successfully"
            }
        )