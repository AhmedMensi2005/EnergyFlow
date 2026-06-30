

export default function Button({
  children,
  loading,
  type = "submit",
}) {
  return (
    <button
      className="primary-button"
      type={type}
      disabled={loading}
    >
      {loading
        ? "Signing In..."
        : children}
    </button>
  );
}