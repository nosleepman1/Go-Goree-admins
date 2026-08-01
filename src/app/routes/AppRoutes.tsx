import { Routes, Route, Navigate, useLocation } from "react-router";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/authStore";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../layouts/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import VoyagesPage from "../pages/VoyagesPage";
import BilletsPage from "../pages/BilletsPage";
import PassagersPage from "../pages/PassagersPage";
import CtrlPage from "../pages/CtrlPage";
import ChaloupesPage from "../pages/ChaloupesPage";
import TarifsPage from "../pages/TarifsPage";
import PaiementsPage from "../pages/PaiementsPage";
import WalletPage from "../pages/WalletPage";
import ResidentsPage from "../pages/ResidentsPage";
import NotifsPage from "../pages/NotifsPage";
import StatsPage from "../pages/StatsPage";
import RapportsPage from "../pages/RapportsPage";
import ParamsPage from "../pages/ParamsPage";

function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
}

export default function AppRoutes({ darkMode, onDark }: { darkMode: boolean; onDark: (v: boolean) => void }) {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth><AdminLayout darkMode={darkMode} onDark={onDark} /></RequireAuth>}>
        <Route path="/" element={<DashboardPage />} />

        {/* Voyages */}
        <Route path="/voyages" element={<VoyagesPage sub="liste" />} />
        <Route path="/voyages/historique" element={<VoyagesPage sub="historique" />} />
        <Route path="/voyages/planning" element={<VoyagesPage sub="planning" />} />

        {/* Billets */}
        <Route path="/billets" element={<BilletsPage sub="liste" />} />

        {/* Passagers */}
        <Route path="/passagers" element={<PassagersPage />} />

        {/* Contrôleurs */}
        <Route path="/controleurs" element={<CtrlPage sub="liste" />} />

        {/* Chaloupes */}
        <Route path="/chaloupes" element={<ChaloupesPage />} />

        {/* Tarifs */}
        <Route path="/tarifs" element={<TarifsPage sub="grille" />} />
        <Route path="/tarifs/categories" element={<TarifsPage sub="categories" />} />
        <Route path="/tarifs/horaires" element={<TarifsPage sub="horaires" />} />

        {/* Paiements */}
        <Route path="/paiements" element={<PaiementsPage sub="transactions" />} />

        {/* Wallet */}
        <Route path="/wallet" element={<WalletPage sub="solde" />} />
        <Route path="/wallet/mouvements" element={<WalletPage sub="mouvements" />} />
        <Route path="/wallet/rechargements" element={<WalletPage sub="rechargements" />} />
        <Route path="/wallet/debits" element={<WalletPage sub="debits" />} />

        {/* Résidents */}
        <Route path="/residents" element={<ResidentsPage sub="liste" />} />
        <Route path="/residents/refusees" element={<ResidentsPage sub="refusees" />} />
        <Route path="/residents/historique" element={<ResidentsPage sub="historique" />} />

        {/* Notifications */}
        <Route path="/notifications" element={<NotifsPage sub="envoyer" />} />
        <Route path="/notifications/sms" element={<NotifsPage sub="sms" />} />
        <Route path="/notifications/email" element={<NotifsPage sub="email" />} />
        <Route path="/notifications/push" element={<NotifsPage sub="push" />} />
        <Route path="/notifications/inapp" element={<NotifsPage sub="inapp" />} />
        <Route path="/notifications/historique" element={<NotifsPage sub="historique" />} />

        {/* Statistiques */}
        <Route path="/statistiques" element={<StatsPage sub="overview" />} />
        <Route path="/statistiques/billets" element={<StatsPage sub="billets" />} />
        <Route path="/statistiques/recettes" element={<StatsPage sub="recettes" />} />
        <Route path="/statistiques/occupation" element={<StatsPage sub="occupation" />} />
        <Route path="/statistiques/heures" element={<StatsPage sub="heures" />} />
        <Route path="/statistiques/categories" element={<StatsPage sub="categories" />} />
        <Route path="/statistiques/validation" element={<StatsPage sub="validation" />} />
        <Route path="/statistiques/paiements" element={<StatsPage sub="paiements" />} />

        {/* Rapports */}
        <Route path="/rapports" element={<RapportsPage sub="generer" />} />
        <Route path="/rapports/historique" element={<RapportsPage sub="historique" />} />

        {/* Paramètres */}
        <Route path="/parametres" element={<ParamsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
