import Side from "./components/Side/Side";
import Header from "./components/header/header";
import "./styleMain.css"

export default function Dashboard() {
  return (
    <div className="main">
      <div className="nav">
        <Side />
      </div>
      <div className="header-area">
        <Header/>
      </div>
      <div className="content">
        <div className="content-wrapper">
          <h2>Welcome to Dashboard</h2>
          <p>Your main content goes here...</p>
        </div>
      </div>
    </div>
  );
}