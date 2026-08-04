def get_capability(device_json, capability_name):
    return (
        device_json
        .get("components", {})
        .get("main", {})
        .get(capability_name, {})
    )


def get_value(capability, attribute, default=None):
    if not capability:
        return default

    return capability.get(attribute, {}).get("value", default)


def get_unit(capability, attribute):
    if not capability:
        return None

    return capability.get(attribute, {}).get("unit")


def get_timestamp(capability, attribute):
    if not capability:
        return None

    return capability.get(attribute, {}).get("timestamp")

def to_bool(value):
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    return str(value).lower() in ("on", "true", "enabled", "yes", "1")