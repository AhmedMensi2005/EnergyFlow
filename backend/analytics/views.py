from datetime import timedelta

from django.utils import timezone
from django.db.models import Sum, Avg
from django.db.models.functions import TruncHour, TruncDay, TruncWeek, TruncMonth

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rooms.models import Room
from devices.models import Device, Measurement
import requests





class AnalyticsKPIAPIView(APIView):

    def get(self, request):

        # ==================================================
        # PERIOD
        # ==================================================

        period = request.query_params.get("period", "7d")
        period_days = {
            "24h": 1,
            "7d": 7,
            "30d": 30,
            "3m": 90,
            "6m": 180,
            "1y": 365,
        }
        days = period_days.get(period, 7)

        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)

        # MEASUREMENTS FOR SELECTED PERIOD
        measurements = Measurement.objects.filter(timestamp__gte=start_date, timestamp__lte=end_date)

        total_rooms = Room.objects.count()

        total_devices = Device.objects.count()

        total_consumption = (measurements.aggregate(total=Sum("energy_delta"))["total"] or 0)


        average_consumption = (
            total_consumption / total_devices
            if total_devices > 0
            else 0
        )

        on_devices = Device.objects.filter(last_operating_state="on").count()

        average_power = (measurements.aggregate(average=Avg("power"))["average"] or 0)

        data = {
            "period": period,
            "startDate": start_date,
            "endDate": end_date,

            "totalRooms": total_rooms,
            "totalDevices": total_devices,
            "totalConsumption": round(total_consumption,2),
            "averageConsumption": round(average_consumption,2),
            "activeDevices": on_devices,
            "averagePower": round(average_power,2),
        }


        return Response(data,status=status.HTTP_200_OK)




class ConsumptionAnalyticsAPIView(APIView):

    PERIOD_CONFIG = {
        "24h": {
            "days": 1,
            "truncation": "hour",
        },
        "7d": {
            "days": 7,
            "truncation": "day",
        },
        "30d": {
            "days": 30,
            "truncation": "day",
        },
        "3m": {
            "days": 90,
            "truncation": "week",
        },
        "6m": {
            "days": 180,
            "truncation": "month",
        },
        "1y": {
            "days": 365,
            "truncation": "month",
        },
    }

    TRUNC_FUNCTIONS = {
        "hour": TruncHour,
        "day": TruncDay,
        "week": TruncWeek,
        "month": TruncMonth,
    }

    def get(self, request):

        period = request.query_params.get("period", "7d")
        metric = request.query_params.get("metric", "energy")

        #verify
        if (period not in self.PERIOD_CONFIG) or (metric not in ["energy", "power"]):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        config = self.PERIOD_CONFIG[period]


        end_date = timezone.now()
        start_date = end_date - timedelta(days=config["days"])

        measurements = Measurement.objects.filter(timestamp__gte=start_date,timestamp__lte=end_date)

        TruncFunction = self.TRUNC_FUNCTIONS[config["truncation"]]

        measurements = (measurements.annotate(period=TruncFunction("timestamp")))

        # Select metric aggregation
        if metric == "energy":
            data = (
                measurements
                .values("period")
                .annotate(
                    value=Sum("energy_delta")
                )
                .order_by("period")
            )

        else:
            data = (
                measurements
                .values("period")
                .annotate(
                    value=Avg("power") / 1000.0
                )
                .order_by("period")
            )

        # -------------------------
        # Format response
        # -------------------------

        response_data = []

        for item in data:

            period_date = item["period"]

            if config["truncation"] == "hour":
                label = period_date.strftime("%H:%M")

            elif config["truncation"] == "day":
                label = period_date.strftime("%b %d")

            elif config["truncation"] == "week":
                label = period_date.strftime("%b %d")

            elif config["truncation"] == "month":
                label = period_date.strftime("%b")

            else:
                label = str(period_date)

            response_data.append(
                {
                    "date": label,
                    "value": round(
                        float(item["value"] or 0),
                        2
                    ),
                }
            )

        # -------------------------
        # Final response
        # -------------------------

        return Response(
            {
                "period": period,
                "metric": metric,
                "unit": (
                    "kWh"
                    if metric == "energy"
                    else "kW"
                ),
                "data": response_data,
            },
            status=status.HTTP_200_OK,
        )


