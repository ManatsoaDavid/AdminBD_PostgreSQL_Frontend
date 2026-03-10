import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  ClipboardList,
  LogOut,
  Building2,
} from "lucide-react";

export default function Navbar({ user, onLogout }) {
  const location = useLocation();

  const links = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/clients", label: "Clients", icon: Users },
    { path: "/versements", label: "Versements", icon: ArrowLeftRight },
    { path: "/audit", label: "Audit", icon: ClipboardList },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 shadow-xl border-b border-blue-800/30">
      <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-400/30">
            <Building2 size={22} className="text-blue-300" />
          </div>
          <div>
            <span className="text-white font-bold text-base leading-tight block">
              Versements Bancaires
            </span>
            <span className="text-blue-400 text-xs">Système de gestion</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-1">
          {links.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-600/40 px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white text-xs font-semibold leading-tight">
                {user?.username}
              </p>
              <p className="text-slate-400 text-xs leading-tight capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 text-sm font-medium rounded-xl transition-all"
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
