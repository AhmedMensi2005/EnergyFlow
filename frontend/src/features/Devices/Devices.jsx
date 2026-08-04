import "./Devices.css";
import { useState, useEffect } from "react";

import { getDevices, updateDevice } from "../../services/devices";
import { getLatestMeasurements } from "../../services/measurements";

import DeviceFormModal from "./components/deviceModal"; 
import DevicesHeader from "./components/header";
import DeviceItem from "./components/listItem";

function Devices() {
    //loading
    const [loading, setLoading] = useState(true);
    
    //search
    const [search, setSearch] = useState("");

    //sort
    const [sort, setSort] = useState("name");
    const [sortSens, setSortSens] = useState("Ascendent");

    //status menue
    const [openedStatus, setOpenedStatus] = useState(null);
    //data
    const [devices, setDevices] = useState([]);
    //edit modal
    const [showModal, setShowModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState();

    const loadData = async () => {
        try {
            const ordering =
                sortSens === "Ascendent"
                    ? sort
                    : `-${sort}`;

            const devicesData = await getDevices({search, ordering,});
            const measurementsData = await getLatestMeasurements();
            const mergedDevices = devicesData.map(device => ({
                ...device,
                measurement:
                    measurementsData.find(
                        m => m.device === device.id
                    ) || {},
            }));
            setDevices(mergedDevices);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        loadData();
    }, [search, sort, sortSens]);

const updateStatus = async (device, status) => {
    try {
        
        await updateDevice(device.id, {
            room: device.room?.id,
            category: device.category,
            name: device.name,
            label: device.label,
            external_id: device.external_id,
            manufacturer: device.manufacturer,
            model_number: device.model_number,
            serial_number: device.serial_number,
            status: status,
            installed_at: device.installed_at,
            metadata: device.metadata,
            last_seen_at: device.last_seen_at,
            last_operating_state: device.last_operating_state,
        });
        setDevices((prev) =>
            prev.map((d) =>
                d.id === device.id
                    ? { ...d, status }
                    : d
            )
        )

        

    } catch (error) {
        console.error(error);
    }

    };

    if (loading) {
        return <div>Loading devices...</div>;
    }


    return (


        

        <div className="devices-page">

            <DevicesHeader

                search={search}
                setSearch={setSearch}

                sort={sort}
                setSort={setSort}

                sortSens={sortSens}
                setSortSens={setSortSens}

            />
            <div className="devices-list-container">
                <div className="devices-list">
                    {devices.map((device) => (

                        <DeviceItem
                            key={device.id}
                            device={device}
                            onEdit={(device) =>{
                                setSelectedDevice(device);
                                setShowModal(true);
                            }}
                            openedStatus={openedStatus}
                            setOpenedStatus={setOpenedStatus}
                            updateStatus={updateStatus}

                        />

                    ))}

                </div>
            </div>
            {showModal && (
                <DeviceFormModal
                    device={selectedDevice}
                    onClose={() => setShowModal(false)}
                    onSaved={loadData}
                />
            )}
        </div>

    );
}

export default Devices;