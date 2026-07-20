export default function Home() {
  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      backgroundColor: "#f8f9ff",
      color: "#0b1c30",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      boxSizing: "border-box"
    }}>
      <main style={{
        maxWidth: "640px",
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "1.5rem",
        boxShadow: "0 10px 30px rgba(11, 28, 48, 0.04)",
        padding: "3rem 2rem",
        textAlign: "center"
      }}>
        {/* Logo Icon */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e8fdf5",
          color: "#10b981",
          width: "4.5rem",
          height: "4.5rem",
          borderRadius: "1.25rem",
          marginBottom: "1.5rem"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", fontVariationSettings: "'FILL' 1" }}>eco</span>
        </div>

        {/* Headings */}
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#0b1c30",
          margin: "0 0 0.5rem 0",
          lineHeight: 1.2
        }}>
          TekNova Frontend Ready!
        </h1>
        <p style={{
          fontSize: "1.1rem",
          color: "#64748b",
          margin: "0 0 2rem 0",
          lineHeight: 1.5
        }}>
          Next.js is successfully installed and integrated with the backend API helpers.
        </p>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2.5rem"
        }}>
          <div style={{ backgroundColor: "#f8f9ff", padding: "1rem", borderRadius: "1rem" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#10b981" }}>12k+</div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Reused</div>
          </div>
          <div style={{ backgroundColor: "#f8f9ff", padding: "1rem", borderRadius: "1rem" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e3a8a" }}>$84k</div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Saved</div>
          </div>
          <div style={{ backgroundColor: "#f8f9ff", padding: "1rem", borderRadius: "1rem" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f59e0b" }}>4.2t</div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>CO2 Off</div>
          </div>
        </div>

        {/* Quick Instructions */}
        <div style={{ textAlign: "left", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", marginBottom: "1rem" }}>
            Getting Started
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ backgroundColor: "#e5eeff", color: "#1e3a8a", fontWeight: 700, width: "1.5rem", height: "1.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0 }}>1</div>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#475569" }}>Add your Supabase Anon Key to <strong>.env.local</strong> at the root.</p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ backgroundColor: "#e5eeff", color: "#1e3a8a", fontWeight: 700, width: "1.5rem", height: "1.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0 }}>2</div>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#475569" }}>Import our backend wrappers from <strong>lib/api.js</strong> to query listings, chat, and stats.</p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ backgroundColor: "#e5eeff", color: "#1e3a8a", fontWeight: 700, width: "1.5rem", height: "1.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0 }}>3</div>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#475569" }}>Run <code>npm run dev</code> in the terminal and open <a href="http://localhost:3000" target="_blank" rel="noreferrer" style={{ color: "#1e3a8a", fontWeight: 600, textDecoration: "none" }}>http://localhost:3000</a>.</p>
            </div>
          </div>
        </div>

        {/* Secondary Info */}
        <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
          Check out <strong>TekNova_Backend_Setup.md</strong> at the root for backend mapping details.
        </p>
      </main>
    </div>
  )
}
