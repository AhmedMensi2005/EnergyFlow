export default function SidebarHeader({title = "EnergyFlow",subTitle ,logo}) {
  return (
    <div className="sidebar-header">
      <div className="logo-icon">
        ⚡︎
      </div>

      <div className="sidebar-header-text">
        <h2>{title}</h2>
        <span>{subTitle}</span>
      </div>
    </div>
  );
}