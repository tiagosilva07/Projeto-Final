import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { usePostsApi } from "@/services/posts";
import { useCommentsApi } from "@/services/comments";
import { useAdminApi } from "@/services/admin";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import type { Post } from "@/types/posts";
import type { Comment } from "@/types/comment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function PostView({ hideHomeNav = false }: { hideHomeNav?: boolean }) {
  const { id } = useParams();
  const location = useLocation();
  const { username, isAuthenticated, isAdmin } = useAuth();
  const { getPostById: getPostByIdContext, refreshPosts } = usePosts();
  const { getPostById } = usePostsApi();
  const { createComment, updateComment, deleteComment, getCommentsByPostId } = useCommentsApi();
  const { deleteAnyComment } = useAdminApi();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    async function loadPost() {
      if (!id) {
        setError("Missing post id.");
        setLoading(false);
        return;
      }

      const postId = Number(id);
      if (Number.isNaN(postId)) {
        setError("Invalid post id.");
        setLoading(false);
        return;
      }

      // Try to get post from context first
      const contextPost = getPostByIdContext(postId);
      if (contextPost) {
        setPost(contextPost);
        setLoading(false);
        return;
      }

      // Fall back to location state
      const statePost = (location.state as { post?: Post } | null)?.post;
      if (statePost) {
        setPost(statePost);
        setLoading(false);
        return;
      }

      // Finally, fetch from API
      try {
        const data = await getPostById(postId);
        setPost(data);
      } catch (err) {
        console.error("Failed to load post", err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id, getPostById, getPostByIdContext, location.state]);

  // Load comments
  useEffect(() => {
    async function loadComments() {
      if (!id) return;
      const postId = Number(id);
      if (Number.isNaN(postId)) return;

      try {
        const data = await getCommentsByPostId(postId);
        // Sort comments with newest first
        const sortedComments = data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setComments(sortedComments);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    }

    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleCreateComment() {
    if (!id) return;
    const postId = Number(id);
    if (Number.isNaN(postId)) return;

    // Validation
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    if (newComment.trim().length < 3) {
      setCommentError("Comment must be at least 3 characters");
      return;
    }

    if (newComment.trim().length > 500) {
      setCommentError("Comment must not exceed 500 characters");
      return;
    }

    setSubmitting(true);
    setCommentError("");
    
    try {
      const comment = await createComment(postId, { content: newComment });
      setComments((prev) => {
        const updated = [...prev, comment];
        // Sort with newest first
        return updated.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setNewComment("");
      toast.success("Comment posted successfully!");
      // Refresh posts to update comment counts in home page
      await refreshPosts();
    } catch (err) {
      console.error("Failed to create comment", err);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateComment(commentId: number) {
    if (!id) return;
    const postId = Number(id);
    if (Number.isNaN(postId)) return;

    // Validation
    if (!editCommentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (editCommentContent.trim().length < 3) {
      toast.error("Comment must be at least 3 characters");
      return;
    }

    if (editCommentContent.trim().length > 500) {
      toast.error("Comment must not exceed 500 characters");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await updateComment(postId, commentId, { content: editCommentContent });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updated : c))
          .sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      );
      setEditingCommentId(null);
      setEditCommentContent("");
      toast.success("Comment updated successfully!");
      // Refresh posts to update comment data in home page
      await refreshPosts();
    } catch (err) {
      console.error("Failed to update comment", err);
      toast.error("Failed to update comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      if (isAdmin) {
        // Admin can delete any comment using admin API
        await deleteAnyComment(commentId);
      } else {
        // Regular users delete their own comments
        if (!id) return;
        const postId = Number(id);
        if (Number.isNaN(postId)) return;
        await deleteComment(postId, commentId);
      }
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted successfully!");
      // Refresh posts to update comment counts in home page
      await refreshPosts();
    } catch (err) {
      console.error("Failed to delete comment", err);
      toast.error("Failed to delete comment. Please try again.");
    }
  }

  function startEditComment(comment: Comment) {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.comment);
  }

  function cancelEdit() {
    setEditingCommentId(null);
    setEditCommentContent("");
  }

  if (loading) return <p className="px-6 py-10">Loading...</p>;
  if (error) return <p className="px-6 py-10 text-red-600">{error}</p>;
  if (!post) return <p className="px-6 py-10">Post not found.</p>;

  return (
    <article className="px-6 py-10 max-w-5xl mx-auto space-y-10">
      {!hideHomeNav && (
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
          <Button variant="outline" asChild>
            <Link to="/">All Posts</Link>
          </Button>
        </div>
      )}

      <section className="relative overflow-hidden rounded-2xl border shadow-sm">
        <img
          src={post.imageUrl || "https://picsum.photos/1200/600"}
          alt={post.title}
          className="h-[360px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-0 p-8 text-white">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.length > 0 ? (
              post.categories.map((category) => (
                <Badge key={category.id} className="bg-white/20 text-white">
                  {category.name}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="border-white/50 text-white">
                Uncategorized
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-semibold leading-tight">{post.title}</h1>
          <div className="mt-3 text-sm text-white/80 flex flex-wrap gap-3">
            <span>By {post.username}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1fr_260px]">
        <div className="space-y-6">
          <Separator />
          <div className="prose max-w-none whitespace-pre-line">
            {post.content}
          </div>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>Author: {post.username}</div>
              <div>Published: {new Date(post.createdAt).toLocaleDateString()}</div>
              <div>Updated: {new Date(post.updatedAt).toLocaleDateString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {post.categories.length > 0 ? (
                post.categories.map((category) => (
                  <Badge key={category.id} variant="outline">
                    {category.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No categories</span>
              )}
            </CardContent>
          </Card>
        </aside>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Comments ({comments.length})</h2>
        
        {isAuthenticated && (
          <Card>
            <CardContent className="pt-6">
              <Textarea
                placeholder="Write a comment (3-500 characters)..."
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  setCommentError("");
                }}
                className="mb-2"
              />
              {commentError && (
                <p className="text-red-500 text-sm mb-2">{commentError}</p>
              )}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">
                  {newComment.length}/500 characters
                </p>
              </div>
              <Button
                onClick={handleCreateComment}
                disabled={submitting}
              >
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </CardContent>
          </Card>
        )}

        {!isAuthenticated && (
          <p className="text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>{" "}
            to post a comment.
          </p>
        )}

        {comments.length === 0 ? (
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const isOwner = username === comment.author;
              const canDelete = isOwner || isAdmin;
              const isEditing = editingCommentId === comment.id;

              return (
                <Card key={comment.id}>
                  <CardContent className="space-y-3 py-5">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="font-medium">{comment.author}</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()} at{" "}
                        {new Date(comment.createdAt).toLocaleTimeString()}</span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editCommentContent}
                          onChange={(e) => setEditCommentContent(e.target.value)}
                          placeholder="Edit your comment (3-500 characters)..."
                        />
                        <p className="text-xs text-muted-foreground">
                          {editCommentContent.length}/500 characters
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateComment(comment.id)}
                            disabled={submitting}
                          >
                            {submitting ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={submitting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p>{comment.comment}</p>
                        {(isOwner || isAdmin) && (
                          <div className="flex gap-2 pt-2">
                            {isOwner && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditComment(comment)}
                              >
                                Edit
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                {isAdmin && !isOwner ? "Delete (Admin)" : "Delete"}
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </article>
  );
}
