import ACCard from "./components/ACCard";

const data = [
  { time: "10:00", value: 2.1 },
  { time: "10:05", value: 2.3 },
  { time: "10:10", value: 2.2 },
  { time: "10:15", value: 2.6 },
  { time: "10:20", value: 2.4 },
  { time: "10:25", value: 2.7 },
  { time: "10:30", value: 2.5 },
];

export default function Monitoring() {
  return (
    <div style={{ padding: 40 }}>
      <ACCard
        name="AC-101"
        room="Server Room"
        status="Online"
        temperature={18}
        power={2.4}
        mode="Cooling"
        updated="4s ago"
        consumptionData={data}
      />
    </div>
  );
}