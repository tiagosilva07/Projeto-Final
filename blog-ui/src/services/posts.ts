import { useApiClient } from "@/hooks/useApiClient";
import type { Post } from "@/types/posts";
const API_URL = "http://localhost:8080/api"
;

export type CreatePostForm = CreatePostData & { imageFile: File | null; imagePreview: string; };

export type CreatePostData = {
  title: string;
  content: string;
  categoryIds: number[];
  imageUrl?: string;
  status?: "DRAFT" | "PUBLISHED";
}

export function usePostsApi() {
    const { safeApiFetch } = useApiClient();
    
    async function createPost(data: CreatePostData): Promise<Post> {
        return safeApiFetch(`${API_URL}/posts`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    }

    async function getMyPosts(): Promise<Post[]> {
        return safeApiFetch(`${API_URL}/posts/me`,{
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    }

    async function getPostById(id: number): Promise<Post> {
        return safeApiFetch(`${API_URL}/posts/${id}`,{
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    }

       async function getPostForEditById(id: number): Promise<Post> {
        return safeApiFetch(`${API_URL}/posts/${id}`,{
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    }

       async function deletePost(id: number): Promise<void> {
        return safeApiFetch(`${API_URL}/posts/${id}`,{
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
    }


    async function updatePost(id: number, data: CreatePostData): Promise<Post> {
        return safeApiFetch(`${API_URL}/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    }

    async function getPosts(): Promise<Post[]> {
        return safeApiFetch(`${API_URL}/posts`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    }

    return { createPost, getPosts, getMyPosts, getPostById, getPostForEditById, updatePost, deletePost };
}
