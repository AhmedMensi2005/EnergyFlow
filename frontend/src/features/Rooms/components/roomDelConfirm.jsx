
import "./roomPopUp.css";

import {deleteRoom} from "../../../services/rooms";

function RoomDelConfirm({ room, onClose, onSaved }) {

    if (!room) return null;
    async function handleConfirm(){
        try {
            await deleteRoom(room.id)
            onSaved();
            onClose();
        } catch (error) {
            console.error(error);
        }

    };

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>Confirm Delete {room.name}</h2>

                    <div className="modal-actions">

                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button 
                            type="button"
                            onClick={handleConfirm}
                        >

                            confirm

                        </button>

                    </div>


            </div>

        </div>

    );

}

export default RoomDelConfirm;