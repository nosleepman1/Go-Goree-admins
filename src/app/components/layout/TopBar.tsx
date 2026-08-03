import React from "react";
import { Moon, Sun, Bell, Search, ChevronDown } from "lucide-react";
import { useLocation } from "react-router";
import { titleForPath } from "@/app/lib/routes";

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  ocean:         "#0B5ED7",
  sidebarActive: "linear-gradient(135deg, #4EA8DE, #0B5ED7)",
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface TopBarProps {
  darkMode: boolean;
  onDark:  (v: boolean) => void;
}

export default function TopBar({ darkMode, onDark }: TopBarProps) {
  const { pathname } = useLocation();
  const pageLabel = titleForPath(pathname);

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b bg-white dark:bg-slate-900 dark:border-slate-700 shrink-0"
      style={{ borderColor: "#C2D3EE" }}
    >
      {/* ── Left : page title ── */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
          {pageLabel}
        </h2>
        <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
          GO GORÉE · Système de gestion des traversées
        </p>
      </div>

      {/* ── Right : search + actions ── */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Recherche rapide…"
            className="pl-8 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 w-52 transition-all"
          />
        </div>

        {/* Notifications */}
        <button
          className="relative size-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Notifications"
        >
          <Bell size={16} />
          <span
            className="absolute top-1 right-1 size-2 rounded-full border-2 border-white"
            style={{ background: C.ocean }}
          />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={() => onDark(!darkMode)}
          className="size-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title={darkMode ? "Mode clair" : "Mode sombre"}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Admin avatar */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
          <div
            className="size-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{ background: C.sidebarActive }}
          >
            A
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">Admin</div>
            <div className="text-[10px] text-slate-400 leading-tight">Superadmin</div>
          </div>
          <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-600 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
