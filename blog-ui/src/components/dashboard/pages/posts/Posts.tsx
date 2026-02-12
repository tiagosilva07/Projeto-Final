import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePostsApi } from "@/services/posts";
import { usePosts } from "@/hooks/usePosts";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Post } from "@/types/posts";

type SortOrder = "asc" | "desc" | null;

export default function Posts() {
  const { token } = useAuth();
  const { getMyPosts, deletePost } = usePostsApi();
  const { refreshPosts } = usePosts();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load posts", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  const toggleSort = () => {
    setSortOrder((prev) => {
      if (prev === null) return "desc";
      if (prev === "desc") return "asc";
      return "desc";
    });
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOrder === null) return 0;
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleDeleteClick = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      setDeleting(true);
      await deletePost(postToDelete.id);
      toast.success("Post deleted successfully");
      setPosts(posts.filter((p) => p.id !== postToDelete.id));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      await refreshPosts();
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>

        <Link to="/dashboard/posts/create">
          <Button>Create Post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">You have no posts yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={toggleSort}
                  className="h-8 px-2 -ml-2 cursor-pointer"
                >
                  Created
                  {sortOrder === null && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  {sortOrder === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                  {sortOrder === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
              <TableHead>Comments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedPosts.map((post) => (
              <TableRow 
                key={post.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/dashboard/posts/${post.id}/view`, { state: { from: '/dashboard/posts' } })}
              >
                <TableCell>
                  <Avatar className="h-15 w-32 ">
                    <AvatarImage
                      src={post.imageUrl || ""}
                      alt={post.title}
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      No Img
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                <TableCell className="font-medium">{post.title}</TableCell>

                <TableCell>
                  {post.status === "PUBLISHED" ? (
                    <Badge className="bg-green-600">Published</Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Draft
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">
                    {post.comments?.length || 0}
                  </Badge>
                </TableCell>

                <TableCell className="text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Link to={`/dashboard/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 cursor-pointer">
                      Edit
                    </Button>
                  </Link>

                  <Link to={`/dashboard/posts/${post.id}/comments`}>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 cursor-pointer">
                      Comments
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 cursor-pointer"
                    onClick={(e) => handleDeleteClick(post, e)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be
              undone and will also delete all associated comments.
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
              onClick={handleDeleteConfirm}
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
