def get_capability(device_json, capability_name):
    components = device_json.get("components", [])

    if not components:
        return None

    capabilities = components[0].get("capabilities", [])

    for capability in capabilities:
        if capability["id"] == capability_name:
            return capability.get("status", {})

    return None

def get_value(status, key, default=None):
    item = status.get(key)

    if item is None:
        return default

    return item.get("value", default)