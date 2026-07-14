import Logo from "../components/Logo";

import ResetPasswordForm from "../components/ResetPasswordForm";

import "../../../styles/auth/auth.css";
import "../../../styles/auth/login.css";


export default function ResetPassword(){

    return (

        <div className="auth-page">

            <div className="auth-card">


                <Logo />


                <div className="auth-header">

                    <h1 className="auth-title">
                        Reset password
                    </h1>


                    <p className="auth-subtitle">
                        Enter your new password
                    </p>

                </div>


                <ResetPasswordForm />


            </div>

        </div>

    );
}