from django.utils import timezone
from django.db.models import Max
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
# ALERT HEATMAP
# ============================================================

class AlertHeatmapView(APIView):

    SEVERITY_LEVELS = {
        "low": 1,
        "medium": 2,
        "high": 3,
        "critical": 4,
    }

    def get(self, request):

        month = request.query_params.get("month")

        if not month:
            return Response(
                {
                    "error": "Month is required. Use YYYY-MM."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            year, month_number = map(
                int,
                month.split("-")
            )

            if month_number < 1 or month_number > 12:
                raise ValueError

        except (ValueError, TypeError):

            return Response(
                {
                    "error": "Invalid month format. Use YYYY-MM."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        start_date = timezone.datetime(
            year,
            month_number,
            1,
            tzinfo=timezone.get_current_timezone()
        )

        if month_number == 12:
            end_date = timezone.datetime(
                year + 1,
                1,
                1,
                tzinfo=timezone.get_current_timezone()
            )
        else:
            end_date = timezone.datetime(
                year,
                month_number + 1,
                1,
                tzinfo=timezone.get_current_timezone()
            )

        alerts = Alert.objects.filter(
            created_at__gte=start_date,
            created_at__lt=end_date,
        ).values(
            "created_at",
            "severity"
        )

        daily_levels = {}

        for alert in alerts:

            date = timezone.localtime(
                alert["created_at"]
            ).date()

            date_string = date.isoformat()

            level = self.SEVERITY_LEVELS.get(
                alert["severity"],
                0
            )

            daily_levels[date_string] = max(
                daily_levels.get(date_string, 0),
                level
            )

        data = [
            {
                "date": date,
                "level": level,
            }
            for date, level in sorted(
                daily_levels.items()
            )
        ]

        return Response(
            {
                "month": month,
                "data": data,
            },
            status=status.HTTP_200_OK
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

class UnsolvedAlertsAPIView(APIView):

    def get(self, request):

        alerts = Alert.objects.select_related(
            "device",
            "device__room",
            "rule"
        ).all()

        unsolved_alerts = alerts.exclude(
            status=Alert.Status.RESOLVED
        )

        serializer = AlertSerializer(
            unsolved_alerts,
            many=True
        )

        unsolved_alerts_data = serializer.data

        for alert_data, alert in zip(
            unsolved_alerts_data,
            unsolved_alerts
        ):
            alert_data["device_name"] = (
                alert.device.name
                if alert.device
                else None
            )

            alert_data["room_name"] = (
                alert.device.room.name
                if alert.device and alert.device.room
                else None
            )

        return Response(
            {
                "total_alerts": alerts.count(),
                "unsolved_alerts": unsolved_alerts_data,
            },
            status=status.HTTP_200_OK
        )