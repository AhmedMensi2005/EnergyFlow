from rest_framework import viewsets

from .models import AirConditioner
from .serializers import AirConditionerSerializer


class AirConditionerViewSet(viewsets.ModelViewSet):

    queryset = AirConditioner.objects.all()

    serializer_class = AirConditionerSerializer