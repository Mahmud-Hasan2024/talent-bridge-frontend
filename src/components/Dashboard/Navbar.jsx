import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { GiSuitcase } from "react-icons/gi";
import { Link, NavLink } from "react-router";
import useAuthContext from "../../hooks/useAuthContext";
import ThemeToggle from "../ThemeToggle";

const Navbar = ({ sidebarOpen }) => {
  const { user, logoutUser } = useAuthContext();

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 sticky top-0 z-20">
      <div className="flex-none lg:hidden">
        <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
          {sidebarOpen ? (
            <FiX className="h-5 w-5" />
          ) : (
            <FiMenu className="h-5 w-5" />
          )}
        </label>
      </div>
      <div className="flex-1">
        <Link
          to="/"
          className="flex items-center gap-2 btn btn-ghost text-xl lg:hidden"
        >
          <GiSuitcase size={28} className="text-emerald-500" />
          <span className="font-bold">Talent Bridge</span>
        </Link>
        <div className="hidden lg:block px-2">
          <span className="text-sm text-base-content/60 font-medium">
            Welcome back,{" "}
            <strong className="text-base-content capitalize">
              {user?.first_name || user?.email?.split("@")[0] || "User"}
            </strong>
          </span>
        </div>
      </div>

      <div className="flex-none flex items-center gap-2">
        <ThemeToggle />

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold uppercase">
              {user?.first_name?.[0] || user?.email?.[0] || "U"}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 border border-base-300 rounded-2xl w-52 space-y-1"
          >
            <li className="px-3 py-1.5 text-xs text-base-content/50 truncate border-b border-base-200">
              {user?.email}
            </li>
            <li>
              <NavLink
                to="/dashboard/profile"
                className="flex items-center gap-2 py-2"
              >
                <FiUser /> Profile Settings
              </NavLink>
            </li>
            <li>
              <button
                onClick={logoutUser}
                className="flex items-center gap-2 py-2 text-error"
              >
                <FiLogOut /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
