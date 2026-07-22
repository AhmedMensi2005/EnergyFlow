from devices.models import Device, Measurement
from devices.services.parser import get_capability,get_value

def device_importer(data):
    device, created = Device.objects.update_or_create(
        external_id=data["deviceId"],
        defaults={

            "name": data["name"],
            "label": data["label"],
            "manufacturer": data["manufacturerName"],
            "model_number": data["ocf"]["modelNumber"],

            "category": "air_conditioner",

            "metadata": {

                "owner": data["ownerId"],
                "location": data["locationId"],
                "presentation": data["presentationId"],

            }

        }

    )

    return device


def mesurments_importer(data, device):

    switch = get_capability(data, "switch")
    operating_state = get_value(switch, "switch")

    setpoint = get_capability(data, "thermostatCoolingSetpoint")
    target = get_value(setpoint, "coolingSetpoint")

    mode = get_capability(data, "airConditionerMode")
    mode_value = get_value(mode, "airConditionerMode")


    fan = get_capability(data, "airConditionerFanMode")
    fan_mode = get_value(fan, "fanMode")

    humidity = get_capability(data,"relativeHumidityMeasurement")
    humidity_value = get_value(humidity, "humidity")

    temperature = get_capability(data,"temperatureMeasurement")
    temp = get_value(temperature,"temperature")


    power=get_capability(data,"powerConsumptionReport")
    power_consumption=get_value(power,"powerConsumption")
   
    power_value=power_consumption.get("power")
    energy_total=power_consumption.get("energy")
    energy_delta=power_consumption.get("deltaEnergy")
    
    Measurement.objects.create(
        device=device,
        timestamp = power.get("powerConsumption", {}).get("timestamp"),
        power=power_value,
        energy_total=energy_total,
        energy_delta=energy_delta,
        temperature=temp,
        target_temperature=target,
        humidity=humidity_value,
        operating_state=operating_state,
        mode=mode_value,
        fan_mode=fan_mode,
        extra_data={
            "health": data["healthState"],
            "ocf": data["ocf"]

        }


    )
    
    device.last_seen_at = data["healthState"]["lastUpdatedDate"]
    device.last_operating_state = operating_state
    device.save()
    return 0
