import "./styleRoom.css";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function RoomItem({
    room,
    onEdit,
    onDelete,
}) {
    return (
        <div className="room-item">

            <div className="room-cell room-name">
                <span>{room.name}</span>
            </div>

            <div className="room-cell">
                {room.floor}
            </div>

            <div className="room-cell">
                {room.airConditioners} AC
            </div>

            <div className="room-cell">
                {room.area} m²
            </div>

            <div className="room-cell">
                {room.consumption} kWh
            </div>

            <div className="room-actions">

                <button
                    className="action-btn"
                    onClick={() => onEdit(room)}
                >
                    <FiEdit2 />
                </button>

                <button
                    className="action-btn delete"
                    onClick={() => onDelete(room.id)}
                >
                    <FiTrash2 />
                </button>

            </div>

        </div>
    );
}

export default RoomItem;