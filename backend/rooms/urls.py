from django.urls import path
from .views import *

urlpatterns = [
    path("rooms/",RoomListAPIView.as_view(),name="room-list"),
    path("rooms/<int:id>/",RoomDetailAPIView.as_view(),name="room-detail"),
]