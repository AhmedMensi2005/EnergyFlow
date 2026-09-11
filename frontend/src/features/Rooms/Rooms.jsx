import { useState, useEffect } from "react";

// components
import RoomsHeader from "./components/roomHeader";
import RoomItem from "./components/roomItem";
import RoomFormModal from "./components/roomForm";
import RoomDelConfirm from "./components/roomDelConfirm.jsx";
import RoomCreateModal from "./components/roomCreateModal.jsx";
import RoomAddDeviceModal from "./components/roomAddDeviceModal.jsx";
import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";

// style
import "./styleRooms.css";

// api
import api from "../../services/api.js";


function Rooms() {

    // popUps
    const [showConfirm, setShowConfirm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showAddDevice, setShowAddDevice] = useState(false);

    // selection in edit and delete
    const [selectedRoom, setSelectedRoom] = useState(null);

    // search
    const [search, setSearch] = useState("");

    // sort
    const [sort, setSort] = useState("name");
    const [sortSens, setSortSens] = useState("Ascendent");

    // main data
    const [rooms, setRooms] = useState([]);

    // loading
    const [loading, setLoading] = useState(true);


    async function fetchRooms() {
        setLoading(true);

        try {
            const response = await api.get("rooms/", {
                params: {
                    search,
                    ordering:
                        sortSens === "Ascendent"
                            ? sort
                            : `-${sort}`,
                },
            });

            setRooms(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchRooms();
    }, [search, sort, sortSens]);


    return (
        <div className="rooms-page">

            <RoomsHeader
                search={search}
                setSearch={setSearch}
                sort={sort}
                setSort={setSort}
                sortSens={sortSens}
                setSortSens={setSortSens}
                onCreate={() => {
                    setShowCreate(true);
                }}
            />

            {/* Loading only below the header */}
            {loading ? (
                <div className="rooms-loading">
                    <LoadingSpinner text="Loading rooms..." />
                </div>
            ) : (
                <div className="rooms-list-container">
                    <div className="rooms-list">
                        {rooms.map((room) => (
                            <RoomItem
                                key={room.id}
                                room={room}

                                onEdit={(room) => {
                                    setSelectedRoom(room);
                                    setShowModal(true);
                                }}

                                onDelete={(room) => {
                                    setSelectedRoom(room);
                                    setShowConfirm(true);
                                }}

                                onAddDevice={(room) => {
                                    setSelectedRoom(room);
                                    setShowAddDevice(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}


            {showCreate && (
                <RoomCreateModal
                    onClose={() => setShowCreate(false)}
                    onSaved={fetchRooms}
                />
            )}

            {showModal && (
                <RoomFormModal
                    room={selectedRoom}
                    onClose={() => setShowModal(false)}
                    onSaved={fetchRooms}
                />
            )}

            {showConfirm && (
                <RoomDelConfirm
                    room={selectedRoom}
                    onClose={() => setShowConfirm(false)}
                    onSaved={fetchRooms}
                />
            )}

            {showAddDevice && (
                <RoomAddDeviceModal
                    room={selectedRoom}
                    onClose={() => {
                        setShowAddDevice(false);
                        setSelectedRoom(null);
                    }}
                    onSaved={fetchRooms}
                />
            )}

        </div>
    );
}

export default Rooms;