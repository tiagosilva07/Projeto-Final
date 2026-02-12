import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

export default function SideBar() {
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-md ${
      pathname === path ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <nav className="space-y-2">
        <Link className={linkClass("/dashboard")} to="/dashboard">Overview</Link>
        <Link className={linkClass("/dashboard/posts")} to="/dashboard/posts">Posts</Link>
        <Link className={linkClass("/dashboard/profile")} to="/dashboard/profile">Profile</Link>

        {isAdmin && (
          <>
            <Separator className="my-4" />
            <div className="px-4 py-2 flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">Admin</span>
            </div>
            <Link className={linkClass("/dashboard/admin")} to="/dashboard/admin">
              Admin Overview
            </Link>
            <Link className={linkClass("/dashboard/admin/posts")} to="/dashboard/admin/posts">
              All Posts
            </Link>
            <Link className={linkClass("/dashboard/admin/comments")} to="/dashboard/admin/comments">
              All Comments
            </Link>
            <Link className={linkClass("/dashboard/admin/categories")} to="/dashboard/admin/categories">
              All Categories
            </Link>
            <Link className={linkClass("/dashboard/admin/users")} to="/dashboard/admin/users">
              All Users
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
