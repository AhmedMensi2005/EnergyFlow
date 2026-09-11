import { useEffect, useMemo, useState } from "react";

import AccessDenied from "../components/AccessDenied";
import UserTable from "../components/UserTable";
import AddUser from "../components/AddUser";
import EditUser from "../components/EditUser";
import LoadingSpinner from "../../../shared/LoadingSpinner/LoadingSpinner";

import {
    getUsers,
    deleteOperator,
    deleteAdmin,
    inviteUser,
    updateUser,
    getInvitations
} from "../../../services/userService";

import "../styles/users.css";

export default function Users() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("username");
    const [sortSens, setSortSens] = useState("Ascendent");

    const [open, setOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);

    const [userType, setUserType] = useState(
        user?.role === "ADMIN"
            ? "OPERATEUR"
            : "ADMIN"
    );

    const [form, setForm] = useState({
        email: ""
    });


    if (
        !user ||
        (
            user.role !== "ADMIN" &&
            user.role !== "SUPER_ADMIN"
        )
    ) {
        return <AccessDenied />;
    }


    const loadUsers = async () => {

        setLoading(true);

        try {

            const usersData = await getUsers();
            const invitationData = await getInvitations();

            const normalUsers = usersData.filter(
                item => item.role !== "SUPER_ADMIN"
            );

            const pendingUsers = invitationData.map(
                item => ({
                    id: item.id,
                    email: item.email,
                    username: "-",
                    role: item.role,
                    status: "PENDING",
                    created_at: item.created_at
                })
            );

            setUsers([
                ...normalUsers,
                ...pendingUsers
            ]);

        } catch (error) {

            console.log(error);
            setUsers([]);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadUsers();
    }, []);


    const handleDelete = async (item) => {

        try {

            if (item.role === "OPERATEUR") {
                await deleteOperator(item.id);
            }

            if (
                item.role === "ADMIN" &&
                user.role === "SUPER_ADMIN"
            ) {
                await deleteAdmin(item.id);
            }

            await loadUsers();

        } catch (error) {
            console.log(error);
        }
    };


    const handleEdit = (item) => {
        setSelectedUser(item);
        setShowEdit(true);
    };


    const handleUpdate = async (data) => {

        try {

            await updateUser(
                selectedUser.id,
                data
            );

            await loadUsers();

            setShowEdit(false);
            setSelectedUser(null);

        } catch (error) {
            console.log(error);
        }
    };


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    const handleCreate = async () => {

        try {

            await inviteUser({
                email: form.email,
                role: userType
            });

            await loadUsers();

            setShowModal(false);

            setForm({
                email: ""
            });

        } catch (error) {
            console.log(error);
        }
    };


    const sortOptions = [
        {
            value: "username",
            label: "Name"
        },
        {
            value: "role",
            label: "Role"
        },
        {
            value: "date_ajout",
            label: "Date Added"
        },
        {
            value: "last_login",
            label: "Last Login"
        }
    ];


    const current = sortOptions.find(
        item => item.value === sort
    )?.label;


    const filteredUsers = useMemo(() => {

        return users

            .filter(item => {

                const value =
                    (item.username || "") +
                    (item.email || "") +
                    (item.role || "");

                return value
                    .toLowerCase()
                    .includes(search.toLowerCase());

            })

            .sort((a, b) => {

                let first;
                let second;

                if (sort === "last_login") {

                    first =
                        a.last_login ||
                        a.derniere_connexion ||
                        "";

                    second =
                        b.last_login ||
                        b.derniere_connexion ||
                        "";

                } else {

                    first = a[sort] || "";
                    second = b[sort] || "";

                }

                if (
                    sort.includes("date") ||
                    sort.includes("connexion") ||
                    sort.includes("login")
                ) {

                    first = new Date(first || 0);
                    second = new Date(second || 0);

                }

                if (first < second) {
                    return sortSens === "Ascendent"
                        ? -1
                        : 1;
                }

                if (first > second) {
                    return sortSens === "Ascendent"
                        ? 1
                        : -1;
                }

                return 0;
            });

    }, [users, search, sort, sortSens]);


    return (
        <>

            <UserTable
                users={filteredUsers}
                currentUser={user}

                loading={loading}

                onEdit={handleEdit}

                search={search}
                setSearch={setSearch}

                sort={sort}
                setSort={setSort}

                sortSens={sortSens}
                setSortSens={setSortSens}

                sortOptions={sortOptions}
                current={current}

                open={open}
                setOpen={setOpen}

                onDelete={(item) => setDeleteUser(item)}
                onAdd={() => setShowModal(true)}
            />


            {showModal && (
                <AddUser
                    form={form}
                    userType={userType}
                    setUserType={setUserType}
                    handleChange={handleChange}
                    handleCreate={handleCreate}
                    close={() => setShowModal(false)}
                    currentUser={user}
                />
            )}


            {showEdit && (
                <EditUser
                    user={selectedUser}
                    currentUser={user}
                    close={() => {
                        setShowEdit(false);
                    }}
                    save={handleUpdate}
                />
            )}


            {deleteUser && (
                <div className="modal-overlay">

                    <div className="confirm-modal">

                        <h2>Remove Access</h2>

                        <p>
                            Are you sure you want to remove access for
                            <strong> {deleteUser.username}</strong>?
                        </p>

                        <p className="confirm-warning">
                            This action cannot be undone.
                        </p>

                        <div className="modal-actions">

                            <button
                                className="cancel-btn"
                                onClick={() => setDeleteUser(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="delete-btn"
                                onClick={async () => {
                                    await handleDelete(deleteUser);
                                    setDeleteUser(null);
                                }}
                            >
                                Remove Access
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </>
    );
}