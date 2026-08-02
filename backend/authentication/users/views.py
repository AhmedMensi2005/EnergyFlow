import os
from django.conf import settings

from django.urls import reverse
from django.core.mail import EmailMultiAlternatives

from django.template.loader import render_to_string

from django.utils.html import strip_tags
from django.contrib.auth.tokens import default_token_generator

from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode

from django.utils.encoding import force_bytes
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny
)

from authentication.models import (
    Utilisateur,
    Admin,
    Operateur,
    Invitation
)

from authentication.core.permissions import (
    IsAdminOrSuperAdmin,
    IsSuperAdmin
)

from .serializers import (
    AdminCreateSerializer,
    OperateurCreateSerializer,
    UtilisateurSerializer,
    PasswordUpdateSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    InviteUserSerializer
)


User = get_user_model()


class CreateAdminView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSuperAdmin
    ]

    def post(self, request):

        serializer = AdminCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Admin created successfully."
            },
            status=201
        )


class CreateOperateurView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrSuperAdmin
    ]

    def post(self, request):

        serializer = OperateurCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Operator created successfully."
            },
            status=201
        )


class UserListView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrSuperAdmin
    ]

    def get(self, request):

        users = Utilisateur.objects.all().order_by("id")

        serializer = UtilisateurSerializer(
            users,
            many=True
        )

        return Response(
            serializer.data
        )


class UserDetailView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrSuperAdmin
    ]

    def get(self, request, pk):

        try:

            user = Utilisateur.objects.get(
                pk=pk
            )

        except Utilisateur.DoesNotExist:

            return Response(
                {
                    "error": "User not found."
                },
                status=404
            )

        serializer = UtilisateurSerializer(
            user
        )

        return Response(
            serializer.data
        )


class UserUpdateView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrSuperAdmin
    ]


    def put(self, request, pk):

        current_user = request.user


        try:

            user_to_edit = Utilisateur.objects.get(
                id=pk
            )

        except Utilisateur.DoesNotExist:

            return Response(
                {
                    "error":"User not found"
                },
                status=404
            )


        # check target role

        target_is_admin = Admin.objects.filter(
            utilisateur=user_to_edit
        ).exists()


        target_is_operator = Operateur.objects.filter(
            utilisateur=user_to_edit
        ).exists()



        # ADMIN restrictions

        current_is_admin = Admin.objects.filter(
            utilisateur=current_user
        ).exists()


        current_is_super = SuperAdmin.objects.filter(
            utilisateur=current_user
        ).exists()



        if current_is_admin and not current_is_super:

            if target_is_admin:

                return Response(
                    {
                        "error":
                        "Admins cannot edit other admins."
                    },
                    status=403
                )


        serializer = UserUpdateSerializer(
            user_to_edit,
            data=request.data,
            partial=True
        )


        serializer.is_valid(
            raise_exception=True
        )


        serializer.save()


        return Response(
            {
                "message":
                "User updated successfully"
            }
        )


class ChangePasswordView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrSuperAdmin
    ]

    def put(self, request, pk):

        try:

            user = Utilisateur.objects.get(
                pk=pk
            )

        except Utilisateur.DoesNotExist:

            return Response(
                {
                    "error": "User not found."
                },
                status=404
            )

        serializer = PasswordUpdateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.update(
            user,
            serializer.validated_data
        )

        return Response(
            {
                "message": "Password updated successfully."
            }
        )


class DeleteOperateurView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrSuperAdmin
    ]

    def delete(self, request, pk):

        try:

            operator = Operateur.objects.get(
                utilisateur_id=pk
            )

        except Operateur.DoesNotExist:

            return Response(
                {
                    "error": "Operator not found."
                },
                status=404
            )

        operator.date_suppression = timezone.now()

        operator.save()

        operator.utilisateur.delete()

        return Response(
            {
                "message": "Operator deleted successfully."
            }
        )


class DeleteAdminView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSuperAdmin
    ]

    def delete(self, request, pk):

        try:

            admin = Admin.objects.get(
                utilisateur_id=pk
            )

        except Admin.DoesNotExist:

            return Response(
                {
                    "error": "Admin not found."
                },
                status=404
            )

        admin.utilisateur.delete()

        return Response(
            {
                "message": "Admin deleted successfully."
            }
        )


