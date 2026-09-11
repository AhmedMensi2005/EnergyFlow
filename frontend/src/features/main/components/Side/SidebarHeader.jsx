export default function SidebarHeader({title = "EnergyFlow",subTitle ,logo}) {
  return (
    <div className="sidebar-header">
      <div className="logo-icon">
                {logo ? (
                    <img src={logo} alt="EnergyFlow logo" />
                ) : ("⚡︎")}
            </div>

      <div className="sidebar-header-text">
        <h2>{title}</h2>
        <span>{subTitle}</span>
      </div>
    </div>
  );
}