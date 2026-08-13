import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

import "./style.css";

import { updateDevice } from "../../../services/devices";
import { getRooms } from "../../../services/rooms";

function DeviceFormModal({ device, onClose, onSaved }) {

    const [name, setName] = useState("");
    const [label, setLabel] = useState("");

    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [roomOpen, setRoomOpen] = useState(false);

    async function loadRooms() {
        try {
            const response = await getRooms();
            setRooms(response);
        } catch (error) {
            console.error("Error loading rooms:", error);
        }
    }

    useEffect(() => {
        if (device) {
            setName(device.name || "");
            setLabel(device.label || "");
            setSelectedRoom(device.room ? device.room : null);
        }
    }, [device]);


    useEffect(() => {
        loadRooms();
    }, []);

    let selectedRoomObject = null;
    if(selectedRoom){
        selectedRoomObject = rooms.find(room => room.id == selectedRoom);
    }
    
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await updateDevice(device.id, {
                room: selectedRoom ? selectedRoom : null,
                category: device.category,
                name,
                label,
                external_id: device.external_id,
                manufacturer: device.manufacturer,
                model_number: device.model_number,
                serial_number: device.serial_number,
                status: device.status,
                installed_at: device.installed_at,
                metadata: device.metadata,
                last_seen_at: device.last_seen_at,
                last_operating_state: device.last_operating_state,

            });
            
            onSaved();
            onClose();
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Device</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Device name"
                    />
                    <input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="Label"
                    />
                    {/* ROOM SELECTOR */}
                    <div className="room-select-container">
                        <button
                            type="button"
                            className="room-select"
                            onClick={() => setRoomOpen(!roomOpen)}
                        >
                            <span>
                                {selectedRoomObject ? selectedRoomObject.name : "Select a room"}
                            </span>
                            <FiChevronDown
                                className={`room-chevron ${
                                    roomOpen ? "open" : ""
                                }`}
                            />
                        </button>

                        {roomOpen && (
                            <div className="room-menu">
                                {rooms.map(room => (
                                    <button
                                        type="button"
                                        key={room.id}
                                        className={`room-option ${selectedRoom == room.id ? "active": ""}`}
                                        onClick={() => {
                                            setSelectedRoom(room.id);
                                            setRoomOpen(false);
                                        }}
                                    >
                                        {room.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Save
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default DeviceFormModal;