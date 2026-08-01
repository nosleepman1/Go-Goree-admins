import { laravelClient } from "../../api/laravelClient";
import type { Voyage } from "../../types/voyages";

/** Ajoute une durée en minutes à une heure "HH:MM" — "14:00" + 20 → "14:20". */
function ajouterMinutes(heure: string, minutes: number): string {
  const [h, m] = heure.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function mapVoyage(backendVoyage: any): Voyage {
  const trajet = backendVoyage.trajet || {};
  const chaloupe = backendVoyage.chaloupe || {};
  const capacity = Number(backendVoyage.places ?? chaloupe.capacite ?? 0);

  // `billets_vendus` (billets payés ou scannés) vient de l'API ; les places
  // restantes ne servent de repli que si le champ est absent.
  const sold = backendVoyage.billets_vendus != null
    ? Number(backendVoyage.billets_vendus)
    : capacity - Number(backendVoyage.places_restantes || 0);

  const isPast = new Date(backendVoyage.date_voyage) < new Date(new Date().toDateString());
  const statut = isPast ? "Terminé" : (sold > 0 ? "En cours" : "Prévu");

  // Recette réelle = somme des montants encaissés, calculée par l'API.
  const recette = backendVoyage.recette != null
    ? `${Number(backendVoyage.recette).toLocaleString("fr-FR")} FCFA`
    : "—";

  const heureDepart = trajet.heure_depart ? String(trajet.heure_depart).slice(0, 5) : "";
  const duree = Number(trajet.duree);

  return {
    id: backendVoyage.id,
    // La liaison ne dessert que Dakar ↔ Gorée : le trajet ne porte pas
    // d'origine/destination, ces libellés sont ceux de la ligne.
    depart: "Dakar",
    arrivee: "Gorée",
    chaloupe: chaloupe.nom || "—",
    places: capacity,
    vendus: sold,
    statut: statut,
    recette: recette,
    date_voyage: backendVoyage.date_voyage,
    heure_depart: heureDepart,
    heure_arrivee: heureDepart && !Number.isNaN(duree) ? ajouterMinutes(heureDepart, duree) : "",
    jour: trajet.jour,
  };
}

/** @param periode "today" pour ne charger que les voyages du jour. */
export async function listVoyages(periode?: "today" | "semaine"): Promise<Voyage[]> {
  const response = await laravelClient.get("/v1/voyages", { params: periode ? { periode } : undefined });
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapVoyage);
}

export async function listVoyagesDuJour(): Promise<Voyage[]> {
  return listVoyages("today");
}

export async function getVoyage(id: string): Promise<Voyage> {
  const response = await laravelClient.get(`/v1/voyages/${id}`);
  const item = response.data.data || response.data;
  return mapVoyage(item);
}

export async function createVoyage(payload: Partial<Voyage>): Promise<Voyage> {
  // Map back to backend fields
  // payload.chaloupe will be mapped to chaloupe_id by matching name or ID
  const response = await laravelClient.post("/v1/voyages", payload);
  const item = response.data.data || response.data;
  return mapVoyage(item);
}

export async function updateVoyage(id: string, payload: Partial<Voyage>): Promise<Voyage> {
  const response = await laravelClient.put(`/v1/voyages/${id}`, payload);
  const item = response.data.data || response.data;
  return mapVoyage(item);
}

export async function deleteVoyage(id: string): Promise<void> {
  await laravelClient.delete(`/v1/voyages/${id}`);
}

export async function getVoyagesDuJour(): Promise<Voyage[]> {
  const list = await listVoyages();
  return list.filter((v) => v.statut === "En cours" || v.statut === "Prévu");
}

export async function getVoyagesHistorique(): Promise<Voyage[]> {
  const list = await listVoyages();
  return list.filter((v) => v.statut === "Terminé");
}

export async function genererVoyagesManuellement(): Promise<string> {
  const response = await laravelClient.post("/v1/voyages/generer");
  return response.data.message || "Génération réussie.";
}
