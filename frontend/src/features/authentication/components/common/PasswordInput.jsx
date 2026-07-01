import { useState } from "react";
import "../../../../styles/components/input.css";

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="input-group">
      <label className="input-label">{label}</label>

      <div className="password-wrapper">
        <input
          className="input-field"
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />

        <button
          type="button"
          className="eye-button"
          onClick={() => setShow(!show)}
        >
          {show ? "👁" : "⌣"}
        </button>
      </div>
    </div>
  );
}