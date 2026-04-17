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
        textAlign: "center",
        padding: "20px",
        fontFamily: "serif",
      }}
    >
      <div style={{ maxWidth: "640px" }}>

        {/* 503 */}
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 400,
            marginBottom: "24px",
          }}
        >
          503
        </h1>

        {/* HEADLINE */}
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 400,
            marginBottom: "20px",
          }}
        >
          Bombay Bureau is temporarily unavailable
        </h2>

        {/* DESCRIPTION */}
        <p
          style={{
            color: "#9ca3af",
            fontSize: "18px",
            lineHeight: "1.6",
            marginBottom: "28px",
          }}
        >
          We are currently performing maintenance and improving the platform.
          Please check back shortly.
        </p>

        {/* SIGNATURE */}
        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
          }}
        >
          — Bombay Bureau Editorial Team
        </p>

      </div>
    </main>
  );
}