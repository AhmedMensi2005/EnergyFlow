import "../../../../styles/components/input.css";

export default function Input({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>

      <input
        className="input-field"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}