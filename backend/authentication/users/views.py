from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny
)

from authentication.models import Operateur, Utilisateur
from authentication.core.permissions import IsAdmin

from .serializers import (
    AdminCreateSerializer,
    OperateurCreateSerializer,
    UtilisateurSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    UserUpdateSerializer,
    PasswordUpdateSerializer
)


User = get_user_model()


class CreateAdminView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def post(self, request):

        serializer = AdminCreateSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {"message": "Admin created"},
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )


class CreateOperateurView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def post(self, request):

        serializer = OperateurCreateSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {"message": "Operateur created"},
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )


class UserListView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def get(self, request):

        users = Utilisateur.objects.all()

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
        IsAdmin
    ]

    def get(self, request, pk):

        try:

            user = Utilisateur.objects.get(
                pk=pk
            )

        except Utilisateur.DoesNotExist:

            return Response(
                {
                    "error": "User not found"
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
        IsAdmin
    ]


    def put(self, request, pk):

        try:

            user = Utilisateur.objects.get(
                pk=pk
            )

        except Utilisateur.DoesNotExist:

            return Response(
                {
                    "error": "User not found"
                },
                status=404
            )


        serializer = UserUpdateSerializer(
            user,
            data=request.data
        )


        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "message": "User updated"
                }
            )


        return Response(
            serializer.errors,
            status=400
        )


class ChangePasswordView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]


    def put(self, request, pk):

        try:

            user = Utilisateur.objects.get(
                pk=pk
            )

        except Utilisateur.DoesNotExist:

            return Response(
                {
                    "error": "User not found"
                },
                status=404
            )


        serializer = PasswordUpdateSerializer(
            user,
            data=request.data
        )


        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "message": "Password updated"
                }
            )


        return Response(
            serializer.errors,
            status=400
        )


class DeleteOperateurView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]


    def delete(self, request, pk):

        try:

            operateur = Operateur.objects.get(
                pk=pk
            )

        except Operateur.DoesNotExist:

            return Response(
                {
                    "error": "Operateur not found"
                },
                status=404
            )


        operateur.date_suppression = timezone.now()
        operateur.save()


        return Response(
            {
                "message": "Operateur deleted successfully"
            },
            status=200
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


        email = serializer.validated_data["email"]


        user = User.objects.get(
            email=email
        )


        token = default_token_generator.make_token(
            user
        )


        return Response(
            {
                "message": "Reset token generated",
                "token": token,
                "user_id": user.id
            }
        )


class ResetPasswordView(APIView):

    permission_classes = [
        AllowAny
    ]


    def post(self, request, user_id, token):

        serializer = ResetPasswordSerializer(
            data=request.data
        )


        serializer.is_valid(
            raise_exception=True
        )


        try:

            user = User.objects.get(
                id=user_id
            )

        except User.DoesNotExist:

            return Response(
                {
                    "error": "User not found"
                },
                status=404
            )


        if not default_token_generator.check_token(
            user,
            token
        ):

            return Response(
                {
                    "error": "Invalid token"
                },
                status=400
            )


        user.set_password(
            serializer.validated_data["password"]
        )

        user.save()


        return Response(
            {
                "message": "Password reset successful"
            }
        )