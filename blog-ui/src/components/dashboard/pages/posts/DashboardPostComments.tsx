import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { usePostsApi } from "@/services/posts";
import { useCommentsApi } from "@/services/comments";
import type { Post } from "@/types/posts";
import type { Comment } from "@/types/comment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPostComments() {
  const { id } = useParams();
  const { username } = useAuth();
  const { refreshPosts } = usePosts();
  const { getPostForEditById } = usePostsApi();
  const { getCommentsByPostId, deleteComment } = useCommentsApi();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);

  useEffect(() => {
    async function loadPostAndComments() {
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

      try {
        const [postData, commentData] = await Promise.all([
          getPostForEditById(postId),
          getCommentsByPostId(postId),
        ]);

        // Verify the post belongs to the authenticated user
        if (postData.username !== username) {
          setError("You don't have permission to view comments for this post.");
          setLoading(false);
          return;
        }

        setPost(postData);
        // Sort comments with newest first
        const sortedComments = commentData.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setComments(sortedComments);
      } catch (err) {
        console.error("Failed to load post or comments", err);
        setError("Failed to load post or comments.");
      } finally {
        setLoading(false);
      }
    }

    loadPostAndComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDeleteComment(commentId: number) {
    if (!id) return;
    
    const postId = Number(id);
    if (Number.isNaN(postId)) return;

    setDeleting(true);
    try {
      await deleteComment(postId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted successfully");
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      // Refresh posts to update comment counts in home page
      await refreshPosts();
    } catch (err) {
      console.error("Failed to delete comment", err);
      toast.error("Failed to delete comment");
    } finally {
      setDeleting(false);
    }
  }

  const handleDeleteClick = (comment: Comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  if (loading) return <p className="px-6 py-10">Loading...</p>;
  if (error) return <p className="px-6 py-10 text-red-600">{error}</p>;
  if (!post) return <p className="px-6 py-10">Post not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Comments</h1>
          <p className="text-muted-foreground mt-1">Post: {post.title}</p>
        </div>
        <Link to="/dashboard/posts">
          <Button variant="outline">Back to Posts</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>Status: {post.status === "PUBLISHED" ? <Badge className="bg-green-600">Published</Badge> : <Badge variant="outline" className="text-yellow-600 border-yellow-600">Draft</Badge>}</div>
            <div>Created: {new Date(post.createdAt).toLocaleDateString()}</div>
            <div>Total Comments: {comments.length}</div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
        
        {comments.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No comments yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="space-y-3 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                        {new Date(comment.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(comment)}
                      disabled={deleting}
                    >
                      Delete
                    </Button>
                  </div>
                  <Separator />
                  <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment from {commentToDelete?.author}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => commentToDelete && handleDeleteComment(commentToDelete.id)}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
