import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
  Network,
  Building2,
  CalendarDays,
  UserPlus,
  FileText,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin-dashboard",
      end: true,
    },
    {
      name: "Members",
      icon: Users,
      path: "/admin-dashboard/members",
    },
    {
      name: "Add Member",
      icon: UserPlus,
      path: "/admin-dashboard/add-member",
    },
    {
      name: "Drafts",
      icon: FileText,
      path: "/admin-dashboard/drafts",
    },
    {
      name: "Events",
      icon: CalendarDays,
      path: "/admin-dashboard/events",
    },
    {
      name: "Organization",
      icon: Building2,
      path: "/admin-dashboard/organization",
    },
    {
      name: "Coordinators",
      icon: Network,
      path: "/admin-dashboard/coordinators",
    },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-[#0B0F2F] text-white min-h-screen flex flex-col shadow-xl transition-all duration-300`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="/public/images/logo.webp"
            alt="SRP Logo"
            className="h-10 w-10 object-contain"
          />

          {!collapsed && (
            <span className="font-bold text-lg tracking-wide">
              Admin Panel
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-white/10"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `w-full flex items-center ${
                collapsed ? "justify-center" : ""
              } px-3 py-3 mb-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-white/20 scale-[1.02]"
                  : "hover:bg-white/10"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  className={`${collapsed ? "" : "mr-3"} ${
                    isActive ? "text-white" : "text-white/70"
                  }`}
                />

                {!collapsed && (
                  <span
                    className={isActive ? "font-semibold" : "text-white/80"}
                  >
                    {item.name}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 text-xs text-white/50 border-t border-white/10">
          © {new Date().getFullYear()} SRP System
        </div>
      )}
    </div>
  );
}