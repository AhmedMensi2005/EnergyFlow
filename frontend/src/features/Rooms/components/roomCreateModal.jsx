import { useState, useEffect } from "react";

import "./roomPopUp.css";

import {createRoom} from "../../../services/rooms";

function RoomCreateModal({onClose, onSaved }) {
    const [name, setName] = useState("");
    const [area, setArea] = useState("");
    const [floor, setFloor] = useState("");
    const [description, setDescription] = useState("");
    async function handleSubmit(e){
        e.preventDefault();
        try {
            await createRoom(
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

                <h2>Create Room</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        onChange={(e)=>setName(e.target.value)}
                        placeholder="Room name"
                        required
                    />

                    <input
                        type="number"
                        onChange={(e)=>setArea(Number(e.target.value))}
                        placeholder="Area"
                        required
                    />

                    <input
                        onChange={(e)=>setFloor(e.target.value)}
                        placeholder="Floor"
                        required
                    />

                    <textarea
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

                            Add

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default RoomCreateModal;