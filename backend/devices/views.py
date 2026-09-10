from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from rest_framework.permissions import AllowAny

import csv
import json

from django.http import HttpResponse
from django.utils.dateparse import parse_datetime

from openpyxl import Workbook

from .models import Device,Measurement
from .serializers import DeviceSerializer,MeasurementSerializer

from django.core.management import call_command

from django.db.models import OuterRef, Subquery


#device models

class DeviceListAPIView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        # --------------------------------
        # Latest measurement for each device
        # --------------------------------

        latest_measurement = (
            Measurement.objects
            .filter(device=OuterRef("pk"))
            .order_by("-timestamp")
        )

        devices = (
            Device.objects
            .annotate(

                latest_power=Subquery(
                    latest_measurement.values("power")[:1]
                ),

                latest_temperature=Subquery(
                    latest_measurement.values("temperature")[:1]
                ),

            )
        )

        # --------------------------------
        # Search
        # --------------------------------

        search = request.query_params.get("search")

        if search:

            devices = devices.filter(
                name__icontains=search
            )

        # --------------------------------
        # Sort
        # --------------------------------

        ordering = request.query_params.get("ordering")

        allowed_fields = {

            "name",
            "status",

            "latest_power",
            "latest_temperature",

            "last_operating_state",

            "created_at",
            "updated_at",

        }

        # Map frontend values → database values

        ordering_map = {

            "power": "latest_power",

            "temperature": "latest_temperature",

            "operating_state": "last_operating_state",

        }

        if ordering:

            descending = ordering.startswith("-")

            field = ordering.lstrip("-")

            # Convert frontend name
            field = ordering_map.get(
                field,
                field
            )

            if field in allowed_fields:

                final_ordering = (
                    f"-{field}"
                    if descending
                    else field
                )

                devices = devices.order_by(
                    final_ordering
                )

        serializer = DeviceSerializer(
            devices,
            many=True
        )

        return Response(
            serializer.data
        )
    
