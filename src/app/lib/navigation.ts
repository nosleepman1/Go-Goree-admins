// Navigation configuration extracted from App.tsx
export interface NavChild { label: string; page: string; badge?: number }
export interface NavItem {
  id: string; label: string; icon: any;
  page?: string; children?: NavChild[];
}

export const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: undefined, page: "dashboard" },
  { id: "voyages", label: "Voyages", icon: undefined, children: [
    { label: "Liste des voyages", page: "voyages-liste" },
    { label: "Historique", page: "voyages-historique" },
  ]},
  { id: "billets", label: "Billets", icon: undefined, children: [
    { label: "Liste des billets", page: "billets-liste" },
  ]},
  { id: "controlleurs", label: "Contrôleurs", icon: undefined, children: [
    { label: "Liste contrôleurs", page: "ctrl-liste" },
  ]},
  { id: "chaloupes", label: "Chaloupes", icon: undefined, children: [
    { label: "Flotte", page: "chaloupes-liste" },
  ]},
  { id: "tarifs", label: "Tarifs", icon: undefined, children: [
    { label: "Grille tarifaire", page: "tarifs-grille" },
    { label: "Catégories", page: "tarifs-categories" },
    { label: "Horaires", page: "tarifs-horaires" },
  ]},
  { id: "paiements", label: "Paiements", icon: undefined, children: [
    { label: "Transactions", page: "paie-transactions", badge: 12 },
  ]},
  { id: "wallet", label: "Wallet", icon: undefined, children: [
    { label: "Solde global", page: "wallet-solde" },
    { label: "Mouvements", page: "wallet-mouvements" },
    { label: "Rechargements", page: "wallet-rechargements" },
    { label: "Débits", page: "wallet-debits" },
  ]},
  { id: "residents", label: "Demandes Résident", icon: undefined, children: [
    { label: "En attente", page: "res-liste", badge: 8 },
    { label: "Refusées", page: "res-refusees" },
    { label: "Historique", page: "res-historique" },
  ]},
  { id: "notifs", label: "Notifications", icon: undefined, children: [
    { label: "Envoyer notification", page: "notifs-envoyer" },
    { label: "SMS", page: "notifs-sms" },
    { label: "Email", page: "notifs-email" },
    { label: "Push", page: "notifs-push" },
    { label: "In-App", page: "notifs-inapp" },
    { label: "Historique", page: "notifs-historique" },
  ]},
  { id: "stats", label: "Statistiques", icon: undefined, children: [
    { label: "Vue d'ensemble", page: "stats-overview" },
    { label: "Billets & Ventes", page: "stats-billets" },
    { label: "Recettes", page: "stats-recettes" },
    { label: "Occupation", page: "stats-occupation" },
    { label: "Heures de pointe", page: "stats-heures" },
    { label: "Catégories voyageurs", page: "stats-categories" },
    { label: "Taux de validation", page: "stats-validation" },
    { label: "Paiements", page: "stats-paiements" },
  ]},
  { id: "rapports", label: "Rapports", icon: undefined, children: [
    { label: "Générer un rapport", page: "rapp-generer" },
    { label: "Historique des rapports", page: "rapp-historique" },
  ]},
  { id: "params", label: "Paramètres", icon: undefined, children: [
    { label: "Général", page: "params-general" },
  ]},
];
