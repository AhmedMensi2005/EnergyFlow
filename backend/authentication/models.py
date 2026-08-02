from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from datetime import timedelta
from django.utils import timezone


class Utilisateur(AbstractUser):

    objects = UserManager()

    email = models.EmailField(
        unique=True
    )

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = [
        "username"
    ]

    @property
    def role(self):

        if hasattr(self, "superadmin"):
            return "SUPER_ADMIN"

        if hasattr(self, "admin"):
            return "ADMIN"

        if hasattr(self, "operateur"):
            return "OPERATEUR"

        return "UTILISATEUR"

    def __str__(self):
        return self.email


class SuperAdmin(models.Model):

    utilisateur = models.OneToOneField(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="superadmin"
    )

    def __str__(self):
        return f"Super Admin : {self.utilisateur.email}"


class Admin(models.Model):

    utilisateur = models.OneToOneField(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="admin"
    )

    date_ajout = models.DateTimeField(
        auto_now_add=True
    )

    date_suppression = models.DateTimeField(
        null=True,
        blank=True
    )

    derniere_connexion = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Admin : {self.utilisateur.email}"


class Operateur(models.Model):

    utilisateur = models.OneToOneField(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="operateur"
    )

    date_ajout = models.DateTimeField(
        auto_now_add=True
    )

    date_suppression = models.DateTimeField(
        null=True,
        blank=True
    )

    derniere_connexion = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Operateur : {self.utilisateur.email}"


def invitation_expiry():
    return timezone.now() + timedelta(days=2)


class Invitation(models.Model):

    ROLE_CHOICES = [
        ("ADMIN", "Admin"),
        ("OPERATEUR", "Operateur"),
    ]

    email = models.EmailField()

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    token = models.CharField(
        max_length=255,
        unique=True
    )

    accepted = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    expires_at = models.DateTimeField(
        default=invitation_expiry
    )

    def __str__(self):
        return self.email