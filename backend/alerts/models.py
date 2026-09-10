from django.db import models

from devices.models import Device
from rooms.models import Room


class AlertRule(models.Model):

    class Metric(models.TextChoices):
        POWER = "power", "Power"
        ENERGY_TOTAL = "energy_total", "Energy Total"
        ENERGY_DELTA = "energy_delta", "Energy Delta"
        ENERGY_SAVED = "energy_saved", "Energy Saved"
        POWER_ENERGY = "power_energy", "Power Energy"
        TEMPERATURE = "temperature", "Temperature"
        TARGET_TEMPERATURE = "target_temperature", "Target Temperature"
        HUMIDITY = "humidity", "Humidity"
        FILTER_USAGE = "filter_usage", "Filter Usage"

    class Condition(models.TextChoices):
        GREATER_THAN = ">", "Greater than"
        LESS_THAN = "<", "Less than"
        GREATER_OR_EQUAL = ">=", "Greater than or equal"
        LESS_OR_EQUAL = "<=", "Less than or equal"

    class Severity(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        CRITICAL = "critical", "Critical"

    name = models.CharField(
        max_length=150
    )

    metric = models.CharField(
        max_length=50,
        choices=Metric.choices
    )

    condition = models.CharField(
        max_length=5,
        choices=Condition.choices
    )

    threshold = models.FloatField()

    severity = models.CharField(
        max_length=20,
        choices=Severity.choices,
        default=Severity.MEDIUM
    )

    # Specific AC
    device = models.ForeignKey(
        Device,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="alert_rules"
    )

    # All ACs belonging to a room
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="alert_rules"
    )

    # If both device and room are empty,
    # the rule applies globally.
    enabled = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class Alert(models.Model):

    class Status(models.TextChoices):
        NEW = "new", "New"
        ACKNOWLEDGED = "acknowledged", "Acknowledged"
        RESOLVED = "resolved", "Resolved"

    class Severity(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        CRITICAL = "critical", "Critical"

    device = models.ForeignKey(
        Device,
        on_delete=models.CASCADE,
        related_name="alerts"
    )

    rule = models.ForeignKey(
        AlertRule,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alerts"
    )

    severity = models.CharField(
        max_length=20,
        choices=Severity.choices,
        default=Severity.MEDIUM
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW
    )

    title = models.CharField(
        max_length=200
    )

    message = models.TextField()

    current_value = models.FloatField(
        null=True,
        blank=True
    )

    threshold_value = models.FloatField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    acknowledged_at = models.DateTimeField(
        null=True,
        blank=True
    )

    resolved_at = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["status"]
            ),
            models.Index(
                fields=["severity"]
            ),
            models.Index(
                fields=["device", "-created_at"]
            ),
        ]

    def __str__(self):
        return self.title