class ForgotPasswordView(APIView):

    permission_classes = [
        AllowAny
    ]

    def post(self, request):

        serializer = ForgotPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = Utilisateur.objects.get(
            email=serializer.validated_data["email"]
        )

        token = default_token_generator.make_token(
            user
        )

        return Response(
            {
                "message": "Reset token generated.",
                "token": token,
                "user_id": user.id
            }
        )


class ResetPasswordView(APIView):

    permission_classes = [
        AllowAny
    ]

    def post(
        self,
        request,
        uid,
        token
    ):

        serializer = ResetPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:

            user = Utilisateur.objects.get(
                pk=uid
            )

        except Utilisateur.DoesNotExist:

            return Response(
                {
                    "error": "User not found."
                },
                status=404
            )

        if not default_token_generator.check_token(
            user,
            token
        ):

            return Response(
                {
                    "error": "Invalid or expired token."
                },
                status=400
            )

        user.set_password(
            serializer.validated_data["password"]
        )

        user.save()

        return Response(
            {
                "message": "Password reset successfully."
            }
        )


class InviteUserView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrSuperAdmin
    ]

    def post(self, request):

        serializer = InviteUserSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data["email"]
        role = serializer.validated_data["role"]

        # Check existing user
        if Utilisateur.objects.filter(
            email=email
        ).exists():

            return Response(
                {
                    "error": "A user with this email already exists."
                },
                status=400
            )

        # Check existing invitation
        Invitation.objects.filter(
            email=email,
            accepted=False
        ).delete()
        # Generate invitation token
        token = default_token_generator.make_token(
            request.user
        )

        # Create invitation
        invitation = Invitation.objects.create(

            email=email,

            role=role,

            token=token,

            expires_at=timezone.now() + timedelta(days=7)

        )

        # Create link

        link = (
            f"http://localhost:5173/create-account/"
            f"{invitation.id}/{token}"
        )

        html = render_to_string(

            "emails/invitation_email.html",

            {

                "link": link,

                "role": role

            }

        )

        message = EmailMultiAlternatives(

            subject="You're invited to EnergyFlow",

            body=strip_tags(html),

            from_email=settings.DEFAULT_FROM_EMAIL,

            to=[email]

        )

        message.attach_alternative(

            html,

            "text/html"

        )

        message.send()

        return Response(

            {
                "message": "Invitation sent successfully."
            },

            status=201

        )


class CreateAccountView(APIView):

    permission_classes = [
        AllowAny
    ]

    def post(self, request):

        invitation_id = request.data.get("invitation_id")
        token = request.data.get("token")

        username = request.data.get("username")
        password = request.data.get("password")


        if not all([
            invitation_id,
            token,
            username,
            password
        ]):

            return Response(
                {
                    "error": "All fields are required."
                },
                status=400
            )


        # Find invitation
        try:

            invitation = Invitation.objects.get(
                id=invitation_id,
                accepted=False
            )

        except Invitation.DoesNotExist:

            return Response(
                {
                    "error": "Invalid invitation."
                },
                status=400
            )


        # Check expiration

        if invitation.expires_at < timezone.now():

            return Response(
                {
                    "error": "Invitation expired."
                },
                status=400
            )


        # Check token

        if invitation.token != token:

            return Response(
                {
                    "error": "Invalid token."
                },
                status=400
            )

        # Check username

        if Utilisateur.objects.filter(
            username=username
        ).exists():

            return Response(
                {
                    "error": "Username already taken."
                },
                status=400
            )

        # Create user

        user = Utilisateur.objects.create(
            username=username,
            email=invitation.email
        )

        user.set_password(password)

        user.save()

        # Create role

        if invitation.role == "ADMIN":

            Admin.objects.create(
                utilisateur=user
            )

        elif invitation.role == "OPERATEUR":

            Operateur.objects.create(
                utilisateur=user
            )

        # Accept invitation

        invitation.accepted = True

        invitation.save()

        return Response(
            {
                "message": "Account created successfully."
            },
            status=201
        )


class InvitationListView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrSuperAdmin
    ]

    def get(self, request):

        invitations = Invitation.objects.filter(
            accepted=False
        )

        data = []

        for invitation in invitations:

            data.append({

                "id": invitation.id,

                "email": invitation.email,

                "role": invitation.role,

                "status": "PENDING",

                "created_at": invitation.created_at,

                "expires_at": invitation.expires_at

            })


        return Response(data)