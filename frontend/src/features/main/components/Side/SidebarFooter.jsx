import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function SidebarFooter({
    username,
    role,
    avatar
}) {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <div className="sidebar-footer">

            <div className="user-section">

                <div className="sidebar-avatar">
                    {avatar}
                </div>

                <div className="sidebar-user-info">

                    <span className="sidebar-user-name">
                        {username}
                    </span>

                    <span className="sidebar-user-role">
                        {role.replace("_", " ")}
                    </span>

                </div>

            </div>

            <button
                className="logout-btn"
                onClick={handleLogout}
                title="Logout"
            >
                <FiLogOut />
            </button>

        </div>

    );

}