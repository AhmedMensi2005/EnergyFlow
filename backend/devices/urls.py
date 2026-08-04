from django.urls import path
from .views import *

urlpatterns = [
    path("devices/", DeviceListAPIView.as_view(), name="device-list"),
    path("devices/<int:id>/", DeviceDetailAPIView.as_view(), name="device-detail"),
    
    path("measurements/", MeasuremenstListAPIView.as_view(), name="measurement-detail"),
    path("measurements/<int:id>/", MeasurmentDetailAPIView.as_view(), name="measurement-detail"),

    path("devices/<int:id>/mesurements/", DeviceMeasurementsAPIView.as_view(), name="device-measurements"),

    path("devices/<int:id>/measurements/chart/",ChartDeviceMeasurementAPIView.as_view()),
    path("devices/<int:id>/mesurements/latest/", LatestDeviceMeasurementAPIView.as_view(), name="device-measurements-latest"),
    path("measurements/latest/", LatestMeasuremenstListAPIView.as_view(), name="device-measurements"),

    #export
    path("measurements/export/",ExportMeasurementsAPIView.as_view()),

    #scheduler
    path("import/", ImportDevicesAPIView.as_view()),

]