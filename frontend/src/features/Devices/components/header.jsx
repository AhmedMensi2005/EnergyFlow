import { useState } from "react";
import { FiSearch, FiPlus, FiChevronDown, FiArrowUp, FiArrowDown } from "react-icons/fi";
import "./style.css";

const sortOptions = [
    { value: "name", label: "Name" },
    { value: "status", label: "Status" },
    { value: "power", label: "Power" },
    { value: "temperature", label: "Temperature" },
    {value: "operating_state",label: "Operating State"},
    { value: "created_at", label: "Created" },
];
function DevicesHeader({
    search,
    setSearch,
    sort,
    setSort,
    sortSens,
    setSortSens,
}) {

    const [open, setOpen] = useState(false);

    const current = sortOptions.find(option => option.value === sort)?.label || "Name";

    return (
        <div className="header">

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
        </div>
    );
}

export default DevicesHeader;