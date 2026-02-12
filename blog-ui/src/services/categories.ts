import { useApiClient } from "@/hooks/useApiClient";
import type { Category } from "@/types/categoy";

export function useCategoriesApi() {
      const { safeApiFetch } = useApiClient();
  
  async function getCategories(): Promise<Category[]> {
    return safeApiFetch("http://localhost:8080/api/categories", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }
  return { getCategories };
}

