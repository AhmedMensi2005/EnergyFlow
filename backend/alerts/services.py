from .models import Alert, AlertRule


def rule_applies_to_device(rule, device):
    """
    Determines whether an alert rule applies to a specific device.

    Priority:
    1. Specific device
    2. Room
    3. Global rule
    """

    if rule.device_id is not None:
        return rule.device_id == device.id

    if rule.room_id is not None:
        return device.room_id == rule.room_id

    # Global rule
    return True


def get_measurement_value(measurement, metric):
    """
    Get the value of the selected metric from a measurement.
    """

    return getattr(measurement, metric, None)


def condition_is_met(value, condition, threshold):
    """
    Check whether a measurement value satisfies an alert condition.
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


def create_alert_from_measurement(measurement, rule):
    """
    Evaluate one rule against one measurement.
    Creates an alert if the rule is violated.
    """

    device = measurement.device

    # Check whether this rule applies to this device
    if not rule_applies_to_device(rule, device):
        return None

    # Get the measurement value
    value = get_measurement_value(
        measurement,
        rule.metric
    )

    # Ignore missing measurements
    if value is None:
        return None

    # Check condition
    if not condition_is_met(
        value,
        rule.condition,
        rule.threshold
    ):
        return None

    # Prevent duplicate active alerts
    existing_alert = Alert.objects.filter(
        device=device,
        rule=rule,
        status__in=[
            Alert.Status.NEW,
            Alert.Status.ACKNOWLEDGED,
        ],
    ).first()

    if existing_alert:
        return existing_alert

    # Create alert
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
        threshold_value=rule.threshold,
    )

    return alert


def process_measurement_alerts(measurement):
    """
    Evaluate one measurement against every enabled alert rule.

    This is the main function that should be called whenever
    a new measurement is received.
    """

    rules = AlertRule.objects.filter(
        enabled=True
    ).select_related(
        "device",
        "room",
    )

    alerts = []

    for rule in rules:
        alert = create_alert_from_measurement(
            measurement,
            rule
        )

        if alert is not None:
            alerts.append(alert)

    return alerts