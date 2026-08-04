import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setTokenGetter, setUnauthorizedHandler } from "../api/laravelClient";

import { laravelClient } from "../api/laravelClient";

export interface AuthUser {
  id?: string;
  nom?: string;
  email?: string;
  role?: string;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      login: async (email, password) => {
        if (!email || !password) throw new Error("Champs manquants");
        
        const response = await laravelClient.post("/v1/login", {
          email: email,
          mot_de_passe: password,
        });
        
        const { access_token, user } = response.data;

        // Ce panel n'est ouvert qu'aux administrateurs : le rôle Agent n'a de
        // toute façon accès à presque aucune route côté backend (routes/api/v1/*.php).
        if (user.role?.nom !== "Admin") {
          throw new Error("ACCESS_DENIED");
        }
        const normalizedRole = "admin";

        set({
          token: access_token,
          user: {
            id: user.id,
            nom: `${user.prenom} ${user.nom}`,
            email: user.email,
            role: normalizedRole,
          },
          isLoggedIn: true,
        });
      },
      logout: () => {
        set({ token: null, user: null, isLoggedIn: false });
      },
    }),
    { name: "gg-auth" }
  )
);

setTokenGetter(() => useAuthStore.getState().token);
setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});
