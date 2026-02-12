import { useState, useEffect } from "react";
import { useAdminApi } from "@/services/admin";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/user";
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
import { Badge } from "@/components/ui/badge";
import { Trash2, Shield, ShieldOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const { getAllUsers, deleteUser, promoteToAdmin, demoteToUser } = useAdminApi();
  const { username: currentUsername } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [changingRole, setChangingRole] = useState(false);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      await deleteUser(userToDelete.id);
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleRoleChangeClick = (user: User) => {
    setUserToChangeRole(user);
    setRoleDialogOpen(true);
  };

  const handleRoleChangeConfirm = async () => {
    if (!userToChangeRole) return;

    try {
      setChangingRole(true);
      const isCurrentlyAdmin = userToChangeRole.role === "ADMIN";
      
      if (isCurrentlyAdmin) {
        await demoteToUser(userToChangeRole.id);
        toast.success("User demoted to regular user");
      } else {
        await promoteToAdmin(userToChangeRole.id);
        toast.success("User promoted to admin");
      }
      
      setRoleDialogOpen(false);
      setUserToChangeRole(null);
      // Reload all users to reflect the change
      await loadUsers();
    } catch (error) {
      toast.error("Failed to change user role");
      console.error(error);
    } finally {
      setChangingRole(false);
    }
  };

  const isCurrentUser = (user: User) => user.username === currentUsername;

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
          <h2 className="text-2xl font-bold">Users Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage all users and their permissions ({users.length} total)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.username}
                    {isCurrentUser(user) && (
                      <span className="ml-2 text-xs text-blue-600">(You)</span>
                    )}
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === "ADMIN" ? (
                      <Badge className="bg-purple-600">Admin</Badge>
                    ) : (
                      <Badge variant="outline">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {Array.isArray(user.posts) ? user.posts.length : 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {Array.isArray(user.comments) ? user.comments.length : 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleChangeClick(user)}
                        disabled={isCurrentUser(user)}
                        title={
                          isCurrentUser(user)
                            ? "You cannot change your own role"
                            : user.role === "ADMIN"
                            ? "Demote to User"
                            : "Promote to Admin"
                        }
                      >
                        {user.role === "ADMIN" ? (
                          <ShieldOff className="w-4 h-4" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
                        disabled={isCurrentUser(user)}
                        title={
                          isCurrentUser(user)
                            ? "You cannot delete yourself"
                            : "Delete user"
                        }
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
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{userToDelete?.username}"? This action
              cannot be undone and will also delete all their posts and comments.
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

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              {userToChangeRole?.role === "ADMIN" ? (
                <>
                  Are you sure you want to demote "{userToChangeRole?.username}" to a regular
                  user? They will lose admin privileges and access to admin features.
                </>
              ) : (
                <>
                  Are you sure you want to promote "{userToChangeRole?.username}" to admin?
                  They will gain full access to admin features including user management,
                  posts, comments, and categories.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleDialogOpen(false)}
              disabled={changingRole}
            >
              Cancel
            </Button>
            <Button onClick={handleRoleChangeConfirm} disabled={changingRole}>
              {changingRole ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : userToChangeRole?.role === "ADMIN" ? (
                "Demote to User"
              ) : (
                "Promote to Admin"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
