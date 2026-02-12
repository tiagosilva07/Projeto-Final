import { useApiClient } from "@/hooks/useApiClient";
import type { Comment } from "@/types/comment";

const API_URL = "http://localhost:8080/api";

export type CreateCommentData = {
  content: string;
};

export function useCommentsApi() {
  const { safeApiFetch } = useApiClient();

  async function createComment(postId: number, data: CreateCommentData): Promise<Comment> {
    return safeApiFetch(`${API_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function updateComment(
    postId: number,
    commentId: number,
    data: CreateCommentData
  ): Promise<Comment> {
    return safeApiFetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function deleteComment(postId: number, commentId: number): Promise<void> {
    return safeApiFetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }

  async function getCommentsByPostId(postId: number): Promise<Comment[]> {
    return safeApiFetch(`${API_URL}/posts/${postId}/comments`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  return { createComment, updateComment, deleteComment, getCommentsByPostId };
}
