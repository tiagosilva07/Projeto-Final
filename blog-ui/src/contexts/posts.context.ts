import { createContext } from "react";
import type { Post } from "@/types/posts";

export interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  getPostById: (id: number) => Post | undefined;
}

export const PostsContext = createContext<PostsContextType | undefined>(undefined);
