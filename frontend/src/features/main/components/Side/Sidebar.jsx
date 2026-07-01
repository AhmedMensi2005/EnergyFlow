import "./styleSide.css";
function Sidebar({ header, nav, footer }) {
  return (
    <aside className="sidebar">
      {header}
      {nav}
      {footer}
    </aside>
  );
}
export default Sidebar;