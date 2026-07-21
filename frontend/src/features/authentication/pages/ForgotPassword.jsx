import { useState } from "react";
import { Link } from "react-router-dom";

import "../../../styles/auth/auth.css";
import "../../../styles/auth/forgot-password.css";
import { forgotPassword } from "../../../services/authService";
import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async(e)=>{

    e.preventDefault();
    if(!email){
      setError("Please enter your email.");
      return;
  }

    setLoading(true);
    setMessage("");
    setError("");

    try {

        const data = await forgotPassword(email);

        setMessage(data.message);


    } catch(err){

        if(err.response){

            setError(
                err.response.data.error
            );

        }
        else{

            setError(
                "Something went wrong."
            );

        }

    }
    finally{

        setLoading(false);

    }

};

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Logo />

        <div className="auth-header">
          <h1 className="auth-title">
            Forgot Password
          </h1>

          <p className="auth-subtitle">
            Enter your email address and we'll send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <Input
            label="Email address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
              <ErrorMessage message={error}/>
          )}

          {message && (
              <ErrorMessage 
                  message={message}
                  success
              />
          )}

          <Button loading={loading}>
            Send Reset Link
          </Button>

        </form>

        <div className="auth-footer">
          <Link
            to="/login"
            className="back-link"
          >
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}