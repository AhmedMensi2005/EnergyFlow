import { useEffect, useState } from "react";
import { FiChevronDown, FiX, FiPlus } from "react-icons/fi";

import api from "../../../services/api";
import "./roomPopUp.css";
import { getDevices, updateDevice } from "../../../services/devices";

function RoomAddDevicesModal({ room, onClose, onSaved }) {

    const [devices, setDevices] = useState([]);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDevices();
    }, []);

    async function fetchDevices() {
        try {
            setLoading(true);
            const response = await getDevices()   
            setDevices(response);

        } catch (error) {
            console.error("Error loading devices:", error);
        } finally {
            setLoading(false);
        }
    }

    // Devices currently assigned to this room
    const roomDevices = devices.filter(device => device.room === room.id);
    // Devices that belong to another room OR no room
    const availableDevices = devices.filter(device => device.room !== room.id);

    async function addDevice(device) {
        try {
            await updateDevice(device.id,{
                room : room.id,
            });
            await fetchDevices();
            onSaved();

        } catch (error) {
            console.error("Error adding device:", error);
        }
    }

    async function removeDevice(device) {
        try {
            await updateDevice(device.id,{
                room : null,
            });
            await fetchDevices();

            onSaved();

        } catch (error) {

            console.error("Error removing device:", error);

        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal room-devices-modal">
                <h2>
                    Manage devices
                </h2>

                <p className="room-devices-subtitle">
                    Devices in <strong>{room.name}</strong>
                </p>

                {/* CURRENT DEVICES */}
                <div className="current-devices-section">
                    <label>
                        Devices in this room
                    </label>

                    <div className="devices-container">

                        {loading ? (
                            <p className="devices-empty">
                                Loading devices...
                            </p>
                        ) : roomDevices.length === 0 ? (
                            <p className="devices-empty">
                                No devices in this room.
                            </p>
                        ) : (
                            roomDevices.map(device => (
                                <div className="device-chip" key={device.id}>
                                    <span>
                                        {device.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeDevice(device)
                                        }
                                        title="Remove device"
                                    >
                                        <FiX />
                                    </button>

                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ADD DEVICE */}
                <div className="add-device-section">
                    <label>
                        Add a device
                    </label>

                    <div className="device-select-wrapper">
                        <button
                            type="button"
                            className="device-select"
                            onClick={() => setOpen(!open)}
                        >

                            <span>
                                Select a device
                            </span>

                            <FiChevronDown
                                className={
                                    open
                                        ? "device-chevron open"
                                        : "device-chevron"
                                }
                            />
                        </button>


                        {open && (

                            <div className="device-menu">
                                {availableDevices.length === 0 ? (
                                    <div className="device-option-empty">
                                        No available devices
                                    </div>
                                ) : (
                                    availableDevices.map(device => (
                                        <button
                                            type="button"
                                            className="device-option"
                                            key={device.id}
                                            onClick={() => {
                                                addDevice(device);
                                                setOpen(false);
                                            }}
                                        >

                                            <div className="device-option-info">
                                                <span className="device-option-name">
                                                    {device.name}
                                                </span>
                                                <span className="device-option-id">
                                                    {device.external_id}
                                                </span>
                                            </div>
                                            <FiPlus />
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="modal-actions">

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoomAddDevicesModal;