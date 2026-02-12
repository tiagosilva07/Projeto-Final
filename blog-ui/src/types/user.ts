import type { Post } from "./posts";
import type { Comment } from "./comment";

export type User = {
  id: number;
  personId: number;
  username: string;
  name: string;
  email: string;
  role?: string;
  posts: Post[];
  comments: Comment[];
};

export type UpdateUserData = {
  name: string;
  email: string;
};

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
