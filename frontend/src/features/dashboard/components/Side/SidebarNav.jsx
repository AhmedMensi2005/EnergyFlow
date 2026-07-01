import SidebarItem from "./navItem";

export default function SidebarNav() {
  return (
    <div className="sidebar-nav">
      <SidebarItem label="Dashboard" active />
      <SidebarItem label="Monitoring" />
      <SidebarItem label="Rooms" />
      <SidebarItem label="Air Conditioners" />
      <SidebarItem label="Operators" />
      <SidebarItem label="Analytics" />
      <SidebarItem label="Alerts" />
    </div>
  );
}