class DeviceDetailAPIView(APIView):

    def get_object(self,id):
        return get_object_or_404(Device,id=id)
    
    def get(self,request,id):
        device = self.get_object(id)
        serializer = DeviceSerializer(device)
        return Response(serializer.data)
    
    
    def put(self,request,id):
        device = self.get_object(id)
        serializer = DeviceSerializer(device,data=request.data,partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

#Measurements views

class MeasuremenstListAPIView(APIView):
    def get(self, request):
        search = request.query_params.get("search")
        if search:
            measurements = Measurement.objects.filter(device__name__icontains=search)
        else:
            measurements = Measurement.objects.all()

        serializer = MeasurementSerializer(measurements,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class LatestMeasuremenstListAPIView(APIView):
    
    def get(self, request):
        latest = []
        devices = Device.objects.all()

        for device in devices:
            measurement = Measurement.objects.filter(device=device).first()
            if measurement:
                latest.append(measurement)
        serializer = MeasurementSerializer(latest, many=True)
        return Response(serializer.data)
    

class MeasurmentDetailAPIView(APIView):

    def get_object(self,id):
        return get_object_or_404(Measurement,id=id)
    
    def get(self,request,id):
        measurement = self.get_object(id)
        serializer = MeasurementSerializer(measurement)
        return Response(serializer.data)

class DeviceMeasurementsAPIView(APIView):

    def get(self, request, id):
        measurements = Measurement.objects.filter(device_id=id)
        
        start = request.query_params.get("start")
        end = request.query_params.get("end")

        if start:
            measurements = measurements.filter(timestamp__gte=parse_datetime(start))
        if end:
            measurements = measurements.filter(timestamp__lte=parse_datetime(end))
        serializer = MeasurementSerializer(measurements, many=True)
        return Response(serializer.data)
    

class LatestDeviceMeasurementAPIView(APIView):
    def get(self, request, id):
        measurements = Measurement.objects.filter(device_id=id).first
        serializer = MeasurementSerializer(measurements)
        return Response(serializer.data)

class ChartDeviceMeasurementAPIView(APIView):

    def get(self, request, id):
        measurements = (
            Measurement.objects
            .filter(device_id=id)
            .order_by("-timestamp")[:6]
        )

        # Reverse them so they appear oldest -> newest in the chart
        measurements = reversed(measurements)

        data = [
            {
                "time": m.timestamp.strftime("%H:%M"),
                "power": m.power
            }
            for m in measurements
        ]

        return Response(data)





#----------------------
# EXPORT VIEW
#----------------------
class ExportMeasurementsAPIView(APIView):

    def get(self, request):
        measurements = Measurement.objects.select_related("device", "device__room").all()
        start = request.query_params.get("start")
        end = request.query_params.get("end")
        if start:
            measurements = measurements.filter(timestamp__gte=parse_datetime(start))
        if end:
            measurements = measurements.filter(timestamp__lte=parse_datetime(end))

        fields = request.query_params.getlist("fields")
        if not fields:
            return HttpResponse("No fields selected.", status=400)

        export_format = request.query_params.get("export_format", "csv")

        device_fields = [f for f in fields if f.startswith("device.")]
        measurement_fields = [f for f in fields if not f.startswith("device.")]

        def get_device_value(device, field):
            attribute = field.replace("device.", "")
            if attribute == "room":
                return device.room.name if device.room else None
            return getattr(device, attribute, None)

        def get_measurement_value(measurement, field):
            return getattr(measurement, field, None)

        def normalize(value):
            if hasattr(value, "isoformat"):
                return value.isoformat()
            return value

        grouped = {}
        for measurement in measurements.order_by("device_id", "timestamp"):
            device = measurement.device
            if device.id not in grouped:
                grouped[device.id] = {
                    "external_id": device.external_id,
                    "device": {f: normalize(get_device_value(device, f)) for f in device_fields},
                    "measurements": [],
                }
            grouped[device.id]["measurements"].append(
                {f: normalize(get_measurement_value(measurement, f)) for f in measurement_fields}
            )

        devices_data = list(grouped.values())

        if export_format == "json":
            response = HttpResponse(
                json.dumps(devices_data, default=str, indent=2),
                content_type="application/json",
            )
            response["Content-Disposition"] = 'attachment; filename="measurements.json"'
            return response

        # For CSV/XLSX: external_id is always the first column (forced identifier).
        # Any other selected device fields (name, room, etc.) become extra flat
        # columns, so they show up once per measurement row rather than nested.
        extra_device_fields = [f for f in device_fields if f != "device.external_id"]
        extra_device_headers = [f.replace("device.", "") for f in extra_device_fields]

        if export_format == "xlsx":
            wb = Workbook()
            ws = wb.active
            ws.title = "Export"

            ws.append(["external_id"] + extra_device_headers + measurement_fields)

            for entry in devices_data:
                device_values = [entry["device"].get(f) for f in extra_device_fields]
                for m in entry["measurements"]:
                    ws.append(
                        [entry["external_id"]] + device_values + [m.get(f) for f in measurement_fields]
                    )

            response = HttpResponse(
                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
            response["Content-Disposition"] = 'attachment; filename="measurements.xlsx"'
            wb.save(response)
            return response

        else:  # csv
            response = HttpResponse(content_type="text/csv")
            response["Content-Disposition"] = 'attachment; filename="measurements.csv"'
            writer = csv.writer(response)

            writer.writerow(["external_id"] + extra_device_headers + measurement_fields)
            for entry in devices_data:
                device_values = [entry["device"].get(f) for f in extra_device_fields]
                for m in entry["measurements"]:
                    writer.writerow(
                        [entry["external_id"]] + device_values + [m.get(f) for f in measurement_fields]
                    )

            return response


#--------------------------
#scheduler
#----------------------------
class ImportDevicesAPIView(APIView):

    permission_classes = [AllowAny]   # later replace with authentication

    def post(self, request):
        call_command("import_devices")

        return Response({
            "success": True,
            "message": "Import completed."
        })
class OnDevicesAPIView(APIView):

    def get(self, request):

        devices = Device.objects.select_related("room").all()

        on_devices = devices.filter(
            last_operating_state__iexact="on"
        )

        serializer = DeviceSerializer(
            on_devices,
            many=True
        )

        on_devices_data = serializer.data

        for device_data, device in zip(on_devices_data, on_devices):
            device_data["room_name"] = (
                device.room.name
                if device.room
                else None
            )

        return Response({
            "total_devices": devices.count(),
            "on_devices": on_devices_data,
        }, status=status.HTTP_200_OK)
