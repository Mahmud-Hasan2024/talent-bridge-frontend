import {
  FiBarChart2,
  FiBriefcase,
  FiPlusCircle,
  FiTag,
  FiUser,
  FiUsers,
  FiHome,
  FiSend,
} from "react-icons/fi";
import { GiSuitcase } from "react-icons/gi";
import { Link, useLocation } from "react-router";
import useAuthContext from "../../hooks/useAuthContext";

const Sidebar = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  if (!user) return null;

  const role = user.role?.toLowerCase() || "guest";

  const seekerMenus = [
    { to: "/dashboard", icon: FiBarChart2, label: "Dashboard" },
    { to: "/dashboard/jobs", icon: FiBriefcase, label: "Browse Jobs" },
    { to: "/dashboard/job-categories", icon: FiTag, label: "Categories" },
    {
      to: "/dashboard/seeker/applications-status",
      icon: FiSend,
      label: "My Applications",
    },
  ];

  const employerMenus = [
    { to: "/dashboard", icon: FiBarChart2, label: "Dashboard" },
    {
      to: "/dashboard/employer/post-job",
      icon: FiPlusCircle,
      label: "Post Job",
    },
    { to: "/dashboard/employer/my-jobs", icon: FiBriefcase, label: "My Jobs" },
    {
      to: "/dashboard/employer/applicants",
      icon: FiUsers,
      label: "Applicants",
    },
  ];

  const adminMenus = [
    { to: "/dashboard", icon: FiBarChart2, label: "Dashboard" },
    { to: "/dashboard/admin/all-jobs", icon: FiBriefcase, label: "All Jobs" },
    {
      to: "/dashboard/admin/categories",
      icon: FiTag,
      label: "Manage Categories",
    },
    { to: "/dashboard/admin/users", icon: FiUser, label: "User List" },
    {
      to: "/dashboard/admin/applicants",
      icon: FiUsers,
      label: "All Applicants",
    },
  ];

  let menuItems = seekerMenus;
  if (role === "admin") menuItems = adminMenus;
  else if (role === "employer") menuItems = employerMenus;

  return (
    <div className="drawer-side z-30">
      <label
        htmlFor="drawer-toggle"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <aside className="menu bg-base-100 text-base-content w-64 min-h-full p-4 flex flex-col border-r border-base-300">
        <div className="flex items-center gap-2 mb-6 px-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-extrabold"
          >
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25">
              <GiSuitcase size={24} />
            </div>
            <span>Talent Bridge</span>
          </Link>
        </div>

        <ul className="menu menu-md gap-1.5 flex-1 p-0">
          {menuItems.map((item, index) => {
            const isActive =
              location.pathname.toLowerCase() === item.to.toLowerCase();
            return (
              <li key={index}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "hover:bg-base-200 text-base-content/80"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto border-t border-base-300 pt-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-600/40 hover:bg-emerald-600 hover:text-white transition-all duration-200 font-semibold text-sm"
          >
            <FiHome className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>
        </div>

        <div className="pt-4 text-xs text-base-content/50 text-center">
          © {new Date().getFullYear()} Talent Bridge Co.
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
