from rest_framework import serializers

from .models import AirConditioner


class AirConditionerSerializer(serializers.ModelSerializer):

    room_name = serializers.CharField(
        source="room.name",
        read_only=True
    )

    class Meta:
        model = AirConditioner

        fields = [
            "id",
            "name",
            "model",
            "status",
            "room",
            "created_at",
            "updated_at",
        ]