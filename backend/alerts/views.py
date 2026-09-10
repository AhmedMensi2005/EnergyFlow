from django.utils import timezone

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Alert, AlertRule
from .serializers import AlertSerializer, AlertRuleSerializer


# ============================================================
# ALERTS
# ============================================================

class AlertListView(generics.ListAPIView):

    queryset = Alert.objects.select_related(
        "device",
        "device__room",
        "rule"
    )

    serializer_class = AlertSerializer

    def get_queryset(self):

        queryset = super().get_queryset()

        status_filter = self.request.query_params.get("status")
        severity = self.request.query_params.get("severity")

        if status_filter:
            queryset = queryset.filter(
                status=status_filter
            )

        if severity:
            queryset = queryset.filter(
                severity=severity
            )

        return queryset


class AlertDetailView(generics.RetrieveAPIView):

    queryset = Alert.objects.select_related(
        "device",
        "device__room",
        "rule"
    )

    serializer_class = AlertSerializer


class AlertUpdateView(APIView):

    def patch(self, request, pk):

        try:
            alert = Alert.objects.get(pk=pk)

        except Alert.DoesNotExist:

            return Response(
                {
                    "error": "Alert not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get("status")

        if new_status not in [
            Alert.Status.ACKNOWLEDGED,
            Alert.Status.RESOLVED
        ]:

            return Response(
                {
                    "error": "Invalid status."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        alert.status = new_status

        if new_status == Alert.Status.ACKNOWLEDGED:
            alert.acknowledged_at = timezone.now()

        elif new_status == Alert.Status.RESOLVED:
            alert.resolved_at = timezone.now()

        alert.save()

        return Response(
            AlertSerializer(alert).data
        )


# ============================================================
# ALERT RULES
# ============================================================

class AlertRuleListCreateView(
    generics.ListCreateAPIView
):

    queryset = AlertRule.objects.select_related(
        "device",
        "room"
    )

    serializer_class = AlertRuleSerializer


class AlertRuleDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = AlertRule.objects.select_related(
        "device",
        "room"
    )

    serializer_class = AlertRuleSerializer