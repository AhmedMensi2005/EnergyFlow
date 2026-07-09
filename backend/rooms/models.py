from django.db import models

# Create your models here.
class Room(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    area = models.FloatField(1)
    floor = models.CharField( max_length=10)
    description = models.TextField(blank=True)