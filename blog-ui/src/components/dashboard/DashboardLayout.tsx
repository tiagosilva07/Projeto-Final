import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <main className="flex-1 p-6 overflow-y-auto">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
