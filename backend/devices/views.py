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


#device models

class DeviceListAPIView(APIView):
    

    def get(self, request):

        devices = Device.objects.all()

        # Search
        search = request.query_params.get("search")
        if search:
            devices = devices.filter(
                name__icontains=search
            )

        # Sort
        ordering = request.query_params.get("ordering")

        allowed_fields = {
            "name",
            "status",
            "manufacturer",
            "model_number",
            "created_at",
            "updated_at",
        }

        if ordering:
            field = ordering.lstrip("-")

            if field in allowed_fields:
                devices = devices.order_by(ordering)

        serializer = DeviceSerializer(devices, many=True)

        return Response(serializer.data)
    
class DeviceDetailAPIView(APIView):

    def get_object(self,id):
        return get_object_or_404(Device,id=id)
    
    def get(self,request,id):
        device = self.get_object(id)
        serializer = DeviceSerializer(device)
        return Response(serializer.data)
    
    
    def put(self,request,id):
        device = self.get_object(id)
        serializer = DeviceSerializer(device,data=request.data)
        
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
            # Strips timezone info and converts date/datetime to plain strings —
            # avoids the openpyxl "no timezones" crash and keeps CSV/JSON consistent.
            if hasattr(value, "isoformat"):
                return value.isoformat()
            return value

        # Group measurements under their device instead of repeating device info per row
        grouped = {}
        for measurement in measurements.order_by("device_id", "timestamp"):
            device = measurement.device
            if device.id not in grouped:
                grouped[device.id] = {
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

        elif export_format == "xlsx":
            wb = Workbook()
            ws = wb.active
            ws.title = "Export"

            for entry in devices_data:
                # Device info block, written once per device
                for key, value in entry["device"].items():
                    ws.append([key, value])
                ws.append([])  # spacer row

                # Measurement table header + rows for this device
                if measurement_fields:
                    ws.append(measurement_fields)
                    for m in entry["measurements"]:
                        ws.append([m.get(f) for f in measurement_fields])
                ws.append([])  # spacer before next device
                ws.append([])

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

            for entry in devices_data:
                for key, value in entry["device"].items():
                    writer.writerow([key, value])
                writer.writerow([])

                if measurement_fields:
                    writer.writerow(measurement_fields)
                    for m in entry["measurements"]:
                        writer.writerow([m.get(f) for f in measurement_fields])
                writer.writerow([])
                writer.writerow([])

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

    