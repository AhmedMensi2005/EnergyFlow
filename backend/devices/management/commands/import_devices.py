from django.core.management.base import BaseCommand

from devices.services.smartThings import SmartThingsClient
from devices.services.importer import ( device_importer, measurements_importer,)


class Command(BaseCommand):

    help = "Import SmartThings devices"

    def handle(self, *args, **options):

        client = SmartThingsClient()
        devices = client.get_devices()
        imported = 0

        for device in devices:
            try:
                # Fetch complete device (metadata + status)
                data = client.get_complete_device(device["deviceId"])
                db_device = device_importer(data)
                measurements_importer(data, db_device)

                imported += 1
                print(data)
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✓ Imported {db_device.name}"
                    )
                )

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"✗ Failed to import {device['deviceId']}: {e}"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nImport completed. {imported} device(s) imported."
            )
        )