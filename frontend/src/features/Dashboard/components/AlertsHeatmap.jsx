import "./style.css";

const ALERT_COLORS = {
  0: "var(--border)",
  1: "var(--chart-cyan)",
  2: "#FACC15",
  3: "#FB923C",
  4: "var(--error)",
};

const ALERT_LABELS = {
  0: "No alerts",
  1: "Low",
  2: "Moderate",
  3: "High",
  4: "Critical",
};

function AlertsHeatmap({ data = [], selectedMonth }) {
  const [year, month] = selectedMonth
    .split("-")
    .map(Number);

  const daysInMonth = new Date(
    year,
    month,
    0
  ).getDate();

  const days = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    const alert = data.find(
      (item) => item.date === dateString
    );

    days.push({
      date: new Date(year, month - 1, day),
      dateString,
      level: alert?.level || 0,
    });
  }

  // Sunday = 0
  const firstDay = new Date(
    year,
    month - 1,
    1
  ).getDay();

  const weeks = [];
  let week = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    week.push(null);
  }

  days.forEach((day) => {
    week.push(day);

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });

  // Complete last week
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }

    weeks.push(week);
  }

  return (
    <div className="alerts-heatmap">

      <div className="heatmap-body">

        {/* Weekday labels */}
        <div className="heatmap-weekdays">
          <span>Sunday</span>
          <span>Monday</span>
          <span>Tuesday</span>
          <span>Wednesday</span>
          <span>Thursday</span>
          <span>Friday</span>
          <span>Saturday</span>
        </div>

        {/* Heatmap */}
        <div
          className="heatmap-grid"
          style={{
            gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
          }}
        >
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              if (!day) {
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="heatmap-cell empty"
                  />
                );
              }

              const cellIndex =
                weekIndex * 7 + dayIndex;

              const tooltipText = `${day.date.toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )} — ${ALERT_LABELS[day.level]}`;

              return (
                <div
                  key={day.dateString}
                  className="heatmap-cell"
                  data-level={day.level}
                  data-tooltip={tooltipText}
                  style={{
                    backgroundColor:
                      ALERT_COLORS[day.level],
                    "--i": cellIndex,
                  }}
                />
              );
            })
          )}
        </div>
      </div>


    </div>
  );
}

export default AlertsHeatmap;