import {
  FiBarChart2,
  FiBriefcase,
  FiPlusCircle,
  FiTag,
  FiUser,
  FiUsers,
  FiHome,
} from "react-icons/fi";
import { GiSuitcase } from "react-icons/gi";
import { Link, useLocation } from "react-router";
import useAuthContext from "../../hooks/useAuthContext";

const Sidebar = () => {
  const { user, logout } = useAuthContext();
  const location = useLocation();
  if (!user) return null;

  const role = user.role?.toLowerCase() || "guest";

  // 🎯 Menus for each role (matching your AppRoutes)
  const seekerMenus = [
    { to: "/Dashboard", icon: FiBarChart2, label: "Dashboard" },
    { to: "/Dashboard/jobs", icon: FiBriefcase, label: "Browse Jobs" },
    { to: "/Dashboard/job-categories", icon: FiTag, label: "Categories" },
    {
      to: "/Dashboard/seeker/my-applications",
      icon: FiUsers,
      label: "My Applications",
    },
  ];

  const employerMenus = [
    { to: "/Dashboard", icon: FiBarChart2, label: "Dashboard" },
    { to: "/Dashboard/employer/post-job", icon: FiPlusCircle, label: "Post Job" },
    { to: "/Dashboard/employer/my-jobs", icon: FiBriefcase, label: "My Jobs" },
    // { to: "/Dashboard/employer/jobs", icon: FiBriefcase, label: "My Jobs" },
    {
      to: "/Dashboard/employer/applicants",
      icon: FiUsers,
      label: "Applicants",
    },
  ];

  const adminMenus = [
    { to: "/Dashboard", icon: FiBarChart2, label: "Dashboard" },
    { to: "/Dashboard/admin/all-jobs", icon: FiBriefcase, label: "All Jobs" },
    // { to: "/Dashboard/admin/jobs", icon: FiBriefcase, label: "Manage Jobs" },
    { to: "/Dashboard/admin/categories", icon: FiTag, label: "Manage Categories" },
    { to: "/Dashboard/admin/users", icon: FiUser, label: "Manage Users" },
    { to: "/Dashboard/admin/applicants", icon: FiUsers, label: "All Applicants" },
  ];

  // ✅ Select correct menu based on role
  let menuItems = seekerMenus;
  if (role === "admin") menuItems = adminMenus;
  else if (role === "employer") menuItems = employerMenus;

  return (
    <div className="drawer-side z-10">
      <label
        htmlFor="drawer-toggle"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <aside className="menu bg-base-200 w-64 min-h-full p-4 flex flex-col">
        {/* 🔰 Logo */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <Link
            to="/"
            className="flex items-center gap-2 btn btn-ghost text-xl"
          >
            <GiSuitcase size={30} className="text-green-400" />
            <span className="font-bold">Talent Bridge</span>
          </Link>
        </div>

        {/* 📋 Sidebar links */}
        <ul className="menu menu-md gap-2 flex-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={index}>
                <Link
                  to={item.to}
                  className={`flex items-center ${
                    isActive
                      ? "bg-green-600 text-white rounded-md"
                      : "hover:bg-base-300"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout (optional for dashboard) */}
        {/* <button
          onClick={logout}
          className="btn btn-sm btn-outline mt-2 text-sm"
        >
          Logout
        </button> */}

        {/* NEW: Return to Home Action */}
        <div className="mt-auto border-t border-base-300 pt-4">
          <ul className="p-0">
            <li>
              <Link 
                to="/" 
                className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg text-emerald-600 border border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200"
              >
                <FiHome className="h-5 w-5" />
                <span className="font-bold">Return to Home</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-4 text-xs text-base-content/70 border-t border-base-300 text-center">
          © 2025 Talent Bridge Co.
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
