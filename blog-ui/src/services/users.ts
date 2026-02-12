import { useApiClient } from "@/hooks/useApiClient";
import type { User, UpdateUserData, ChangePasswordData } from "@/types/user";

const API_URL = "http://localhost:8080/api";

export function useUserApi() {
  const { safeApiFetch } = useApiClient();

  async function getUserProfile(): Promise<User> {
    return safeApiFetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  async function updateUserProfile(data: UpdateUserData): Promise<User> {
    return safeApiFetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return safeApiFetch(`${API_URL}/users/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    });
  }

  return { getUserProfile, updateUserProfile, changePassword };
}
