import { useState } from "react";
import { Link } from "react-router-dom";

import "../../../styles/auth/auth.css";
import "../../../styles/auth/login.css";

import Logo from "../components/common/Logo";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Checkbox from "../components/common/Checkbox";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Temporary login
      console.log({
        email,
        password,
        remember,
      });

      const data = {
        access: "fake-access-token",
        refresh: "fake-refresh-token",
      };

      if (remember) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
      } else {
        sessionStorage.setItem("access", data.access);
        sessionStorage.setItem("refresh", data.refresh);
      }

      console.log("Login successful");
    } catch (err) {
      setError("Invalid email or password.");
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

        <form className="login-form" onSubmit={handleSubmit}>

          <Input
            label="Email address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="login-options">
            <Checkbox
              label="Remember me"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />

            <Link
              to="/forgot-password"
              className="forgot-password"
            >
              Forgot password?
            </Link>
          </div>

          <Button loading={loading}>
            Sign In
          </Button>

          <ErrorMessage message={error} />

          <div className="demo-box">
            <strong>Demo credentials:</strong> admin / admin
          </div>

          <p className="login-footer">
            EnergyFlow · Startup Village AC Supervision Platform
          </p>

        </form>

      </div>
    </div>
  );
}