import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app/App.tsx";
import "./styles/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // Pas de retry sur erreur réseau
      // Réglage hérité de l'époque des données de démonstration : avec
      // staleTime: Infinity, l'admin n'allait plus jamais rechercher les
      // données réelles, même en changeant de page. 30 s garde l'écran vivant
      // sans marteler l'API.
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);