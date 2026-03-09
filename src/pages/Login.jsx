import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/login.php", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      onLogin(res.data);
    } catch (err) {
      setError("❌ Identifiants incorrects. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🏦</div>
          <h1 style={styles.title}>Versements Bancaires</h1>
          <p style={styles.subtitle}>Connectez-vous pour continuer</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>👤 Nom d'utilisateur</label>
            <input
              style={styles.input}
              placeholder="admin"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>🔑 Mot de passe</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "⏳ Connexion..." : "🔐 Se connecter"}
          </button>
        </form>

        <div style={styles.hint}>
          <p>💡 Compte par défaut :</p>
          <p>
            <strong>Login :</strong> admin
          </p>
          <p>
            <strong>Mot de passe :</strong> password
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a237e, #283593)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  header: { textAlign: "center", marginBottom: "30px" },
  icon: { fontSize: "50px", marginBottom: "10px" },
  title: {
    color: "#1a237e",
    fontSize: "22px",
    fontWeight: "bold",
    margin: "0 0 8px",
  },
  subtitle: { color: "#666", fontSize: "14px", margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "14px", fontWeight: "600", color: "#333" },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    fontSize: "15px",
    outline: "none",
    transition: "border 0.2s",
  },
  btn: {
    padding: "14px",
    background: "linear-gradient(135deg, #1a237e, #283593)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    background: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    textAlign: "center",
  },
  hint: {
    marginTop: "20px",
    background: "#f5f5f5",
    borderRadius: "8px",
    padding: "15px",
    fontSize: "13px",
    color: "#555",
    lineHeight: "1.8",
  },
};
