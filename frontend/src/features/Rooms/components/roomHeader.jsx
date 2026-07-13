import { useState } from "react";
import { FiSearch, FiPlus, FiChevronDown, FiArrowUp, FiArrowDown } from "react-icons/fi";
import "./styleRoom.css";

const sortOptions = [
    { value: "name", label: "Name" },
    { value: "area", label: "Area" },
    { value: "floor", label: "Floor" },
    { value: "airConditioners", label: "Air Conditioners" },
    { value: "consumption", label: "Consumption" },
];

function RoomsHeader({
    search,
    setSearch,
    sort,
    setSort,
    sortSens,
    setSortSens,
    onCreate,
}) {

    const [open, setOpen] = useState(false);

    const current =
        sortOptions.find(option => option.value === sort)?.label || "Name";

    return (
        <div className="rooms-header">

            <div className="search-container">
                <FiSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search room..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="sort-container">

                <span className="sort-label">Sort</span>

                <button
                    className="sort-select"
                    onClick={() => setOpen(!open)}
                >
                    {current}
                    <FiChevronDown
                        className={`chevron ${open ? "open" : ""}`}
                    />
                </button>

                {open && (

                    <div className="sort-menu">

                        {sortOptions.map(option => (

                            <button
                                key={option.value}
                                className={`sort-option ${
                                    sort === option.value ? "active" : ""
                                }`}
                                onClick={() => {
                                    setSort(option.value);
                                    setOpen(false);
                                }}
                            >
                                {option.label}
                            </button>

                        ))}

                    </div>

                )}

                <button
                    className="sort-direction"
                    onClick={() =>
                        setSortSens(
                            sortSens === "Ascendent"
                                ? "Descendant"
                                : "Ascendent"
                        )
                    }
                >
                    {sortSens === "Ascendent"
                        ? <FiArrowUp />
                        : <FiArrowDown />}
                </button>

            </div>

            <button
                className="create-room-btn"
                onClick={onCreate}
            >
                <FiPlus />
                Create Room
            </button>

        </div>
    );
}

export default RoomsHeader;