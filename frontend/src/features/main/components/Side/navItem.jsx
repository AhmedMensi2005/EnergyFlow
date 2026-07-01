export default function SidebarItem({ label, icon, active = false , onClick }) {
  return (
    <button className={`sidebar-item ${active ? "active" : ""}`} onClick={() => onClick(label)} >
      <span className="sidebar-icon">
        {icon || "▣"}
      </span>
      <span className="sidebar-label">{label}</span>
    </button>
  );
}