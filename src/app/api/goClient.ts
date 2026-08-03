// Client de l'API Go (contrôleurs), volontairement désactivé : le dépôt
// Go-Goree-Controller-API est vide, aucun service n'écoute derrière. Le laisser
// actif ferait échouer des requêtes vers un hôte inexistant.
//
// Conservé commenté plutôt que supprimé pour garder l'intercepteur d'auth : le
// jour où ce service existera, il devra présenter le jeton dès le premier
// appel, et non être rebranché sans.
//
// import axios from "axios";
// import { getAuthToken } from "./laravelClient";
//
// export const goClient = axios.create({
//   baseURL: import.meta.env.VITE_API_GO_URL ?? "http://localhost:8080/api",
//   headers: { Accept: "application/json" },
// });
//
// goClient.interceptors.request.use((config) => {
//   const token = getAuthToken();
//   if (token) {
//     config.headers = config.headers ?? {};
//     (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
