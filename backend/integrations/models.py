from django.db import models


class SmartThingsIntegration(models.Model):

    access_token = models.TextField()

    refresh_token = models.TextField()

    expires_at = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "SmartThings Integration"