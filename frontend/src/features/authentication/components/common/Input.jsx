

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="input-group">
      <label className="input-label">
        {label}
      </label>

      <input
        className="input-field"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}