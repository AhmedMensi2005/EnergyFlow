from django.db.models.signals import post_save
from django.dispatch import receiver

from devices.models import Measurement

from .services import process_measurement_alerts


@receiver(post_save, sender=Measurement)
def measurement_created(sender, instance, created, **kwargs):
    """
    Automatically check alert rules whenever a new measurement
    is created.
    """

    if not created:
        return

    process_measurement_alerts(instance)