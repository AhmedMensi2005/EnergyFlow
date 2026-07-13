import { useState, useEffect } from "react";

import "./roomPopUp.css";

import {updateRoom} from "../../../services/rooms";

function RoomFormModal({ room, onClose, onSaved }) {

    const [name, setName] = useState("");
    const [area, setArea] = useState("");
    const [floor, setFloor] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {

        if (room) {
            setName(room.name);
            setArea(room.area);
            setFloor(room.floor);
            setDescription(room.description);
        }

    }, [room]);

    async function handleSubmit(e){
        e.preventDefault();
        try {
            await updateRoom(room.id,
                {
                    name,
                    area,
                    floor,
                    description,
                }
            )
            onSaved();
            onClose();
        } catch (error) {
            console.error(error);
        }

    };

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>Edit Room</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        placeholder="Room name"
                    />

                    <input
                        type="number"
                        value={area}
                        onChange={(e)=>setArea(e.target.value)}
                        placeholder="Area"
                    />

                    <input
                        value={floor}
                        onChange={(e)=>setFloor(e.target.value)}
                        placeholder="Floor"
                    />

                    <textarea
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                        placeholder="Description"
                    />

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

export default RoomFormModal;