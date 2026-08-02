import "../styles/accessDenied.css";

export default function AccessDenied() {
    return (
        <div className="access-denied">

            <div className="access-card">

                <div className="access-icon">
                    🔒
                </div>

                <h1>
                    Access Restricted
                </h1>

                <p>
                    You don't have permission to access this section.
                </p>

                <div className="access-divider"></div>

                <span className="access-role">
                    Contact your administrator if you believe this is a mistake.
                </span>

            </div>

        </div>
    );
}