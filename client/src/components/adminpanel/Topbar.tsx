import { Search, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between p-6 bg-[#F2F2F2] shadow-sm">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>
    </div>
  );
}