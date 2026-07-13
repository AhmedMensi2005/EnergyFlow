from rest_framework import serializers
from django.contrib.auth import get_user_model
from authentication.models import Admin, Operateur, Utilisateur
User = get_user_model()

class AdminCreateSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = Admin
        fields = [
            "username",
            "email",
            "password"
        ]

    def create(self, validated_data):

        admin = Admin.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        return admin



class OperateurCreateSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = Operateur
        fields = [
            "username",
            "email",
            "password"
        ]

    def create(self, validated_data):

        operateur = Operateur.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        return operateur



from rest_framework import serializers
from authentication.models import Utilisateur, Admin, Operateur


from rest_framework import serializers
from authentication.models import Utilisateur


class UtilisateurSerializer(serializers.ModelSerializer):

    role = serializers.SerializerMethodField()

    date_ajout = serializers.SerializerMethodField()
    date_suppression = serializers.SerializerMethodField()
    derniere_connexion = serializers.SerializerMethodField()


    class Meta:
        model = Utilisateur

        fields = [
            "id",
            "username",
            "email",
            "role",
            "date_ajout",
            "date_suppression",
            "derniere_connexion",
        ]


    def get_role(self, obj):

        if hasattr(obj, "admin"):
            return "ADMIN"

        if hasattr(obj, "operateur"):
            return "OPERATEUR"

        return "UTILISATEUR"


    def get_date_ajout(self, obj):

        if hasattr(obj, "operateur"):
            return obj.operateur.date_ajout

        return None


    def get_date_suppression(self, obj):

        if hasattr(obj, "operateur"):
            return obj.operateur.date_suppression

        return None


    def get_derniere_connexion(self, obj):

        if hasattr(obj, "operateur"):
            return obj.operateur.derniere_connexion

        return None


    def to_representation(self, instance):

        data = super().to_representation(instance)

        if hasattr(instance, "admin"):
            data.pop("date_ajout", None)
            data.pop("date_suppression", None)
            data.pop("derniere_connexion", None)

        return data

class UserUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Utilisateur
        fields = [
            "username",
            "email",
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

        if not User.objects.filter(email=value).exists():
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