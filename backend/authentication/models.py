from django.db import models
from django.contrib.auth.models import AbstractUser


class Utilisateur(AbstractUser):

    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email



class Admin(Utilisateur):

    class Meta:
        verbose_name = "Admin"

    def __str__(self):
        return f"Admin : {self.email}"



class Operateur(Utilisateur):

    date_ajout = models.DateTimeField(auto_now_add=True)

    date_suppression = models.DateTimeField(
        null=True,
        blank=True
    )

    derniere_connexion = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = "Operateur"

    def __str__(self):
        return f"Operateur : {self.email}"