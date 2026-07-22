from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from rest_framework.permissions import AllowAny

from .models import Device,Measurement
from .serializers import DeviceSerializer,MeasurementSerializer

#device models

class DeviceListAPIView(APIView):
    
    permission_classes = [AllowAny]

    def get(self, request):
        search = request.query_params.get("search")
        if search:
            devices = Device.objects.filter(name__icontains=search)
        else:
            devices = Device.objects.all()

        serializer = DeviceSerializer(devices,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
    permission_classes = [AllowAny]    
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