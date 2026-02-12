import { useState, useEffect } from "react";
import { useAdminApi } from "@/services/admin";
import { usePosts } from "@/hooks/usePosts";
import type { Comment } from "@/types/comment";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function AdminComments() {
  const { getAllComments, deleteAnyComment, updateAnyComment } = useAdminApi();
  const { refreshPosts } = usePosts();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [commentToEdit, setCommentToEdit] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getAllComments();
      setComments(data);
    } catch (error) {
      toast.error("Failed to load comments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (comment: Comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    try {
      setDeleting(true);
      await deleteAnyComment(commentToDelete.id);
      toast.success("Comment deleted successfully");
      setComments(comments.filter((c) => c.id !== commentToDelete.id));
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      // Refresh posts context to update comment counts
      await refreshPosts();
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (comment: Comment) => {
    setCommentToEdit(comment);
    setEditContent(comment.comment);
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!commentToEdit || !editContent.trim()) return;

    try {
      setUpdating(true);
      const updated = await updateAnyComment(commentToEdit.id, editContent);
      toast.success("Comment updated successfully");
      setComments(comments.map((c) => (c.id === updated.id ? updated : c)));
      setEditDialogOpen(false);
      setCommentToEdit(null);
      setEditContent("");
    } catch (error) {
      toast.error("Failed to update comment");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>

          <p className="text-sm text-gray-600 mt-1">
            Manage all comments from all users ({comments.length} total)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Post Id</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No comments found
                </TableCell>
              </TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2">{comment.comment}</p>
                  </TableCell>
                  <TableCell>{comment.author}</TableCell>
                  <TableCell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{comment.postId || "N/A"}</TableCell>
                  <TableCell><Badge variant="default">{comment.postStatus || "N/A"}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(comment)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(comment)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>
              Update the comment content below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              placeholder="Enter comment content..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditConfirm}
              disabled={updating || !editContent.trim()}
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
