import { useState, useEffect, type ReactNode, useCallback } from "react";
import { PostsContext } from "./posts.context";
import { usePostsApi } from "@/services/posts";
import type { Post } from "@/types/posts";

interface PostsProviderProps {
  children: ReactNode;
}

export function PostsProvider({ children }: PostsProviderProps) {
  const { getPosts } = usePostsApi();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [getPosts]);

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshPosts = useCallback(async () => {
    await loadPosts();
  }, [loadPosts]);

  const getPostById = useCallback((id: number): Post | undefined => {
    return posts.find(post => post.id === id);
  }, [posts]);

  return (
    <PostsContext.Provider value={{ posts, loading, error, refreshPosts, getPostById }}>
      {children}
    </PostsContext.Provider>
  );
}
