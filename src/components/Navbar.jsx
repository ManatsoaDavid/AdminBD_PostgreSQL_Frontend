import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const location = useLocation();

  const links = [
    { path: "/", label: "📊 Dashboard" },
    { path: "/clients", label: "👥 Clients" },
    { path: "/versements", label: "💰 Versements" },
    { path: "/audit", label: "📋 Audit" },
  ];

  return (
    <nav style={styles.nav}>
      <h1 style={styles.title}>🏦 Versements Bancaires</h1>
      <div style={styles.links}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...styles.link,
              ...(location.pathname === link.path ? styles.active : {}),
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div style={styles.userZone}>
        <span style={styles.username}>👤 {user?.username}</span>
        <button onClick={onLogout} style={styles.logoutBtn}>
          🚪 Déconnexion
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#1a237e",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    flexWrap: "wrap",
    gap: "10px",
  },
  title: { color: "white", margin: 0, fontSize: "18px", fontWeight: "bold" },
  links: { display: "flex", gap: "8px", flexWrap: "wrap" },
  link: {
    color: "#90caf9",
    textDecoration: "none",
    padding: "7px 14px",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: "14px",
  },
  active: { background: "#283593", color: "white" },
  userZone: { display: "flex", alignItems: "center", gap: "12px" },
  username: { color: "#90caf9", fontSize: "14px" },
  logoutBtn: {
    padding: "7px 14px",
    background: "#c62828",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold",
  },
};
