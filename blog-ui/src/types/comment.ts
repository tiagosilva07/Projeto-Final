
export type Comment = {
  id: number;
  comment: string;
  author: string;
  authorId: number;
  postId?: number;
  createdAt: string;
  updatedAt: string;
  postStatus?: "DRAFT" | "PUBLISHED";
}
