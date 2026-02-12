import type { Category } from "./categoy"
import type { Comment } from "./comment"

export type Post = {
  id: number
  title: string
  content: string
  username: string
  createdAt: string
  updatedAt: string
  categories: Category[]
  imageUrl?: string
  status: "DRAFT" | "PUBLISHED"
  comments?: Comment[]
}
