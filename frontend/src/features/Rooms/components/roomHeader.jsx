import "./styleRoom.css";
import { FiSearch, FiPlus } from "react-icons/fi";

function RoomsHeader({ search, setSearch, onCreate }) {
    return (
        <div className="rooms-header">

            <div className="search-container">

                <FiSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search room..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <button
                className="create-room-btn"
                onClick={onCreate}
            >
                <FiPlus />
                Create Room
            </button>

        </div>
    );
}

export default RoomsHeader;