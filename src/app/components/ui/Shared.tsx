import React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, AreaChart, Area, PieChart as RPieChart, Pie, Legend } from "recharts";
import { cn, StatusBadge } from "@/app/components/layout/common";

export function KPICard({ title, value, sub, icon: Icon, trend, color }: {
  title: string; value: string; sub: string; icon: React.ElementType; trend?: { val: string; up: boolean }; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="bg-white dark:bg-card rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
        </div>
        <div className="size-11 rounded-xl flex items-center justify-center" style={{ background: color + "20" }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {trend && (
          <span className={cn("flex items-center gap-0.5 text-xs font-semibold", trend.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")}>
            {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.val}
          </span>
        )}
        <span className="text-xs text-slate-400 dark:text-slate-500">{sub}</span>
      </div>
    </motion.div>
  );
}

export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-card rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Btn({ label, icon: Icon, variant = "primary", onClick, loading, disabled, type = "button", className }: { label: string; icon?: React.ElementType; variant?: "primary" | "secondary" | "ghost" | "danger" | "success"; onClick?: () => void; loading?: boolean; disabled?: boolean; type?: "button" | "submit" | "reset"; className?: string }) {
  const base = "inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer relative overflow-hidden";
  const vars: Record<string, string> = {
    primary: "text-white shadow-sm hover:opacity-90",
    secondary: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700",
    ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700",
    danger: "bg-rose-600 hover:bg-rose-700 text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
  };
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={cn(base, vars[variant], (loading || disabled) && "opacity-70 cursor-not-allowed", className)}
      style={variant === "primary" ? { background: "linear-gradient(135deg, #4EA8DE, #0B5ED7)" } as React.CSSProperties : undefined}
      onClick={onClick}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        Icon && <Icon size={15} />
      )}
      {label}
    </button>
  );
}

export function Table({ cols, rows }: { cols: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-700">
            {cols.map((c, i) => (
              <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SearchBar({ placeholder }: { placeholder?: string }) {
  return (
    <div className="relative">
      <SearchIcon />
      <input
        className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:border-blue-400 w-64 placeholder:text-slate-400"
        placeholder={placeholder ?? "Rechercher..."}
      />
    </div>
  );
}

function SearchIcon() { return <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> }

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white dark:bg-card rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-5", className)}>
      {children}
    </div>
  );
}

export function OccBar({ val }: { val: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${val}%`, background: `linear-gradient(90deg, #4EA8DE, #0B5ED7)` }} />
      </div>
      <span className="text-xs font-mono text-slate-600 w-8 text-right">{val}%</span>
    </div>
  );
}

export function Loader({ isLoading, isError, message }: { isLoading?: boolean; isError?: boolean; message?: string }) {
  if (!isLoading && !isError) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[50vh]">
      {isError && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 px-6 py-4 text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 shadow-sm text-center">
          Données indisponibles — Impossible de joindre le serveur.
        </div>
      )}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-10 space-y-5">
          <div className="flex items-center justify-center gap-2.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="size-4 rounded-full shadow-[0_0_15px_rgba(11,94,215,0.6)]"
                style={{ background: "linear-gradient(135deg, #4EA8DE, #0B5ED7)" }}
                animate={{
                  y: ["0%", "-120%", "0%"],
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15
                }}
              />
            ))}
          </div>
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-xs font-bold uppercase tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-[#4EA8DE] to-[#0B5ED7]"
          >
            {message || "Chargement des données..."}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export { StatusBadge };

export default {} as never;