class TopDevicesAnalyticsAPIView(APIView):

    PERIOD_DAYS = {
        "24h": 1,
        "7d": 7,
        "30d": 30,
        "3m": 90,
        "6m": 180,
        "1y": 365,
    }

    def get(self, request):

        period = request.query_params.get("period", "7d")
        metric = request.query_params.get("metric", "energy")
        #verify
        if period not in self.PERIOD_DAYS:
            return Response(
                {"error": "Invalid period"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if metric not in ["energy", "power"]:
            return Response(
                {"error": "Invalid metric"},
                status=status.HTTP_400_BAD_REQUEST
            )
        #------------

        end_date = timezone.now()
        start_date = end_date - timedelta(days=self.PERIOD_DAYS[period])

        measurements = Measurement.objects.filter(timestamp__gte=start_date,timestamp__lte=end_date)

        if metric == "energy":
            data = (
                measurements
                .values(
                    "device__id",
                    "device__name",
                )
                .annotate(
                    value=Sum("energy_delta")
                )
                .order_by("-value")[:5]
            )
            unit = "kWh"

        else:
            data = (
                measurements
                .values(
                    "device__id",
                    "device__name",
                )
                .annotate(
                    value=Avg("power")
                )
                .order_by("-value")[:5]
            )

            unit = "kW"

        response_data = []

        for item in data:
            response_data.append({
                "id": item["device__id"],
                "name": item["device__name"],
                "consumption": round(float(item["value"] or 0), 2),
            })

        return Response({
            "period": period,
            "metric": metric,
            "unit": unit,
            "data": response_data,
        })


class TopRoomsAnalyticsAPIView(APIView):

    PERIOD_DAYS = {
        "24h": 1,
        "7d": 7,
        "30d": 30,
        "3m": 90,
        "6m": 180,
        "1y": 365,
    }

    def get(self, request):

        period = request.query_params.get("period", "7d")
        metric = request.query_params.get("metric", "energy")
        #verify
        if period not in self.PERIOD_DAYS:
            return Response(
                {"error": "Invalid period"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if metric not in ["energy", "power"]:
            return Response(
                {"error": "Invalid metric"},
                status=status.HTTP_400_BAD_REQUEST
            )
        #-----------------

        end_date = timezone.now()
        start_date = end_date - timedelta(days=self.PERIOD_DAYS[period])

        measurements = Measurement.objects.filter(timestamp__gte=start_date,timestamp__lte=end_date)

        if metric == "energy":
            data = (
                measurements
                .values(
                    "device__room__id",
                    "device__room__name",
                )
                .annotate(
                    value=Sum("energy_delta")
                )
                .order_by("-value")[:5]
            )
            unit = "kWh"

        else:
            data = (
                measurements
                .values(
                    "device__room__id",
                    "device__room__name",
                )
                .annotate(
                    value=Avg("power")
                )
                .order_by("-value")[:5]
            )
            unit = "kW"

        response_data = []

        for item in data:

            response_data.append({
                "id": item["device__room__id"],
                "name": item["device__room__name"],
                "consumption": round(float(item["value"] or 0), 2),
            })

        return Response({
            "period": period,
            "metric": metric,
            "unit": unit,
            "data": response_data,
        })



class RoomDistributionAnalyticsAPIView(APIView):

    PERIOD_DAYS = {
        "24h": 1,
        "7d": 7,
        "30d": 30,
        "3m": 90,
        "6m": 180,
        "1y": 365,
    }

    def get(self, request):

        period = request.query_params.get("period", "7d")
        metric = request.query_params.get("metric", "energy")
        #verify
        if period not in self.PERIOD_DAYS:
            return Response(
                {"error": "Invalid period"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if metric not in ["energy", "power"]:
            return Response(
                {"error": "Invalid metric"},
                status=status.HTTP_400_BAD_REQUEST
            )
        #----------------------------
        end_date = timezone.now()
        start_date = end_date - timedelta(days=self.PERIOD_DAYS[period])

        measurements = Measurement.objects.filter(timestamp__gte=start_date,timestamp__lte=end_date)

        if metric == "energy":
            data = (
                measurements
                .values(
                    "device__room__id",
                    "device__room__name",
                )
                .annotate(
                    value=Sum("energy_delta")
                )
                .order_by("-value")
            )
            unit = "kWh"

        else:
            data = (
                measurements
                .values(
                    "device__room__id",
                    "device__room__name",
                )
                .annotate(
                    value=Avg("power")
                )
                .order_by("-value")
            )

            unit = "kW"

        response_data = []

        colors = [
            "var(--chart-blue)",
            "var(--online-color)",
            "var(--chart-orange)",
            "var(--chart-purple)",
            "var(--chart-red)",
            "var(--secondary-dark)",
            "var(--chart-pink)",
            "var(--chart-lime)",
            "var(--chart-deep-orange)",
            "var(--chart-indigo)",
        ]

        for index, item in enumerate(data):

            response_data.append({
                "id": item["device__room__id"],
                "name": item["device__room__name"],
                "consumption": round(float(item["value"] or 0),2),
                "color": colors[index % len(colors)],
            })

        return Response({
            "period": period,
            "metric": metric,
            "unit": unit,
            "data": response_data,
        })

class EnvironmentAPIView(APIView):

    def get(self, request):

        latitude = 36.8065
        longitude = 10.1815

        try:
            response = requests.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": latitude,
                    "longitude": longitude,

                    "current": (
                        "temperature_2m,"
                        "relative_humidity_2m,"
                        "apparent_temperature,"
                        "weather_code,"
                        "wind_speed_10m"
                    ),

                    "hourly": (
                        "temperature_2m,"
                        "weather_code"
                    ),

                    "forecast_hours": 6,

                    "timezone": "Africa/Tunis",
                },
                timeout=10,
            )

            response.raise_for_status()

            data = response.json()

            current = data["current"]

            weather_codes = {
                0: "Clear",
                1: "Mainly clear",
                2: "Partly cloudy",
                3: "Overcast",
                45: "Fog",
                48: "Rime fog",
                51: "Light drizzle",
                53: "Drizzle",
                55: "Heavy drizzle",
                61: "Light rain",
                63: "Rain",
                65: "Heavy rain",
                71: "Light snow",
                73: "Snow",
                75: "Heavy snow",
                80: "Rain showers",
                81: "Rain showers",
                82: "Heavy rain showers",
                95: "Thunderstorm",
                96: "Thunderstorm with hail",
                99: "Thunderstorm with heavy hail",
            }

            # =================================
            # Next 5 hours
            # =================================

            hourly = data.get("hourly", {})

            hourly_times = hourly.get("time", [])
            hourly_temperatures = hourly.get(
                "temperature_2m",
                []
            )
            hourly_codes = hourly.get(
                "weather_code",
                []
            )

            next_hours = []

            for i in range(min(5, len(hourly_times))):

                next_hours.append(
                    {
                        "time": hourly_times[i],
                        "temperature": hourly_temperatures[i],
                        "weather_code": hourly_codes[i],
                        "condition": weather_codes.get(
                            hourly_codes[i],
                            "Unknown",
                        ),
                    }
                )

            return Response(
                {
                    "location": "Tunis",

                    "temperature": current.get(
                        "temperature_2m"
                    ),

                    "feels_like": current.get(
                        "apparent_temperature"
                    ),

                    "humidity": current.get(
                        "relative_humidity_2m"
                    ),

                    "condition": weather_codes.get(
                        current.get("weather_code"),
                        "Unknown",
                    ),

                    "wind": current.get(
                        "wind_speed_10m"
                    ),

                    "updated_at": current.get("time"),

                    "next_hours": next_hours,
                },

                status=status.HTTP_200_OK,
            )

        except requests.RequestException as error:

            print(
                "OPEN METEO ERROR:",
                error
            )

            return Response(
                {
                    "detail": "Unable to retrieve weather data.",
                    "error": str(error),
                },

                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        except Exception as error:

            print(
                "ENVIRONMENT API ERROR:",
                error
            )

            return Response(
                {
                    "detail": "Environment API error.",
                    "error": str(error),
                },

                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )