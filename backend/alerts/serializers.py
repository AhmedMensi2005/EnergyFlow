from rest_framework import serializers

from .models import AlertRule, Alert


class AlertRuleSerializer(serializers.ModelSerializer):

    device_name = serializers.CharField(
        source="device.name",
        read_only=True
    )

    room_name = serializers.CharField(
        source="room.name",
        read_only=True
    )

    class Meta:
        model = AlertRule
        fields = [
            "id",
            "name",
            "metric",
            "condition",
            "threshold",
            "severity",
            "device",
            "device_name",
            "room",
            "room_name",
            "enabled",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "device_name",
            "room_name",
        ]


class AlertSerializer(serializers.ModelSerializer):

    device_name = serializers.CharField(
        source="device.name",
        read_only=True
    )

    room_name = serializers.CharField(
        source="device.room.name",
        read_only=True
    )

    rule_name = serializers.CharField(
        source="rule.name",
        read_only=True
    )

    class Meta:
        model = Alert
        fields = [
            "id",
            "device",
            "device_name",
            "room_name",
            "rule",
            "rule_name",
            "severity",
            "status",
            "title",
            "message",
            "current_value",
            "threshold_value",
            "created_at",
            "acknowledged_at",
            "resolved_at",
        ]
        read_only_fields = [
            "id",
            "device_name",
            "room_name",
            "rule_name",
            "created_at",
            "acknowledged_at",
            "resolved_at",
        ]