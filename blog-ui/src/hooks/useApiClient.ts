// useApiClient.ts
import { useAuth } from "./useAuth";
import { apiFetch } from "@/services/client";

const API_URL = "http://localhost:8080/api";

export function useApiClient() {
  const { token, refreshToken, login, logout } = useAuth();

  async function safeApiFetch(url: string, options?: RequestInit) {
    try {
      return await apiFetch(url, token, options);
    } catch (err: any) {
      if (err.message === "Unauthorized" && refreshToken) {
        // Try refreshing
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
          logout();
          throw err;
        }

        const data = await res.json(); // { accessToken, refreshToken, username }
        login(data.accessToken, data.refreshToken, data.username);

        // Retry original request with new token
        return await apiFetch(url, data.accessToken, options);
      }

      throw err;
    }
  }

  return { safeApiFetch };
}
