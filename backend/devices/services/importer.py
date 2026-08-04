from devices.models import Device, Measurement
from devices.services.parser import *
from django.utils import timezone



def device_importer(data):

    ocf = data.get("ocf", {})

    device, created = Device.objects.update_or_create(

        external_id=data["deviceId"],
        

        defaults={

            # Basic information
            "name": data.get("name", ""),
            "label": data.get("label", ""),
            "category": Device.Category.AIR_CONDITIONER,

            # Manufacturer
            "manufacturer": data.get("manufacturerName", ""),
            "model_number": (
                ocf.get("modelNumber")
                or data.get("deviceManufacturerCode", "")
            ),
            "serial_number": ocf.get("serialNumber", ""),

            # New dedicated fields
            "firmware_version": ocf.get("firmwareVersion", ""),
            "presentation_id": data.get("presentationId", ""),
            "location_id": data.get("locationId", ""),
            "owner_id": data.get("ownerId", ""),
            "device_type": data.get("deviceTypeName", ""),

            # Keep only miscellaneous information here
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
    fan_speed = get_value(fan, "fanSpeed")

    # ---------- Temperature ----------
    temperature = get_capability(data, "temperatureMeasurement")
    temp = get_value(temperature, "temperature")

    cooling = get_capability(data, "thermostatCoolingSetpoint")
    target = get_value(cooling, "coolingSetpoint")

    humidity = get_capability(data, "relativeHumidityMeasurement")
    humidity_value = get_value(humidity, "humidity")

    # ---------- Electrical ----------
    voltage_cap = get_capability(data, "voltageMeasurement")
    voltage = get_value(voltage_cap, "voltage")

    current_cap = get_capability(data, "currentMeasurement")
    current = get_value(current_cap, "current")

    # ---------- Energy ----------
    power_report = get_capability(data, "powerConsumptionReport")
    power_consumption = get_value(power_report,"powerConsumption",{})
    power = power_consumption.get("power")

    energy_total = power_consumption.get("energy")
    energy_delta = power_consumption.get("deltaEnergy")

    timestamp = (get_timestamp(power_report, "powerConsumption") or get_timestamp(temperature, "temperature") or timezone.now())

    # ---------- Samsung AC ----------
    swing = get_capability(data, "fanOscillationMode")          # was "airConditionerFanOscillationMode"
    swing_mode = get_value(swing, "fanOscillationMode")

    optional_mode_cap = get_capability(data, "custom.airConditionerOptionalMode")
    optional_mode = get_value(optional_mode_cap, "acOptionalMode")  # "off"/"sleep"/"quiet"/"smart"/"speed"/"windFree"/"windFreeSleep"

    eco = get_capability(data, "airConditionerEcoMode")
    eco_mode = to_bool(get_value(eco, "ecoMode"))

    sleep_mode = optional_mode in ("sleep", "windFreeSleep")     
    wind_free = optional_mode in ("windFree", "windFreeSleep")   

    filter_cap = get_capability(data, "custom.dustFilter")       # was "airConditionerFilter"
    filter_status = get_value(filter_cap, "dustFilterStatus")


    # ---------- Thermostat ----------
    thermostat = get_capability(data,"thermostatOperatingState")
    thermostat_state = get_value(thermostat,"thermostatOperatingState")

    defrost = (thermostat_state == "defrost"
        if thermostat_state
        else None
    )

    # ---------- Air quality ----------
    air_quality_cap = get_capability(data,"airQualitySensor")
    air_quality = get_value(air_quality_cap,"airQuality")

    co2_cap = get_capability(data,"carbonDioxideMeasurement")
    co2 = get_value(co2_cap,"carbonDioxide")

    dust = get_capability(data,"dustSensor")

    pm10 = get_value(dust, "dustLevel")
    pm25 = get_value(dust, "fineDustLevel")
    very_fine_dust_cap = get_capability(data, "veryFineDustSensor")
    pm100 = get_value(very_fine_dust_cap, "veryFineDustLevel")

    # ---------- Save ----------
    Measurement.objects.update_or_create(
        device=device,
        timestamp=timestamp,
        defaults={

            "power": power,
            "energy_total": energy_total,
            "energy_delta": energy_delta,
            "voltage": voltage,
            "current": current,

            "temperature": temp,
            "target_temperature": target,
            "humidity": humidity_value,

            "operating_state": operating_state or "",
            "mode": mode_value or "",
            "fan_mode": fan_mode or "",

            "fan_speed": fan_speed,
            "swing_mode": swing_mode or "",
            "eco_mode": eco_mode,
            "sleep_mode": sleep_mode,
            "wind_free": wind_free,

            "filter_status": filter_status or "",
            "defrost": defrost,
            "air_quality": air_quality,
            "co2": co2,
            "pm10": pm10,
            "pm25": pm25,
            "pm100": pm100,

            "extra_data": {
                "health": data.get("healthState"),
                "execution": data.get("executionContext"),
                "units": {
                    "power": get_unit(power_report, "powerConsumption"),
                    "temperature": get_unit(temperature, "temperature"),
                    "humidity": get_unit(humidity, "humidity"),
                }
            },

        },
    )

    # Update cached device information
    device.last_seen_at = timestamp
    device.last_operating_state = operating_state
    device.save()