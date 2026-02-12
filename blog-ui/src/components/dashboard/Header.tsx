import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, LogOut, Shield } from "lucide-react";

export default function Header() {
  const { username, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Overview";
    if (path === "/dashboard/admin") return "Admin Overview";
    if (path === "/dashboard/admin/posts") return "All Posts Management";
    if (path === "/dashboard/admin/comments") return "All Comments Management";
    if (path === "/dashboard/admin/categories") return "Categories Management";
    if (path.includes("/dashboard/posts/create")) return "Create Post";
    if (path.includes("/dashboard/posts/edit")) return "Edit Post";
    if (path.includes("/dashboard/posts")) return "My Posts";
    if (path.includes("/dashboard/profile")) return "Profile";
    return "Dashboard";
  };



  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 mb-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
            {isAdmin && (
              <Badge variant="default" className="bg-purple-600">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {username || "User"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoHome}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>


          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
