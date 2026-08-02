export default function AddUser({

    form,

    userType,

    setUserType,

    handleChange,

    handleCreate,

    close,

    currentUser

}) {

    return (

        <div className="modal-overlay">

            <div className="user-modal">

                <h2>Invite User</h2>

                <div className="type-buttons">

                    <button
                        type="button"
                        className={userType === "OPERATEUR" ? "selected" : ""}
                        onClick={() => setUserType("OPERATEUR")}
                    >
                        Operator
                    </button>

                    {currentUser.role === "SUPER_ADMIN" && (
                        <button
                            type="button"
                            className={userType === "ADMIN" ? "selected" : ""}
                            onClick={() => setUserType("ADMIN")}
                        >
                            Admin
                        </button>
                    )}

                </div>

                <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                />

                <p
                    style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        marginTop: "-6px",
                        marginBottom: "18px",
                        lineHeight: "1.5"
                    }}
                >
                    An invitation email will be sent to this address.
                    The user will choose their own username and password.
                </p>

                <div className="modal-actions">

                <button
                    
                    type="button"
                    className="cancel-btn"
                    onClick={close}
                >
                    Cancel
                </button>
                    <button
                        type="button"
                        className="save-btn"
                        onClick={handleCreate}
                    >
                        Send Invitation
                    </button>
                    

                    

                </div>

            </div>

        </div>

    );

}