import { useState } from "react";
import {
  Menu,
  X,
  Briefcase,
  LogOut,
  LogIn,
  UserPlus,
  User,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import ThemeToggle from "../components/ThemeToggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logoutUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setOpen(false);
    navigate("/login");
  };

  const role = user?.role?.toLowerCase() || "guest";
  const isAuthenticated = Boolean(user && user.id);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/jobs", label: "Jobs" },
    { path: "/job-categories", label: "Categories" },
    ...(isAuthenticated ? [{ path: "/dashboard", label: "Dashboard" }] : []),
    ...(role === "seeker"
      ? [
          {
            path: "/dashboard/seeker/applications-status",
            label: "My Applications",
          },
        ]
      : []),
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950 text-white shadow-lg sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-white/10 group-hover:bg-lime-400/20 transition">
            <Briefcase className="w-6 h-6 text-lime-300" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            Talent<span className="text-lime-300">Bridge</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-1 font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-white/15 text-lime-300 font-bold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle className="text-white hover:bg-white/10" />

          {user ? (
            <>
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full transition border border-white/15"
              >
                <div className="w-7 h-7 rounded-full bg-lime-400 text-slate-900 font-bold flex items-center justify-center text-xs uppercase">
                  {user.first_name?.[0] || user.email?.[0] || "U"}
                </div>
                <span className="text-sm font-semibold capitalize max-w-[120px] truncate">
                  {user.first_name || user.email.split("@")[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-sm bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold border-none rounded-xl px-4"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-sm bg-white/15 hover:bg-white/25 text-white border-white/20 rounded-xl px-4 font-semibold"
              >
                <LogIn size={16} /> Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-sm bg-lime-400 hover:bg-lime-300 text-slate-900 border-none rounded-xl px-4 font-bold"
              >
                <UserPlus size={16} /> Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle className="text-white hover:bg-white/10" />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
            className="btn btn-ghost btn-square text-white"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="lg:hidden bg-emerald-800 dark:bg-slate-900 text-white border-t border-white/10 px-4 pt-2 pb-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block py-2.5 px-4 rounded-xl hover:bg-white/10 font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-white/10 my-3 pt-3">
            {user ? (
              <div className="space-y-3 px-2">
                <Link
                  to="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-2"
                >
                  <div className="w-9 h-9 rounded-full bg-lime-400 text-slate-900 font-bold flex items-center justify-center uppercase">
                    {user.first_name?.[0] || user.email?.[0] || "U"}
                  </div>
                  <div>
                    <p className="font-bold capitalize">
                      {user.first_name || user.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-white/70">{user.email}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold border-none w-full rounded-xl"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="btn bg-white text-emerald-800 hover:bg-gray-100 border-none rounded-xl font-bold"
                >
                  <LogIn size={16} /> Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="btn bg-lime-400 text-slate-900 hover:bg-lime-300 border-none rounded-xl font-bold"
                >
                  <UserPlus size={16} /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
