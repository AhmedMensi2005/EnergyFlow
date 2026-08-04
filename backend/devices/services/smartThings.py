import requests
from django.conf import settings
from django.utils import timezone
from integrations.models import SmartThingsIntegration

BASE_URL = "https://api.smartthings.com/v1"
TOKEN_URL = "https://api.smartthings.com/oauth/token"


class SmartThingsAuthError(Exception):
    """No connection yet, or refresh failed."""


class SmartThingsClient:

    def __init__(self):
        self.integration = SmartThingsIntegration.objects.first()
        if not self.integration:
            raise SmartThingsAuthError(
                "No SmartThings connection found. Connect via "
                "/api/integrations/smartthings/login/ first."
            )

        # Refresh proactively, 10 min before real expiry
        if timezone.now() >= self.integration.expires_at - timezone.timedelta(minutes=10):
            self._refresh()

    def _refresh(self):
        response = requests.post(
            TOKEN_URL,
            data={
                "grant_type": "refresh_token",
                "refresh_token": self.integration.refresh_token,
            },
            auth=(settings.SMARTTHINGS_CLIENT_ID, settings.SMARTTHINGS_CLIENT_SECRET),
        )

        if response.status_code != 200:
            raise SmartThingsAuthError(f"Token refresh failed: {response.text}")

        tokens = response.json()
        self.integration.access_token = tokens["access_token"]
        # SmartThings rotates the refresh token on every use — must overwrite it
        self.integration.refresh_token = tokens["refresh_token"]
        self.integration.expires_at = timezone.now() + timezone.timedelta(
            seconds=tokens["expires_in"]
        )
        self.integration.save()

    @property
    def headers(self):
        return {
            "Authorization": f"Bearer {self.integration.access_token}",
            "Content-Type": "application/json",
        }

    def get_devices(self):
        response = requests.get(f"{BASE_URL}/devices", headers=self.headers)
        response.raise_for_status()
        return response.json()["items"]

    def get_device(self, device_id):
        response = requests.get(f"{BASE_URL}/devices/{device_id}", headers=self.headers)
        response.raise_for_status()
        return response.json()

    def get_device_status(self, device_id):
        response = requests.get(f"{BASE_URL}/devices/{device_id}/status", headers=self.headers)
        response.raise_for_status()
        return response.json()

    def get_complete_device(self, device_id):
        device = self.get_device(device_id)
        status = self.get_device_status(device_id)
        return {**device, **status}