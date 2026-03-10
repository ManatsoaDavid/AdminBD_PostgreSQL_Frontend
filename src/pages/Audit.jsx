import { useState, useEffect } from "react";
import {
  Search,
  X,
  RefreshCw,
  CheckCircle,
  PenLine,
  Trash2,
  ClipboardList,
  Filter,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auditAPI } from "../services/api";

const ACTION_CONFIG = {
  INSERT: {
    label: "Insertion",
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  UPDATE: {
    label: "Modification",
    icon: PenLine,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  DELETE: {
    label: "Suppression",
    icon: Trash2,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
  },
};

export default function Audit() {
  const [audits, setAudits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [filtreAction, setFiltreAction] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  useEffect(() => {
    auditAPI.getAll().then((res) => {
      setAudits(res.data.audits);
      setFiltered(res.data.audits);
      setStats(res.data.stats);
    });
  }, []);

  useEffect(() => {
    let result = audits;
    if (filtreAction)
      result = result.filter((a) => a.type_action === filtreAction);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.nomclient?.toLowerCase().includes(q) ||
          a.utilisateur?.toLowerCase().includes(q) ||
          a.nversement?.toString().includes(q),
      );
    }
    if (dateDebut)
      result = result.filter(
        (a) => new Date(a.date_operation) >= new Date(dateDebut),
      );
    if (dateFin)
      result = result.filter(
        (a) => new Date(a.date_operation) <= new Date(dateFin + "T23:59:59"),
      );
    setFiltered(result);
  }, [search, filtreAction, dateDebut, dateFin, audits]);

  const hasFiltres = search || filtreAction || dateDebut || dateFin;
  const total =
    parseInt(stats.nb_insertions || 0) +
    parseInt(stats.nb_modifications || 0) +
    parseInt(stats.nb_suppressions || 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Journal d'Audit</h2>
        <p className="text-gray-400 text-sm mt-1">
          Historique complet de toutes les opérations
        </p>
      </div>

      {/* Stats cliquables */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { key: "nb_insertions", action: "INSERT", label: "Insertions" },
          { key: "nb_modifications", action: "UPDATE", label: "Modifications" },
          { key: "nb_suppressions", action: "DELETE", label: "Suppressions" },
          { key: null, action: null, label: "Total" },
        ].map((s, i) => {
          const val = s.key ? parseInt(stats[s.key] || 0) : total;
          const cfg = s.action ? ACTION_CONFIG[s.action] : null;
          const Icon = cfg?.icon || ClipboardList;
          const active = filtreAction === s.action && s.action;
          return (
            <div
              key={i}
              onClick={() =>
                s.action && setFiltreAction(active ? "" : s.action)
              }
              className={`bg-white rounded-2xl border-2 p-5 transition-all ${
                s.action ? "cursor-pointer hover:shadow-md" : ""
              } ${active ? `${cfg.border} shadow-md` : "border-gray-100"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2 rounded-xl ${cfg ? cfg.bg : "bg-blue-50"}`}
                >
                  <Icon
                    size={18}
                    className={cfg ? cfg.color : "text-blue-600"}
                  />
                </div>
                {s.action && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}
                  >
                    {active ? "Actif" : "Filtrer"}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900">{val}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Table + filtres */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-5 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mr-1">
            <Filter size={15} /> Filtres
          </div>
          <div className="relative flex-1 min-w-52">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
              placeholder="Client, utilisateur, n° versement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <select
            className="px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
            value={filtreAction}
            onChange={(e) => setFiltreAction(e.target.value)}
          >
            <option value="">Toutes les actions</option>
            <option value="INSERT">✅ INSERT</option>
            <option value="UPDATE">✏️ UPDATE</option>
            <option value="DELETE">🗑️ DELETE</option>
          </select>
          <input
            type="date"
            title="Date début"
            className="px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
          <input
            type="date"
            title="Date fin"
            className="px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
          {hasFiltres && (
            <button
              onClick={() => {
                setSearch("");
                setFiltreAction("");
                setDateDebut("");
                setDateFin("");
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-xl transition-colors"
            >
              <RefreshCw size={14} /> Réinitialiser
            </button>
          )}
        </div>

        {/* Info */}
        <p className="text-sm text-gray-400 mb-4">
          {hasFiltres ? (
            <>
              <span className="font-semibold text-gray-700">
                {filtered.length}
              </span>{" "}
              résultat(s) sur {audits.length} opérations
            </>
          ) : (
            <>
              <span className="font-semibold text-gray-700">
                {audits.length}
              </span>{" "}
              opération(s) au total
            </>
          )}
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <ClipboardList size={52} className="mb-3" />
              <p className="text-sm font-medium text-gray-400">
                {audits.length === 0
                  ? "Aucune opération enregistrée."
                  : "Aucun résultat pour ces filtres."}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800 to-blue-900 text-white">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                    N° Versement
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                    Solde Avant
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                    Solde Après
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                    Utilisateur
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((a, i) => {
                  const cfg = ACTION_CONFIG[a.type_action] || {};
                  const Icon = cfg.icon;
                  return (
                    <tr
                      key={a.id}
                      className={`hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
                    >
                      <td className="px-5 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.badge} ${cfg.border}`}
                        >
                          {Icon && <Icon size={11} />}
                          {a.type_action}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(a.date_operation).toLocaleString("fr-FR")}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                          #{a.nversement}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {a.nomclient?.[0]}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            {a.nomclient}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-500">
                          {a.montant_ancien
                            ? parseFloat(a.montant_ancien).toLocaleString() +
                              " Ar"
                            : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-blue-700">
                          {a.montant_nouv
                            ? parseFloat(a.montant_nouv).toLocaleString() +
                              " Ar"
                            : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                            {a.utilisateur?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-600 font-medium">
                            {a.utilisateur}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
