from rest_framework import serializers
from django.contrib.auth import get_user_model
from authentication.models import Admin, Operateur, Utilisateur

User = get_user_model()


class AdminCreateSerializer(serializers.Serializer):

    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):

        user = Utilisateur.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        Admin.objects.create(
            utilisateur=user
        )

        return user


class OperateurCreateSerializer(serializers.Serializer):

    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):

        user = Utilisateur.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        Operateur.objects.create(
            utilisateur=user
        )

        return user


class UtilisateurSerializer(serializers.ModelSerializer):

    role = serializers.ReadOnlyField()

    date_ajout = serializers.SerializerMethodField()
    date_suppression = serializers.SerializerMethodField()

    class Meta:

        model = Utilisateur

        fields = [
            "id",
            "username",
            "email",
            "role",
            "date_ajout",
            "date_suppression",
            "last_login",
        ]
        
    def get_date_ajout(self, obj):

        if hasattr(obj, "admin"):
            return obj.admin.date_ajout

        if hasattr(obj, "operateur"):
            return obj.operateur.date_ajout

        return None

    def get_date_suppression(self, obj):

        if hasattr(obj, "admin"):
            return obj.admin.date_suppression

        if hasattr(obj, "operateur"):
            return obj.operateur.date_suppression

        return None


class UserUpdateSerializer(serializers.ModelSerializer):

    class Meta:

        model = Utilisateur

        fields = [
            "username"
        ]


class PasswordUpdateSerializer(serializers.Serializer):

    password = serializers.CharField(
        write_only=True
    )

    def update(self, instance, validated_data):

        instance.set_password(
            validated_data["password"]
        )

        instance.save()

        return instance


class ForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate_email(self, value):

        if not Utilisateur.objects.filter(email=value).exists():

            raise serializers.ValidationError(
                "No user with this email exists."
            )

        return value


class ResetPasswordSerializer(serializers.Serializer):

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    password_confirm = serializers.CharField(
        write_only=True
    )

    def validate(self, data):

        if data["password"] != data["password_confirm"]:

            raise serializers.ValidationError(
                "Passwords do not match."
            )

        return data


class InviteUserSerializer(serializers.Serializer):

    email = serializers.EmailField()

    role = serializers.ChoiceField(
        choices=[
            ("ADMIN", "ADMIN"),
            ("OPERATEUR", "OPERATEUR")
        ]
    )