import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Logo,
  Input,
  Button,
  ErrorMessage,
} from "../components/common";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Reset email:", email);

      // fake API call (replace later with Django endpoint)
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      setSuccess(
        "A reset link has been sent to your email."
      );
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Logo component */}
      <Logo />

      <h1>Forgot Password</h1>

      <p>
        Enter your email and we will send you a reset link.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Input component */}
        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Button component */}
        <Button loading={loading}>
          Send reset link
        </Button>

        {/* Error component */}
        <ErrorMessage message={error} />

        {/* Success message (simple for now) */}
        {success && (
          <p style={{ color: "green", marginTop: "10px" }}>
            {success}
          </p>
        )}
      </form>

      {/* Navigation */}
      <p style={{ marginTop: "20px" }}>
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
}