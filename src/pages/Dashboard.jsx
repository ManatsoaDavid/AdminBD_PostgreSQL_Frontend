import { useState, useEffect } from "react";
import { clientsAPI, versementsAPI, auditAPI } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    versements: 0,
    totalSolde: 0,
    auditStats: {},
  });

  useEffect(() => {
    Promise.all([
      clientsAPI.getAll(),
      versementsAPI.getAll(),
      auditAPI.getAll(),
    ]).then(([c, v, a]) => {
      const totalSolde = c.data.reduce(
        (sum, cl) => sum + parseFloat(cl.solde),
        0,
      );
      setStats({
        clients: c.data.length,
        versements: v.data.length,
        totalSolde,
        auditStats: a.data.stats,
      });
    });
  }, []);

  const cards = [
    {
      label: "👥 Clients",
      value: stats.clients,
      bg: "#e3f2fd",
      color: "#1565c0",
    },
    {
      label: "💰 Versements",
      value: stats.versements,
      bg: "#e8f5e9",
      color: "#2e7d32",
    },
    {
      label: "🏦 Total Soldes",
      value: stats.totalSolde.toLocaleString() + " Ar",
      bg: "#fff8e1",
      color: "#f57f17",
    },
    {
      label: "📋 Opérations",
      value:
        parseInt(stats.auditStats.nb_insertions || 0) +
        parseInt(stats.auditStats.nb_modifications || 0) +
        parseInt(stats.auditStats.nb_suppressions || 0),
      bg: "#fce4ec",
      color: "#c62828",
    },
  ];

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto" }}>
      <h2 style={{ color: "#1a237e", marginBottom: "25px" }}>
        📊 Tableau de bord
      </h2>

      {/* KPI Cards */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              minWidth: "200px",
              background: card.bg,
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: card.color,
              }}
            >
              {card.value}
            </div>
            <div style={{ color: "#555", marginTop: "8px", fontWeight: "500" }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Stats audit */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ color: "#1a237e", marginBottom: "20px" }}>
          📋 Résumé des opérations d'audit
        </h3>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {[
            {
              label: "✅ Insertions",
              val: stats.auditStats.nb_insertions || 0,
              color: "#2e7d32",
            },
            {
              label: "✏️ Modifications",
              val: stats.auditStats.nb_modifications || 0,
              color: "#f57f17",
            },
            {
              label: "🗑️ Suppressions",
              val: stats.auditStats.nb_suppressions || 0,
              color: "#c62828",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "20px",
                background: "#f9f9f9",
                borderRadius: "10px",
                minWidth: "150px",
              }}
            >
              <div
                style={{ fontSize: "40px", fontWeight: "bold", color: s.color }}
              >
                {s.val}
              </div>
              <div style={{ color: "#555", marginTop: "8px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
