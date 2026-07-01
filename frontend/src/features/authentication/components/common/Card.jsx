export default function Card({ children }) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          margin: "auto",
          background: "#fff",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {children}
      </div>
    );
  }