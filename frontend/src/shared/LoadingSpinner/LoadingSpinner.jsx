import "./style.css";

function LoadingSpinner({ text = "Loading..." }) {
    return (
        <div className="loading-spinner-container">

            <div className="loading-spinner">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {text && (
                <div className="loading-spinner-text">
                    {text}
                </div>
            )}

        </div>
    );
}

export default LoadingSpinner;