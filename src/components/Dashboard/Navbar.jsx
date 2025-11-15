import { FiMenu, FiX } from "react-icons/fi";
import { GiSuitcase } from "react-icons/gi";
import { Link, NavLink } from "react-router";
import useAuthContext from "../../hooks/useAuthContext";

const Navbar = ({ sidebarOpen }) => {
  const { user, logoutUser } = useAuthContext();

  return (
    <div className="navbar bg-base-100 border-b border-green-500/20">
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
        <Link to="/" className="flex items-center gap-2 btn btn-ghost text-xl">
          <GiSuitcase size={30} className="text-green-400" />
          <span className="font-bold">Talent Bridge</span>
        </Link>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://api.iconify.design/material-symbols/account-circle.svg?color=%239ca3af"
                className="w-10 h-10 rounded-full bg-gray-100"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <NavLink to="/dashboard/profile">Profile</NavLink>
            </li>
            <li>
              <a onClick={logoutUser}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
