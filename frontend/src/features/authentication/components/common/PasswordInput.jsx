import { useState } from "react";


export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div className="input-group">
      <label className="input-label">
        {label}
      </label>

      <div className="password-wrapper">
        <input
          className="input-field"
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        <button
          type="button"
          className="eye-button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>
    </div>
  );
}