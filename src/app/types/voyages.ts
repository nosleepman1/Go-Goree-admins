export interface Voyage {
  id: string;
  depart: string;
  arrivee: string;
  chaloupe: string;
  places: number;
  vendus: number;
  statut: string;
  recette: string;
  date_voyage?: string;
  heure_depart?: string;
  heure_arrivee?: string;
  jour?: string;
}
