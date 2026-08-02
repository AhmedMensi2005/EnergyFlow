from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from authentication.models import Utilisateur


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Utilisateur
        fields = [
            "username",
            "email",
            "password"
        ]
        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def validate_email(self, value):

        if Utilisateur.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "Email already exists."
            )

        return value

    def create(self, validated_data):

        return Utilisateur.objects.create_user(
            **validated_data
        )


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):

    email = serializers.EmailField()

    username_field = "email"

    def validate(self, attrs):

        email = attrs.get(
            "email"
        )

        password = attrs.get(
            "password"
        )

        user = authenticate(
            request=self.context.get("request"),
            username=email,
            password=password
        )

        if user is None:

            raise serializers.ValidationError(
                "Invalid email or password."
            )

        refresh = self.get_token(
            user
        )

        return {
            "refresh": str(refresh),

            "access": str(
                refresh.access_token
            ),

            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role
            }
        }