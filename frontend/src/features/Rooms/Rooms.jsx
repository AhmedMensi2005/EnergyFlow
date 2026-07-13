import { useMemo, useState, useEffect } from "react";

// components
import RoomsHeader from "./components/roomHeader";
import RoomItem from "./components/roomItem";
import RoomFormModal from "./components/roomForm";
import RoomDelConfirm from "./components/roomDelConfirm.jsx"
import RoomCreateModal from "./components/roomCreateModal.jsx";

//style
import "./styleRooms.css"

//api
import api from "../../services/api.js"


function Rooms() {

    //popUps
    const [showConfirm, setShowConfirm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    //selection in edit and delete
    const [selectedRoom, setSelectedRoom] = useState(null);

    //search
    const [search, setSearch] = useState("");

    //sort
    const [sort,setSort] = useState("name")
    const [sortSens,setSortSens] = useState("Ascendent")

    //main data
    const [rooms, setRooms] = useState([])



    async function fetchRooms() {
        try {
            const response = await api.get(`rooms/?search=${search}`);

            const roomsData = response.data.map(room => ({
                ...room,
                consumption: 0,
                airConditioners: 0,
            }));

            setRooms(roomsData);

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(()=>{
        fetchRooms();
    },[search])

    const sortedRooms = useMemo(() => {
        const sorted = [...rooms];
        sorted.sort((a, b) => {
            let comparison = 0;
            switch (sort) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "area":
                    comparison = a.area - b.area;
                    break;
                case "floor":
                    comparison = a.floor.localeCompare(b.floor);
                    break;
                case "airConditioners":
                    comparison = a.airConditioners - b.airConditioners;
                    break;
                case "consumption":
                    comparison = a.consumption - b.consumption;
                    break;
                default:
                    comparison = 0;
            }
            return sortSens === "Ascendent"
                ? comparison
                : -comparison;
        });
        return sorted;
    }, [rooms, sort, sortSens]);

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
            <div className="rooms-list-container">
                <div className="rooms-list">
                    {sortedRooms.map((room) => (
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
                        />
                    ))}
                </div>
            </div>
            
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
        </div>

    );

}

export default Rooms;