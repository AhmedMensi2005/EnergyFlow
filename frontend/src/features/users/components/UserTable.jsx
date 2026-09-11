import {
    FiSearch,
    FiChevronDown,
    FiArrowUp,
    FiArrowDown,
    FiPlus,
} from "react-icons/fi";

import LoadingSpinner from "../../../shared/LoadingSpinner/LoadingSpinner";


export default function UserTable({

    users,
    currentUser,

    loading,

    search,
    setSearch,

    sort,
    setSort,

    sortSens,
    setSortSens,

    sortOptions,

    current,

    open,
    setOpen,

    onDelete,
    onAdd,
    onEdit,

}) {

    return (

        <div className="users-page">

            {/* ================= HEADER ================= */}

            <div className="users-header">

                <div className="search-container">

                    <FiSearch className="search-icon" />

                    <input
                        type="text"
                        placeholder="Search user..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <div className="sort-container">

                    <span className="sort-label">
                        Sort
                    </span>


                    <button
                        className="sort-select"
                        onClick={() =>
                            setOpen(!open)
                        }
                    >

                        {current}

                        <FiChevronDown
                            className={
                                `chevron ${
                                    open
                                        ? "open"
                                        : ""
                                }`
                            }
                        />

                    </button>


                    {open && (

                        <div className="sort-menu">

                            {sortOptions.map(
                                (option) => (

                                    <button
                                        key={option.value}
                                        className={
                                            `sort-option ${
                                                sort ===
                                                option.value
                                                    ? "active"
                                                    : ""
                                            }`
                                        }
                                        onClick={() => {

                                            setSort(
                                                option.value
                                            );

                                            setOpen(false);

                                        }}
                                    >

                                        {option.label}

                                    </button>

                                )
                            )}

                        </div>

                    )}


                    <button
                        className="sort-direction"
                        onClick={() => {

                            setSortSens(
                                sortSens ===
                                "Ascendent"
                                    ? "Descendant"
                                    : "Ascendent"
                            );

                        }}
                    >

                        {sortSens ===
                        "Ascendent"
                            ? <FiArrowUp />
                            : <FiArrowDown />
                        }

                    </button>

                </div>


                <button
                    className="create-room-btn"
                    onClick={onAdd}
                >

                    <FiPlus />

                    Add User

                </button>

            </div>


            {/* ================= BODY ================= */}

            <div className="users-body">

                {loading ? (

                    <div className="users-loading">

                        <LoadingSpinner
                            text="Loading users..."
                        />

                    </div>

                ) : (

                    <div className="users-grid">

                        {users.map((item) => (

                            <div
                                className="user-card"
                                key={item.id}
                            >

                                {/* ================= AVATAR ================= */}

                                <div className="user-avatar">

                                    {item.status ===
                                    "PENDING"

                                        ? item.email
                                            ?.substring(
                                                0,
                                                2
                                            )
                                            .toUpperCase()

                                        : item.username
                                            ?.substring(
                                                0,
                                                2
                                            )
                                            .toUpperCase()

                                    }

                                </div>


                                {/* ================= NAME ================= */}

                                <h2>

                                    {item.status ===
                                    "PENDING"

                                        ? "Pending invitation"

                                        : item.username

                                    }

                                </h2>


                                {/* ================= EMAIL ================= */}

                                <p className="user-email">

                                    {item.email}

                                </p>


                                {/* ================= ROLE ================= */}

                                <div className="user-role">

                                    <span className="role-title">
                                        Access level
                                    </span>


                                    <span
                                        className={
                                            item.status ===
                                            "PENDING"

                                                ? "pending-badge"

                                                : `role-badge ${
                                                    item.role.toLowerCase()
                                                }`
                                        }
                                    >

                                        {item.status ===
                                        "PENDING"

                                            ? "Invitation Pending"

                                            : item.role

                                        }

                                    </span>

                                </div>


                                {/* ================= INFO ================= */}

                                <div className="user-info">

                                    <p>

                                        Added:{" "}

                                        {new Date(
                                            item.date_ajout ||
                                            item.created_at
                                        ).toLocaleDateString()}

                                    </p>


                                    <p>

                                        {item.status ===
                                        "PENDING"

                                            ? "Waiting for account creation"

                                            : (
                                                item.derniere_connexion ||
                                                item.last_login
                                            )

                                                ? "Last login: " +
                                                  new Date(
                                                      item.derniere_connexion ||
                                                      item.last_login
                                                  ).toLocaleDateString()

                                                : "Last login: Never"

                                        }

                                    </p>

                                </div>


                                {/* ================= ACTIONS ================= */}

                                <div className="user-actions">

                                    {item.status !==
                                    "PENDING" && (

                                        <>

                                            {/* EDIT */}

                                            {(
                                                item.role ===
                                                "OPERATEUR"

                                                ||

                                                currentUser.role ===
                                                "SUPER_ADMIN"
                                            ) && (

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        onEdit(item)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                            )}


                                            {/* DELETE */}

                                            {(
                                                currentUser.role ===
                                                "SUPER_ADMIN"

                                                ||

                                                (
                                                    currentUser.role ===
                                                    "ADMIN"

                                                    &&

                                                    item.role ===
                                                    "OPERATEUR"
                                                )
                                            ) && (

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        onDelete(item)
                                                    }
                                                >
                                                    Remove access
                                                </button>

                                            )}

                                        </>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );
}