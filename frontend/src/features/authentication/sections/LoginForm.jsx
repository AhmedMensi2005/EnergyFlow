import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Logo,
  Input,
  PasswordInput,
  Checkbox,
  Button,
  ErrorMessage,
} from "../components/common";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div>
      <Logo />

      <h1>Welcome back</h1>

      <p>Sign in to your supervision dashboard</p>

      <form onSubmit={handleSubmit}>
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Checkbox
            label="Remember me"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />

          <Link to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <Button loading={loading}>
          Sign In
        </Button>

        <ErrorMessage message={error} />
      </form>
    </div>
  );
}