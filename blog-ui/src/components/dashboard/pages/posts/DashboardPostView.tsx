import { useNavigate, useLocation } from "react-router-dom";
import PostView from "@/components/home/PostView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DashboardPostView() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard/posts";

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={() => navigate(from)}
        className="cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Posts
      </Button>
      <PostView hideHomeNav={true} />
    </div>
  );
}
