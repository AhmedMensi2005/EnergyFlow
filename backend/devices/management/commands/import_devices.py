import json
from django.core.management.base import BaseCommand
from devices.services.importer import device_importer,mesurments_importer

class Command(BaseCommand):

    help = "Import SmartThings devices"

    def add_arguments(self, parser):

        parser.add_argument(
            "json_file",
            type=str
        )

    def handle(self, *args, **options):

        with open(options["json_file"], encoding="utf-8") as f:
            data = json.load(f)

        # if the json contains one device

        if isinstance(data, dict):

            device = device_importer(data)

            mesurments_importer(data, device)

        # if the json contains many devices

        elif isinstance(data, list):

            for item in data:

                device = device_importer(item)

                mesurments_importer(item, device)

        self.stdout.write(
            self.style.SUCCESS("Import completed.")
        )