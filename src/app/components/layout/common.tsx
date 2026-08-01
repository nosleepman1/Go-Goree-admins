import React from "react";

export const C = {
  // Aligné sur le bleu de la page de connexion de l'app client (Go-Goree-Clients,
  // src/constants/theme.ts : colors.primaryLight/primaryDark).
  ocean: "#0B5ED7",
  oceanDark: "#0B5ED7",
  teal: "#0BA5C0",
  green: "#0E9F6E",
  amber: "#D97706",
  purple: "#7C3AED",
  red: "#D42020",
  sidebarBg: "#FFFFFF",
  sidebarBorder: "#C2D3EE",
  sidebarActive: "linear-gradient(135deg, #4EA8DE, #0B5ED7)",
};

export function cn(...cls: (string | undefined | false | null)[]) {
  return cls.filter(Boolean).join(" ");
}

export function Badge({ label, color }: { label: string; color: "green" | "blue" | "amber" | "red" | "purple" | "gray" | "teal" | "indigo" }) {
  const map: Record<string, string> = {
    green: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700",
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700",
    amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700",
    red: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-700",
    gray: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600",
    teal: "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-700",
    indigo: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border", map[color])}>
      {label}
    </span>
  );
}

export function StatusBadge({ statut }: { statut: string }) {
  const map: Record<string, { color: "green" | "blue" | "amber" | "red" | "gray" | "teal" | "purple" | "indigo" }> = {
    "Terminé": { color: "green" }, "Actif": { color: "green" }, "Succès": { color: "green" }, "Validé": { color: "green" },
    "En cours": { color: "blue" }, "En attente": { color: "amber" }, "Incomplet": { color: "amber" }, "Test": { color: "amber" },
    "Prévu": { color: "teal" }, "VIP": { color: "purple" }, "Maintenance": { color: "amber" },
    "Inactif": { color: "gray" }, "Échoué": { color: "red" }, "Refusé": { color: "red" },
  };
  return <Badge label={statut} color={map[statut]?.color ?? "gray"} />;
}
