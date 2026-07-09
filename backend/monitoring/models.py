from django.db import models
from rooms.models import Room
# Create your models here.
class AirConditioner(models.Model):

    STATUS_CHOICES = [
        ("online", "Online"),
        ("offline", "Offline"),
    ]

    name = models.CharField(max_length=100)

    model = models.CharField(max_length=100)

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="offline"
    )

    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="air_conditioners"
    )

    def __str__(self):
        return self.name
    
class AirConditionerData(models.Model):

    air_conditioner = models.ForeignKey(
        AirConditioner,
        on_delete=models.CASCADE,
        related_name="data"
    )

    timestamp = models.DateTimeField()

    power = models.FloatField()

    mode = models.CharField(max_length=30)

    temperature = models.FloatField()

    fan_speed = models.IntegerField()

    humidity = models.FloatField()

    def __str__(self):
        return f"{self.air_conditioner.name} - {self.timestamp}"

 