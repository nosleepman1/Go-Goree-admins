import axios from "axios";

let tokenGetter: () => string | null = () => localStorage.getItem("gg_token");
export function setTokenGetter(fn: () => string | null) {
  tokenGetter = fn;
}
export function getAuthToken(): string | null {
  return tokenGetter();
}

export const laravelClient = axios.create({
  baseURL: import.meta.env.VITE_API_LARAVEL_URL ?? "http://localhost:8000/api",
  headers: { Accept: "application/json" },
});

laravelClient.interceptors.request.use((config) => {
  const token = tokenGetter();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

let unauthorizedHandler: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  unauthorizedHandler = fn;
}

laravelClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("gg_token");
      if (unauthorizedHandler) unauthorizedHandler();
      else window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

