import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PasswordInput from "../components/PasswordInput";
import Button from "./Button";
import ErrorMessage from "../components/ErrorMessage";

import { resetPassword } from "../../../services/authService";


export default function ResetPasswordForm() {

    const { uid, token } = useParams();
    const navigate = useNavigate();


    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");


        try {

            await resetPassword(
                uid,
                token,
                password,
                passwordConfirm
            );


            setMessage(
                "Password changed successfully"
            );


            setTimeout(() => {

                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            
                sessionStorage.removeItem("access_token");
                sessionStorage.removeItem("refresh_token");
            
                navigate("/login");
            
            }, 1500);


        } catch(err) {

            setError(
                "Invalid or expired reset link."
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <form
            className="login-form"
            onSubmit={handleSubmit}
        >


            <PasswordInput
                label="New password"
                placeholder="Enter new password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />


            <PasswordInput
                label="Confirm password"
                placeholder="Confirm new password"
                value={passwordConfirm}
                onChange={(e)=>setPasswordConfirm(e.target.value)}
            />


            <Button loading={loading}>
                Reset password
            </Button>


            <ErrorMessage message={error}/>


            {
                message &&
                <p>
                    {message}
                </p>
            }


        </form>

    );
}