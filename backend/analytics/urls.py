from django.urls import path

from .views import *


urlpatterns = [
    path("analytics/kpis/",AnalyticsKPIAPIView.as_view(),name="analytics-kpis"),
    path("analytics/consumption/",ConsumptionAnalyticsAPIView.as_view(),name="analytics-consumption",),
    path("analytics/top-rooms/",TopRoomsAnalyticsAPIView.as_view(),name="analytics-top-rooms",),
    path("analytics/top-devices/",TopDevicesAnalyticsAPIView.as_view(),name="analytics-top-devices",),
    path("analytics/room-distribution/",RoomDistributionAnalyticsAPIView.as_view(),name="analytics-room-distribution",),
]