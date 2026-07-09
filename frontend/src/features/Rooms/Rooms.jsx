import { useState } from "react";
import RoomsHeader from "./components/roomHeader";
import RoomItem from "./components/roomItem";
import "./styleRooms.css"




function Rooms() {
    const rooms = [
    {
        id: 1,
        name: "Server Room",
        floor: "B1",
        airConditioners: 2,
        area: 18,
        consumption: 4.6,
    },
    {
        id: 2,
        name: "Meeting Room A",
        floor: "1",
        airConditioners: 1,
        area: 32,
        consumption: 2.1,
    },
    {
        id: 3,
        name: "Open Space",
        floor: "2",
        airConditioners: 6,
        area: 120,
        consumption: 15.8,
    },
    {
        id: 4,
        name: "CEO Office",
        floor: "2",
        airConditioners: 1,
        area: 28,
        consumption: 1.7,
    },
    {
        id: 5,
        name: "Reception",
        floor: "Ground",
        airConditioners: 2,
        area: 45,
        consumption: 3.9,
    },
    {
        id: 6,
        name: "Training Room",
        floor: "1",
        airConditioners: 3,
        area: 70,
        consumption: 7.4,
    },
    ];

    const [search, setSearch] = useState("");

    const handleCreate = () => {

        console.log("Open Create Room Modal");

    };

    return (

        <div className="rooms-page">
            <RoomsHeader
                search={search}
                setSearch={setSearch}
                onCreate={handleCreate}
            />
            <div className="rooms-list-container">
                <div className="rooms-list">
                    {rooms.map((room) => (
                        <RoomItem
                        key={room.id}
                        room={room}
                        onEdit={(room) => console.log("Edit:", room)}
                        onDelete={(id) => console.log("Delete:", id)}
                        />
                    ))}
                </div>
            </div>
        </div>

    );

}

export default Rooms;