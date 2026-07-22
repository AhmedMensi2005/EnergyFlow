from django.db import models
from rooms.models import Room

# Create your models here.
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Device(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"
        MAINTENANCE = "maintenance", "Under maintenance"
    class Category(models.TextChoices):
        AIR_CONDITIONER = "air_conditioner", "Air Conditioner"

    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True, related_name="devices")
    category = models.CharField(max_length=30, choices=Category.choices, default=Category.AIR_CONDITIONER)

    name = models.CharField(max_length=150)
    label = models.CharField(max_length=100, blank=True)          # friendly label, e.g. "Box_10"
    external_id = models.CharField(max_length=100, unique=True)   # source system's deviceId
    manufacturer = models.CharField(max_length=150, blank=True)
    model_number = models.CharField(max_length=150, blank=True)
    serial_number = models.CharField(max_length=150, blank=True)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    installed_at = models.DateField(null=True, blank=True)

    # Static / rarely-changing metadata that doesn't deserve columns
    # (firmware version, OCF profile, mac addresses, capability list...)
    metadata = models.JSONField(default=dict, blank=True)

    # Denormalized cache of the latest known state, updated on ingest.
    # Read-heavy dashboards hit this instead of querying Measurement + ORDER BY -timestamp.
    last_seen_at = models.DateTimeField(null=True, blank=True)
    last_operating_state = models.CharField(max_length=30, blank=True)  # "on" / "off"

    class Meta:
        ordering = ["room", "name"]
        indexes = [
            models.Index(fields=["room", "category"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.category})"
    




#device data in a selected time
class Measurement(models.Model):
    
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="measurements")

    timestamp = models.DateTimeField(db_index=True)   # when the reading occurred (device clock)
    ingested_at = models.DateTimeField(auto_now_add=True)

    
    # --- Common electrical / energy fields (present across most device categories) ---
    power = models.FloatField(null=True, blank=True, help_text="Watts, instantaneous")
    energy_total = models.FloatField(null=True, blank=True, help_text="Wh, cumulative counter")
    energy_delta = models.FloatField(null=True, blank=True, help_text="Wh, since previous reading")
    voltage = models.FloatField(null=True, blank=True, help_text="Volts")
    current = models.FloatField(null=True, blank=True, help_text="Amps")

    # --- Common environmental fields (HVAC, fridge, ventilation...) ---
    temperature = models.FloatField(null=True, blank=True, help_text="°C")
    target_temperature = models.FloatField(null=True, blank=True, help_text="°C, setpoint")
    humidity = models.FloatField(null=True, blank=True, help_text="%")

    # --- Common operating fields (switch/mode/fan — applies to AC, heater, fan, lighting...) ---
    operating_state = models.CharField(max_length=30, blank=True)   # "on" / "off" / "idle"
    mode = models.CharField(max_length=50, blank=True)              # "cool" / "heat" / "auto"...
    fan_mode = models.CharField(max_length=30, blank=True)          # "low" / "high" / "turbo"...

    # --- Everything else: device/manufacturer-specific, kept for completeness & debugging ---
    extra_data = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["device", "-timestamp"]),   # dashboard query #1
            models.Index(fields=["timestamp"]),               # global time-range queries, BRIN candidate
        ]
        constraints = [
            # Prevents duplicate ingestion if the same JSON file is reprocessed
            models.UniqueConstraint(fields=["device", "timestamp"], name="unique_device_timestamp")
        ]