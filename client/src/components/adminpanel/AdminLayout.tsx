import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Dynamic Page Content */}
        <div className="flex-1 min-w-0 p-4 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}