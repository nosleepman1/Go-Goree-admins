import { NAV } from "./navigation";

// Mapping ancien ID de page (navigation.ts) -> URL réelle (cf. ROUTES_MAPPING.md)
export const PAGE_TO_PATH: Record<string, string> = {
  dashboard: "/",
  "voyages-liste": "/voyages",
  "voyages-planning": "/voyages/planning",
  "voyages-historique": "/voyages/historique",
  "billets-liste": "/billets",
  "passagers-profil": "/passagers",
  "ctrl-liste": "/controleurs",
  "chaloupes-liste": "/chaloupes",
  "chaloupes-maintenance": "/chaloupes/maintenance",
  "chaloupes-planning": "/chaloupes/planning",
  "tarifs-grille": "/tarifs",
  "tarifs-categories": "/tarifs/categories",
  "tarifs-horaires": "/tarifs/horaires",
  "paie-transactions": "/paiements",
  "paie-wave": "/paiements/wave",
  "paie-orange": "/paiements/orange",
  "paie-yas": "/paiements/yas",
  "paie-carte": "/paiements/carte",
  "wallet-solde": "/wallet",
  "wallet-mouvements": "/wallet/mouvements",
  "wallet-rechargements": "/wallet/rechargements",
  "wallet-debits": "/wallet/debits",
  "res-liste": "/residents",
  "res-refusees": "/residents/refusees",
  "res-historique": "/residents/historique",
  "notifs-envoyer": "/notifications",
  "notifs-sms": "/notifications/sms",
  "notifs-email": "/notifications/email",
  "notifs-push": "/notifications/push",
  "notifs-inapp": "/notifications/inapp",
  "notifs-historique": "/notifications/historique",
  "stats-overview": "/statistiques",
  "stats-billets": "/statistiques/billets",
  "stats-recettes": "/statistiques/recettes",
  "stats-occupation": "/statistiques/occupation",
  "stats-heures": "/statistiques/heures",
  "stats-categories": "/statistiques/categories",
  "stats-validation": "/statistiques/validation",
  "stats-paiements": "/statistiques/paiements",
  "rapp-generer": "/rapports",
  "rapp-pdf": "/rapports/pdf",
  "rapp-excel": "/rapports/excel",
  "rapp-csv": "/rapports/csv",
  "rapp-historique": "/rapports/historique",
  "params-general": "/parametres",
};

export function pathForPage(page: string): string {
  return PAGE_TO_PATH[page] ?? "/";
}

export function titleForPath(pathname: string): string {
  if (pathname === "/login") return "Connexion";
  for (const item of NAV) {
    if (item.page && pathForPage(item.page) === pathname) return item.label;
    if (item.children) {
      for (const child of item.children) {
        if (pathForPage(child.page) === pathname) return `${item.label} — ${child.label}`;
      }
    }
  }
  return "GO GORÉE";
}
