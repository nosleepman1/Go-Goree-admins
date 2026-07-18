import axios from "axios";
import { getAuthToken } from "./laravelClient";

export const goClient = axios.create({
  baseURL: import.meta.env.VITE_API_GO_URL ?? "http://localhost:8080/api",
  headers: { Accept: "application/json" },
});

goClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});
