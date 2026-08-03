import { useState, useEffect } from "react";

import "./style.css"

import { updateDevice } from "../../../services/devices";

function DeviceFormModal({ device, onClose, onSaved }) {

    const [name, setName] = useState("");
    const [label, setLabel] = useState("");


    useEffect(() => {

        if (device) {
            setName(device.name);
            setLabel(device.label);
        }

    }, [device]);

    async function handleSubmit(e){
        e.preventDefault();
        try {
            await updateDevice(device.id, {
                room: device.room?.id,
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

    };

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>Edit Device</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        placeholder="Room name"
                    />

                    <input
                        value={label}
                        onChange={(e)=>setLabel(e.target.value)}
                        placeholder="Label"
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

export default DeviceFormModal;