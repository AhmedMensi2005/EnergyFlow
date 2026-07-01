export default function SidebarItem({ label, icon, active = false }) {
  return (
    <button className={`sidebar-item ${active ? "active" : ""}`}>
      <span className="sidebar-icon">
        {icon || "▣"}
      </span>
      <span className="sidebar-label">{label}</span>
    </button>
  );
}