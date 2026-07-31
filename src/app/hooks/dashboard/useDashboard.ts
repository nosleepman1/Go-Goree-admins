import { useQuery } from "@tanstack/react-query";
import { listVoyages } from "../../services/voyages/voyagesService";
import { listPaiements } from "../../services/paiements/paiementsService";
import { getDashboardMetrics } from "../../services/analytics/analyticsService";

export interface DashboardData {
  ticketData: any;
  monthlyData: any;
  pieData: any;
  voyages: any;
  transactions: any;
  overview?: any;
}

/**
 * Données du tableau de bord — 100 % issues de l'API.
 *
 * Aucun repli sur des données de démonstration : si une requête échoue, les
 * séries restent vides et `isError` remonte pour que la page affiche l'état
 * d'erreur. Afficher des chiffres inventés sous un bandeau d'avertissement
 * revient à laisser croire à un tableau de bord fonctionnel.
 */
export function useDashboard() {
  const voyagesQ = useQuery({
    queryKey: ["voyages"],
    queryFn: listVoyages,
  });

  const transactionsQ = useQuery({
    queryKey: ["paiements"],
    queryFn: listPaiements,
  });

  const analyticsQ = useQuery({
    queryKey: ["dashboard", "analytics"],
    queryFn: getDashboardMetrics,
    staleTime: 60000,
  });

  const isLoading =
    voyagesQ.isLoading ||
    transactionsQ.isLoading ||
    analyticsQ.isLoading;

  const isError =
    voyagesQ.isError ||
    transactionsQ.isError ||
    analyticsQ.isError;

  const metrics = analyticsQ.data || {};

  const data: DashboardData = {
    ticketData: metrics.weekly_distribution ?? [],
    monthlyData: metrics.monthly_data ?? [],
    pieData: metrics.visitor_categories ?? [],
    voyages: voyagesQ.data ?? [],
    transactions: (transactionsQ.data ?? []).slice(0, 10), // only recent transactions on dashboard
    overview: metrics.overview || {},
  };

  return { ...data, isLoading, isError };
}
