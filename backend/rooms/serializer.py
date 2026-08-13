from rest_framework import serializers
from devices.models import Device, Measurement
from rooms.models import Room
from django.db.models import Sum

class RoomSerializer(serializers.ModelSerializer):

    device_count = serializers.IntegerField(source="devices.count",read_only=True)
    consumption = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            "id",
            "name",
            "area",
            "floor",
            "description",
            "device_count",
            "consumption",
        ]

    def get_consumption(self, room):
        result = Measurement.objects.filter(device__room=room).aggregate(total=Sum("energy_delta"))
        return result["total"] or 0