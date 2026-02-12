import { useApiClient } from "@/hooks/useApiClient";
import type { Post } from "@/types/posts";
import type { Comment } from "@/types/comment";
import type { User } from "@/types/user";
import type { AdminOverview } from "@/types/AdminOverview";
import type { Category } from "@/types/categoy";

const API_URL = "http://localhost:8080/api";

export function useAdminApi() {
  const { safeApiFetch } = useApiClient();

  // ===== Posts Management =====
  async function getAllPosts(): Promise<Post[]> {
    return safeApiFetch(`${API_URL}/posts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  async function deleteAnyPost(postId: number): Promise<void> {
    return safeApiFetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }

  async function updateAnyPost(postId: number, data: {
    title: string;
    content: string;
    categoryIds: number[];
    imageUrl?: string;
    status?: "DRAFT" | "PUBLISHED";
  }): Promise<Post> {
    return safeApiFetch(`${API_URL}/admin/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  // ===== Comments Management =====
  async function getAllComments(): Promise<Comment[]> {
    return safeApiFetch(`${API_URL}/comments`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  async function deleteAnyComment(commentId: number): Promise<void> {
    return safeApiFetch(`${API_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }

  async function updateAnyComment(commentId: number, content: string): Promise<Comment> {
    return safeApiFetch(`${API_URL}/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  }

  // ===== Users Management =====
  async function getAllUsers(): Promise<User[]> {
    return safeApiFetch(`${API_URL}/admin/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  async function deleteUser(userId: number): Promise<void> {
    return safeApiFetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }

  async function promoteToAdmin(userId: number): Promise<User> {
    return safeApiFetch(`${API_URL}/admin/users/${userId}/promote`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
  }

  async function demoteToUser(userId: number): Promise<User> {
    return safeApiFetch(`${API_URL}/admin/users/${userId}/demote`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
  }

  // ===== Statistics =====
  async function getAdminStats(): Promise<AdminOverview> {
    return safeApiFetch(`${API_URL}/admin/overview`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  // ===== Categories Management =====
  async function getAllCategories(): Promise<Category[]> {
    return safeApiFetch(`${API_URL}/categories`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  async function createCategory(data: { name: string; description: string }): Promise<Category> {
    return safeApiFetch(`${API_URL}/admin/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function updateCategory(categoryId: number, data: { name: string; description: string }): Promise<Category> {
    return safeApiFetch(`${API_URL}/admin/categories/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function deleteCategory(categoryId: number): Promise<void> {
    return safeApiFetch(`${API_URL}/categories/${categoryId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }

  return {
    getAllPosts,
    deleteAnyPost,
    updateAnyPost,
    getAllComments,
    deleteAnyComment,
    updateAnyComment,
    getAllUsers,
    deleteUser,
    promoteToAdmin,
    demoteToUser,
    getAdminStats,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
