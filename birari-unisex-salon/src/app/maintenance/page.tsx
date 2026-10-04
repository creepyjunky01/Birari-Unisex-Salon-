export default function MaintenancePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#0a0a0a",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
        textAlign: "center",
      }}
    >
      <section style={{ maxWidth: "620px" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            margin: "0 auto 24px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            border: "1px solid #333",
            background: "#151515",
            fontSize: "32px",
          }}
        >
          ✂
        </div>

        <p
          style={{
            margin: "0 0 10px",
            color: "#c62828",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Birari Unisex Salon
        </p>

        <h1
          style={{
            margin: "0 0 14px",
            fontSize: "clamp(34px, 8vw, 58px)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
          }}
        >
          We&apos;ll be back soon.
        </h1>

        <p
          style={{
            margin: "0 auto",
            maxWidth: "500px",
            color: "#a3a3a3",
            fontSize: "16px",
            lineHeight: 1.7,
          }}
        >
          Our website is temporarily under maintenance while we make some
          improvements. Please check back shortly.
        </p>

        <div
          style={{
            width: "56px",
            height: "1px",
            margin: "28px auto 0",
            background: "#c62828",
          }}
        />
      </section>
    </main>
  );
}
