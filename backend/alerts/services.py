from .models import Alert, AlertRule


def rule_applies_to_device(rule, device):
    """
    Determine whether an alert rule applies to a specific device.

    A rule can target:
    - one specific device
    - one room
    - all devices
    """

    # Rule targets one specific device
    if rule.device_id is not None:
        return rule.device_id == device.id

    # Rule targets a room
    if rule.room_id is not None:
        return device.room_id == rule.room_id

    # No device and no room = global rule
    return True


def get_measurement_value(measurement, metric):
    """
    Get the value from a Measurement according to the rule metric.
    """

    return getattr(
        measurement,
        metric,
        None
    )


def condition_is_met(value, condition, threshold):
    """
    Check whether a measurement satisfies the rule condition.
    """

    if value is None:
        return False

    if condition == AlertRule.Condition.GREATER_THAN:
        return value > threshold

    if condition == AlertRule.Condition.LESS_THAN:
        return value < threshold

    if condition == AlertRule.Condition.GREATER_OR_EQUAL:
        return value >= threshold

    if condition == AlertRule.Condition.LESS_OR_EQUAL:
        return value <= threshold

    return False


def create_alert_from_measurement(
    measurement,
    rule
):
    """
    Create an Alert when a measurement satisfies an AlertRule.

    Returns:
        Alert object if an alert was created or already exists.
        None if no alert should be created.
    """

    device = measurement.device

    # ---------------------------------------------------------
    # 1. Check whether the rule applies to this device
    # ---------------------------------------------------------

    if not rule_applies_to_device(
        rule,
        device
    ):
        return None

    # ---------------------------------------------------------
    # 2. Get the measurement value
    # ---------------------------------------------------------

    value = get_measurement_value(
        measurement,
        rule.metric
    )

    # Metric is not available in this measurement
    if value is None:
        return None

    # ---------------------------------------------------------
    # 3. Check whether the condition is satisfied
    # ---------------------------------------------------------

    if not condition_is_met(
        value,
        rule.condition,
        rule.threshold
    ):
        return None

    # ---------------------------------------------------------
    # 4. Prevent duplicate active alerts
    # ---------------------------------------------------------

    existing_alert = Alert.objects.filter(
        device=device,
        rule=rule,
        status__in=[
            Alert.Status.NEW,
            Alert.Status.ACKNOWLEDGED
        ]
    ).first()

    if existing_alert:

        return existing_alert

    # ---------------------------------------------------------
    # 5. Create the alert
    # ---------------------------------------------------------

    alert = Alert.objects.create(

        device=device,

        rule=rule,

        severity=rule.severity,

        status=Alert.Status.NEW,

        title=rule.name,

        message=(
            f"{device.name} has a {rule.metric} value of "
            f"{value}, which is {rule.condition} "
            f"{rule.threshold}."
        ),

        current_value=value,

        threshold_value=rule.threshold

    )

    return alert