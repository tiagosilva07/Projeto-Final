import { useEffect, useState } from "react";
import { useUserApi } from "@/services/users";
import { useAuth } from "@/hooks/useAuth";
import type { User, UpdateUserData, ChangePasswordData } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { getUserProfile, updateUserProfile, changePassword } = useUserApi();
  const { username: authenticatedUsername } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateUserData>({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Check if this is the authenticated user's profile
  const isOwnProfile = user?.username === authenticatedUsername;

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
        });
      } catch (err) {
        console.error("Failed to load user profile", err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSaveChanges() {
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updated = await updateUserProfile(formData);
      setUser(updated);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError("Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleChangePassword() {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await changePassword(passwordData);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordChange(false);
      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Failed to change password", err);
      setError("Failed to change password. Check your current password.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
    setIsEditing(false);
    setShowPasswordChange(false);
    setError(null);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!user) return <p>User not found.</p>;
  if (!isOwnProfile) return <p className="text-red-600">You can only edit your own profile.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        {!isEditing && !showPasswordChange && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md border border-green-200">
          {successMessage}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={user.username}
              readOnly
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Username cannot be changed
            </p>
          </div>

          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveChanges}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>

              <Separator />

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordChange(true)}
                >
                  Change Password
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Name</Label>
                <p className="text-sm font-medium">{user.name}</p>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Posts</span>
            <span className="font-semibold text-lg">{user.posts.length}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Comments</span>
            <span className="font-semibold text-lg">{user.comments.length}</span>
          </div>
        </CardContent>
      </Card>

      {showPasswordChange && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleChangePassword}
                disabled={submitting}
              >
                {submitting ? "Changing..." : "Change Password"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}