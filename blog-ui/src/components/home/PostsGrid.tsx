import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import type { Post } from "@/types/posts"
import { memo } from "react"

interface PostsGridProps {
  posts: Post[]
  loading?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

// Memoized PostCard component to prevent unnecessary re-renders
const PostCard = memo(({ post }: { post: Post }) => (
  <Link
    to={`/posts/${post.id}`}
    key={post.id}
    state={{ post }}
    className="block h-full"
  >
    <Card className="h-full flex flex-col hover:shadow-xl transition-shadow">
      <img
        src={post.imageUrl || "https://via.placeholder.com/400x200?text=No+Image"}
        alt={post.title}
        className="w-full h-40 object-cover rounded-t-lg"
        loading="lazy"
      />

      <CardHeader>
        <CardTitle className="line-clamp-2 p-2">{post.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {post.content}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto flex items-center justify-between gap-3">
        <Badge>{post.categories.map(category => category.name).join(", ")}</Badge>
        <div className="text-right text-xs text-muted-foreground leading-5">
          <span className="block">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="block">
            {post.username}
          </span>
        </div>
      </CardContent>
    </Card>
  </Link>
));

PostCard.displayName = 'PostCard';

export const PostsGrid = memo(function PostsGrid({ 
  posts, 
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange 
}: PostsGridProps) {

  if(loading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Latest Posts</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-full flex flex-col animate-pulse">
              <div className="w-full h-40 bg-gray-200 rounded-t-lg" />
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if(posts.length === 0) {
    return (
      <section className="text-center py-20">
        <h2 className="text-3xl font-semibold mb-4">No Posts Available</h2>
        <p className="text-lg text-gray-600">Check back later for new content!</p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Latest Posts</h2>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => onPageChange(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  )
});
