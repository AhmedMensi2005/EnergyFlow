import { useEffect, useState } from "react";

export default function EditUser({

    user,
    close,
    save,
    currentUser

}) {

    const [form, setForm] = useState({

        username: "",
        role: "OPERATEUR"

    });

    useEffect(() => {

        if (user) {

            setForm({

                username: user.username,
                role: user.role

            });

        }

    }, [user]);

    const handleChange = (e) => {

        setForm({

            ...form,
            [e.target.name]: e.target.value

        });

    };

    return (

        <div className="modal-overlay">

            <div className="user-modal">

                <h2>Edit User</h2>

                <input

                    name="username"

                    value={form.username}

                    onChange={handleChange}

                    placeholder="Username"

                />

                <div className="type-buttons">

                    <button
                        type="button"
                        className={
                            form.role === "OPERATEUR"
                                ? "selected"
                                : ""
                        }
                        onClick={() =>
                            setForm({
                                ...form,
                                role: "OPERATEUR"
                            })
                        }
                    >
                        Operator
                    </button>

                    {currentUser.role === "SUPER_ADMIN" && (

                        <button
                            type="button"
                            className={
                                form.role === "ADMIN"
                                    ? "selected"
                                    : ""
                            }
                            onClick={() =>
                                setForm({
                                    ...form,
                                    role: "ADMIN"
                                })
                            }
                        >
                            Admin
                        </button>

                    )}

                </div>

                <div className="modal-actions">

                    <button

                        className="cancel-btn"

                        onClick={close}

                    >

                        Cancel

                    </button>

                    <button

                        className="save-btn"

                        onClick={() => save(form)}

                    >

                        Save

                    </button>

                </div>

            </div>

        </div>

    );

}