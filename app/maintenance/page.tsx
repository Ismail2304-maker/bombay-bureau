export default function MaintenancePage() {
  return (
    <main
      style={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "600px" }}>
        <h1 style={{ fontSize: "64px", marginBottom: "24px" }}>
          503
        </h1>

        <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
          Bombay Bureau is temporarily unavailable
        </h2>

        <p style={{ color: "#aaa" }}>
          We are currently performing maintenance and improving the platform.
          Please check back shortly.
        </p>

        <p style={{ color: "#666", marginTop: "32px", fontSize: "14px" }}>
          — Bombay Bureau Editorial Team
        </p>
      </div>
    </main>
  );
}