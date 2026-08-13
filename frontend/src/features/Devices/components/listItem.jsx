import { useEffect, useRef, useState } from "react";
import "./style.css";
import { FiEdit2, FiChevronDown } from "react-icons/fi";
import { getRoom } from "../../../services/rooms";

const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Under maintenance" },
];

function DeviceItem({
    device,
    onEdit,
    openedStatus,
    setOpenedStatus,
    updateStatus,
}) {


    const open = openedStatus === device.id;
    const current =statusOptions.find(option => option.value === device.status.toLowerCase())?.label || device.status;

    const [room,setRoom]=useState(device.room)

    if (device.room){
        async function loadRoom(id) {
            try{
                const response = await getRoom(id);
                setRoom(response);
            }
            catch(err){
                console.error(err)
            }
        }
        loadRoom(device.id);
    }


    return (

        <div className="device-item">
            <div className="device-top">
                <div className="device-left">
                    <button
                        className="action-btn"
                        onClick={() => onEdit(device)}
                    >
                        <FiEdit2 />
                    </button>
                    <div>
                        <div className="device-title">

                            <h2>{device.name}</h2>

                            <div
                                className={`device-operating-state ${
                                    device.last_operating_state?.toLowerCase() || "off"
                                }`}
                            >
                                {device.last_operating_state || "Off"}
                            </div>

                        </div>

                        <p className="device-label">
                            {device.label}
                        </p>

                    </div>

                </div>

                <div
                    className="status-dropdown"
    
                >

                    <button
                        className={`status-select ${device.status.toLowerCase()}`}
                        onClick={() =>
                            setOpenedStatus(
                                open ? null : device.id
                            )
                        }
                    >

                        {current}
                        <FiChevronDown
                            className={`chevron ${
                                open ? "open" : ""
                            }`}
                        />
                    </button>
                    {console.log(open)}
                    {open && (

                        <div className="status-menu">

                            {statusOptions.map(option => (

                                <button
                                    key={option.value}
                                    className={`status-option ${device.status.toLowerCase() === option.value? `selected ${option.value}`: ""}`}
                                    onClick={async () => {
                                        console.log(option.value)
                                        setOpenedStatus(null);
                                        await updateStatus(device, option.value);
                                        
                                    }}
                                >
                                    {option.label}
                                </button>

                            ))}

                        </div>

                    )}

                </div>

            </div>

            <div className="device-bottom">

                <div className="device-info-box">
                    <span>Power</span>
                    <strong>{device.measurement?.power ?? "--"} W</strong>
                </div>

                <div className="device-info-box">
                    <span>Temperature</span>
                    <strong>{device.measurement?.temperature ?? "--"} °C</strong>
                </div>

                <div className="device-info-box">
                    <span>Mode</span>
                    <strong>{device.measurement?.mode ?? "--"}</strong>
                </div>

                <div className="device-info-box">
                    <span>Room</span>
                    <strong>{room?.name ?? "No room"}</strong>
                </div>

            </div>

        </div>

    );
}

export default DeviceItem;