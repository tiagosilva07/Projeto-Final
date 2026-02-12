import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import type { Category } from "@/types/categoy"
import type { Post } from "@/types/posts"
import { memo } from "react"

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number) => void;
  onResetFilter: () => void;
  trendingPosts: Post[];
}

const Sidebar = memo(function Sidebar({ 
  categories, 
  selectedCategoryId, 
  onCategorySelect,
  onResetFilter,
  trendingPosts 
}: SidebarProps) {
  return (
    <aside className="space-y-8">

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold">Categories</h3>
          {selectedCategoryId !== null && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onResetFilter}
              className="text-xs"
            >
              Reset
            </Button>
          )}
        </div>
        <Separator className="mb-3" />

        <div className="flex flex-col gap-2">
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={
                  selectedCategoryId === category.id
                    ? "text-left px-3 py-2 rounded-md bg-primary/10 text-primary font-medium transition-colors"
                    : "text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                }
              >
                {category.name}
              </button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No categories available</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Trending</h3>
        <Separator className="mb-3" />

        <div className="flex flex-col gap-3">
          {trendingPosts.length > 0 ? (
            trendingPosts.map((post) => {
              const commentCount = Array.isArray(post.comments) ? post.comments.length : 0;
              return (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  state={{ post }}
                  className="group"
                >
                  <div className="hover:bg-muted p-2 rounded-md transition-colors">
                    <p className="text-sm font-medium group-hover:text-primary line-clamp-2">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No trending posts yet</p>
          )}
        </div>
      </div>

    </aside>
  )
});

export default Sidebar;
