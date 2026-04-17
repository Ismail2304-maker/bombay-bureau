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
        fontFamily: "serif",
      }}
    >
      <div style={{ maxWidth: "700px" }}>
        
        {/* MASTHEAD STYLE TITLE */}
        <h1
          style={{
            fontSize: "56px",
            letterSpacing: "1px",
            marginBottom: "20px",
          }}
        >
          Bombay Bureau
        </h1>

        {/* STATUS CODE */}
        <p
          style={{
            fontSize: "22px",
            marginBottom: "12px",
            opacity: 0.9,
          }}
        >
          503
        </p>

        {/* MESSAGE */}
        <p
          style={{
            fontSize: "20px",
            marginBottom: "16px",
          }}
        >
          Bombay Bureau is temporarily unavailable
        </p>

        <p
          style={{
            color: "#aaa",
            fontSize: "16px",
          }}
        >
          We are currently performing maintenance and improving the platform.
          Please check back shortly.
        </p>

        <p
          style={{
            color: "#666",
            marginTop: "32px",
            fontSize: "14px",
          }}
        >
          — Bombay Bureau Editorial Team
        </p>

      </div>
    </main>
  );
}