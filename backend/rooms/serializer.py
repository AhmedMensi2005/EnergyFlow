from rest_framework import serializers
from devices.models import Device, Measurement
from rooms.models import Room
from django.db.models import Sum

class RoomSerializer(serializers.ModelSerializer):

    device_count = serializers.IntegerField(read_only=True)
    consumption = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ["id", "name", "area", "floor", "description", "device_count", "consumption"]

    def get_consumption(self, room):
        # Sum() returns None for rooms with no measurements yet — normalize to 0
        return getattr(room, "consumption", None) or 0