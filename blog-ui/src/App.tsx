import { Route, Routes } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import PostViewPage from "@/pages/PostView";
import { Footer } from "./components/Footer";
import Overview from "./components/dashboard/pages/Overview";
import Posts from "./components/dashboard/pages/posts/Posts";
import Profile from "./components/dashboard/pages/Profile";
import CreatePost from "./components/dashboard/pages/posts/CreatePosts";
import EditPost from "./components/dashboard/pages/posts/EditPost";
import DashboardPostComments from "./components/dashboard/pages/posts/DashboardPostComments";
import DashboardPostView from "./components/dashboard/pages/posts/DashboardPostView";
import AdminOverview from "./components/dashboard/pages/admin/AdminOverview";
import AdminPosts from "./components/dashboard/pages/admin/AdminPosts";
import AdminComments from "./components/dashboard/pages/admin/AdminComments";
import AdminCategories from "./components/dashboard/pages/admin/AdminCategories";
import AdminUsers from "./components/dashboard/pages/admin/AdminUsers";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/posts/:id" element={<PostViewPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/create" element={<CreatePost />} />
          <Route path="/dashboard/posts/:id/view" element={<DashboardPostView />} />
          <Route path="/dashboard/posts/:id/edit" element={<EditPost />} />
          <Route path="/dashboard/posts/:id/comments" element={<DashboardPostComments />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route 
            path="admin" 
            element={
              <AdminRoute>
                <AdminOverview />
              </AdminRoute>
            } 
          />
          <Route 
            path="admin/posts" 
            element={
              <AdminRoute>
                <AdminPosts />
              </AdminRoute>
            } 
          />
          <Route 
            path="admin/comments" 
            element={
              <AdminRoute>
                <AdminComments />
              </AdminRoute>
            } 
          />
          <Route 
            path="admin/categories" 
            element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            } 
          />
          <Route 
            path="admin/users" 
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } 
          />
        </Route>
      </Routes>
      <Footer />
         </> 
  );
}

export default App;
