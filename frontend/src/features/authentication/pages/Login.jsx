import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../../styles/auth/auth.css";
import "../../../styles/auth/login.css";

import Logo from "../components/Logo";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";

import { login } from "../../../services/authService";


export default function Login() {

  const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

        const data = await login(
            email,
            password
        );


        if (!data.access || !data.refresh) {

            throw new Error(
                "No token received"
            );

        }


        localStorage.setItem(
            "access_token",
            data.access
        );


        localStorage.setItem(
            "refresh_token",
            data.refresh
        );


        navigate("/dashboard");


    } catch (err) {


        console.error(err);


        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "refresh_token"
        );


        sessionStorage.removeItem(
            "access_token"
        );

        sessionStorage.removeItem(
            "refresh_token"
        );


        setError(
            "Invalid email or password."
        );


    } finally {

        setLoading(false);

    }

  };



  return (

    <div className="auth-page">

      <div className="auth-card">


        <Logo />


        <div className="auth-header">

          <h1 className="auth-title">
            Welcome back
          </h1>


          <p className="auth-subtitle">
            Sign in to your supervision dashboard
          </p>

        </div>



        <form
          className="login-form"
          onSubmit={handleSubmit}
        >


          <Input

            label="Email address"

            type="email"

            placeholder="Enter your email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

          />



          <PasswordInput

            label="Password"

            placeholder="Enter your password"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }

          />



          <div className="login-options">


            <Link

              to="/forgot-password"

              className="forgot-password"

            >

              Forgot password?

            </Link>


          </div>




          <Button

            type="submit"

            loading={loading}

          >

            Sign In

          </Button>



          <ErrorMessage

            message={error}

          />



          <p className="login-footer">

            EnergyFlow · Startup Village AC Supervision Platform

          </p>



        </form>


      </div>


    </div>

  );

}