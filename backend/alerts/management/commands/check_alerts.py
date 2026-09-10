from django.core.management.base import BaseCommand
from django.db.models import OuterRef, Subquery

from devices.models import Measurement
from alerts.models import AlertRule
from alerts.services import create_alert_from_measurement


class Command(BaseCommand):

    help = "Check the latest measurement of each device against enabled alert rules."

    def handle(self, *args, **options):

        # Get all enabled alert rules
        rules = AlertRule.objects.filter(
            enabled=True
        ).select_related(
            "device",
            "room"
        )

        if not rules.exists():

            self.stdout.write(
                self.style.WARNING(
                    "No enabled alert rules found."
                )
            )

            return

        # Get the latest measurement for each device
        latest_measurement_id = Measurement.objects.filter(
            device=OuterRef("device")
        ).order_by(
            "-timestamp"
        ).values(
            "id"
        )[:1]

        measurements = Measurement.objects.filter(
            id=Subquery(latest_measurement_id)
        ).select_related(
            "device",
            "device__room"
        )

        created_count = 0

        for measurement in measurements:

            for rule in rules:

                alert = create_alert_from_measurement(
                    measurement,
                    rule
                )

                if alert:

                    created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Alert check completed. "
                f"{created_count} alert(s) processed."
            )
        )