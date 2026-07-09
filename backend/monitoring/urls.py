from django.urls import include, path

from rest_framework.routers import DefaultRouter

from .views import AirConditionerViewSet

router = DefaultRouter()

router.register("air-conditioners", AirConditionerViewSet, basename="air-conditioner")

urlpatterns = [
    path("", include(router.urls)),
]