import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useAuthStore } from "../store/authStore";

// Associer Pusher à l'objet window pour Laravel Echo
(window as any).Pusher = Pusher;

let echoInstance: Echo | null = null;

export function getEcho(): Echo {
  if (echoInstance) return echoInstance;

  const appKey = import.meta.env.VITE_REVERB_APP_KEY ?? "reverbkey123";
  const host = import.meta.env.VITE_REVERB_HOST ?? "localhost";
  const port = import.meta.env.VITE_REVERB_PORT ?? "8080";
  const scheme = import.meta.env.VITE_REVERB_SCHEME ?? "http";
  const apiHost = import.meta.env.VITE_API_LARAVEL_URL ?? "http://localhost:8000/api";
  const baseURL = apiHost.replace(/\/api$/, "");

  // Configuration Reverb WebSocket
  echoInstance = new Echo({
    broadcaster: "reverb",
    key: appKey,
    wsHost: host,
    wsPort: parseInt(port),
    wssPort: parseInt(port),
    forceTLS: scheme === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${baseURL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
        // Même raison que dans laravelClient : si l'API est jointe via un
        // tunnel ngrok, sa page d'avertissement répondrait à la place de
        // Laravel et l'authentification du canal privé échouerait.
        "ngrok-skip-browser-warning": "true",
      },
    },
  });

  return echoInstance;
}

export function resetEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}
