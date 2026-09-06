from devices.models import Device, Measurement
from devices.services.parser import *
from django.utils import timezone


def device_importer(data):

    ocf = data.get("ocf", {})

    device, created = Device.objects.update_or_create(
        external_id=data["deviceId"],

        defaults={
            "category": Device.Category.AIR_CONDITIONER,
            "manufacturer": data.get("manufacturerName", ""),
            "model_number": (
                ocf.get("modelNumber")
                or data.get("deviceManufacturerCode", "")
            ),
            "serial_number": ocf.get("serialNumber", ""),
            "firmware_version": ocf.get("firmwareVersion", ""),
            "presentation_id": data.get("presentationId", ""),
            "location_id": data.get("locationId", ""),
            "owner_id": data.get("ownerId", ""),
            "device_type": data.get("deviceTypeName", ""),
            "metadata": {
                "deviceTypeId": data.get("deviceTypeId"),
                "profileId": data.get("profile", {}).get("id"),
                "manufacturerCode": data.get("deviceManufacturerCode"),
                "ocf": ocf,
                "components": data.get("components", {}),
            },
        },

        create_defaults={
            "name": data.get("name", ""),
            "label": data.get("label", ""),
            "category": Device.Category.AIR_CONDITIONER,
            "manufacturer": data.get("manufacturerName", ""),
            "model_number": (
                ocf.get("modelNumber")
                or data.get("deviceManufacturerCode", "")
            ),
            "serial_number": ocf.get("serialNumber", ""),
            "firmware_version": ocf.get("firmwareVersion", ""),
            "presentation_id": data.get("presentationId", ""),
            "location_id": data.get("locationId", ""),
            "owner_id": data.get("ownerId", ""),
            "device_type": data.get("deviceTypeName", ""),
            "metadata": {
                "deviceTypeId": data.get("deviceTypeId"),
                "profileId": data.get("profile", {}).get("id"),
                "manufacturerCode": data.get("deviceManufacturerCode"),
                "ocf": ocf,
                "components": data.get("components", {}),
            },
        },
    )

    return device


def measurements_importer(data, device):

    # ---------- Basic operating state ----------
    switch = get_capability(data, "switch")
    operating_state = get_value(switch, "switch")

    mode = get_capability(data, "airConditionerMode")
    mode_value = get_value(mode, "airConditionerMode")

    fan = get_capability(data, "airConditionerFanMode")
    fan_mode = get_value(fan, "fanMode")

    # ---------- Temperature ----------
    temperature = get_capability(data, "temperatureMeasurement")
    temp = get_value(temperature, "temperature")

    cooling = get_capability(data, "thermostatCoolingSetpoint")
    target = get_value(cooling, "coolingSetpoint")

    humidity = get_capability(data, "relativeHumidityMeasurement")
    humidity_value = get_value(humidity, "humidity")

    # ---------- Energy ----------
    power_report = get_capability(data, "powerConsumptionReport")
    power_consumption = get_value(power_report, "powerConsumption", {})
    power = power_consumption.get("power")
    energy_total = power_consumption.get("energy")
    energy_delta = power_consumption.get("deltaEnergy")
    energy_saved = power_consumption.get("energySaved")
    power_energy = power_consumption.get("powerEnergy")

    timestamp = (
        get_timestamp(power_report, "powerConsumption")
        or get_timestamp(temperature, "temperature")
        or timezone.now()
    )

    # ---------- Samsung AC ----------
    swing = get_capability(data, "fanOscillationMode")
    swing_mode = get_value(swing, "fanOscillationMode")

    optional_mode_cap = get_capability(data, "custom.airConditionerOptionalMode")
    optional_mode = get_value(optional_mode_cap, "acOptionalMode")

    sleep_mode = optional_mode in ("sleep", "windFreeSleep")
    wind_free = optional_mode in ("windFree", "windFreeSleep")

    filter_cap = get_capability(data, "custom.dustFilter")
    filter_status = get_value(filter_cap, "dustFilterStatus")
    filter_usage = get_value(filter_cap, "dustFilterUsage")

    # ---------- Save ----------
    Measurement.objects.update_or_create(
        device=device,
        timestamp=timestamp,
        defaults={
            "power": power,
            "energy_total": energy_total,
            "energy_delta": energy_delta,
            "energy_saved": energy_saved,
            "power_energy": power_energy,

            "temperature": temp,
            "target_temperature": target,
            "humidity": humidity_value,

            "operating_state": operating_state or "",
            "mode": mode_value or "",
            "fan_mode": fan_mode or "",
            "swing_mode": swing_mode or "",
            "sleep_mode": sleep_mode,
            "wind_free": wind_free,

            "filter_status": filter_status or "",
            "filter_usage": filter_usage,

            "extra_data": {
                "health": data.get("healthState"),
                "execution": data.get("executionContext"),
                "units": {
                    "power": get_unit(power_report, "powerConsumption"),
                    "temperature": get_unit(temperature, "temperature"),
                    "humidity": get_unit(humidity, "humidity"),
                },
            },
        },
    )

    device.last_seen_at = timestamp
    device.last_operating_state = operating_state
    device.save()