import { Hero } from "@/components/home/Hero"
import { PostsGrid } from "@/components/home/PostsGrid"
import Sidebar from "@/components/home/Sidebar"
import type { Category } from "@/types/categoy";
import { useState, useMemo } from "react";
import { usePosts } from "@/hooks/usePosts";

const POSTS_PER_PAGE = 9;

export default function Home() {
  const { posts, loading } = usePosts();
  const[selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Select the first post as featured
  const featuredPost = useMemo(() => {
    if (posts.length === 0) return null;
    return posts[0];
  }, [posts]);

  // Extract unique categories from posts (optimized)
  const categories = useMemo(() => {
    const categoryMap = new Map<number, Category>();
    for (const post of posts) {
      for (const category of post.categories) {
        categoryMap.set(category.id, category);
      }
    }
    return Array.from(categoryMap.values());
  }, [posts]);

  // Filter posts by selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategoryId === null) return posts;
    return posts.filter(post => 
      post.categories.some(cat => cat.id === selectedCategoryId)
    );
  }, [posts, selectedCategoryId]);

  // Paginate filtered posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Get trending posts (most comments) - cached and limited
  const trendingPosts = useMemo(() => {
    return posts
      .map(post => ({
        ...post,
        commentCount: Array.isArray(post.comments) ? post.comments.length : 0
      }))
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 5);
  }, [posts]);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleResetFilter = () => {
    setSelectedCategoryId(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedPost = featuredPost;

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-10">

      {selectedPost ? (
        <Hero
          title={selectedPost.title}
          content={selectedPost.content}
          image={selectedPost.imageUrl || "https://picsum.photos/1200/500"}
          link={`/posts/${selectedPost.id}`}
          state={{ post: selectedPost }}
        />
      ) : (
        <Hero
          title="Featured Post"
          content="A deep dive into building a modern blog with React, shadcn, Tailwind and Spring Boot."
          image="https://picsum.photos/1200/500"
          link="/posts/featured"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3">
          <PostsGrid 
            posts={paginatedPosts}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        <Sidebar 
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
          onResetFilter={handleResetFilter}
          trendingPosts={trendingPosts}
        />
      </div>
    </div>
  )
}
