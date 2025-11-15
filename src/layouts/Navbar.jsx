import { useState } from "react";
import { Menu, X, Briefcase, LogOut, LogIn, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logoutUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const role = user?.role || "guest";

// Role-based navigation items
const isAuthenticated = user && user.id; 

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/jobs", label: "Jobs" },
  { path: "/job-categories", label: "Categories" },
  
  ...(isAuthenticated 
      ? [{ path: "/dashboard", label: "Dashboard" }] 
      : []),
      
  ...(role === "seeker"
    ? [{ path: "/dashboard/seeker/my-applications", label: "My Applications" }]
    : []),
    
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/terms", label: "Terms of Service" },
];

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Briefcase className="w-7 h-7 text-lime-400" />
          <h1 className="text-2xl font-bold tracking-wide">Talent Bridge</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:text-lime-300 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-emerald-700 px-3 py-1 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://api.iconify.design/material-symbols/account-circle.svg?color=%239ca3af"
                  className="w-10 h-10 rounded-full bg-gray-100"
                />
                <span className="font-medium capitalize">
                  {user.first_name || user.email.split("@")[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-lime-400 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-lime-500 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 bg-white text-emerald-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <LogIn size={18} /> Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 bg-lime-400 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-lime-500 transition"
              >
                <UserPlus size={18} /> Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="lg:hidden bg-emerald-700 text-white">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block py-2 px-6 hover:bg-emerald-800"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-emerald-600 my-2"></div>

          {user ? (
            <>
              <div className="flex items-center gap-2 px-6 py-2">
                <img
                  alt="User Avatar"
                  src="https://api.iconify.design/material-symbols/account-circle.svg?color=%239ca3af"
                  className="w-10 h-10 rounded-full bg-gray-100"
                />
                <span className="capitalize">
                  {user.first_name || user.email.split("@")[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-6 bg-lime-500 text-gray-900 font-semibold hover:bg-lime-400"
              >
                <LogOut className="inline mr-2" size={18} />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 px-6 py-3">
              <Link
                to="/login"
                className="bg-white text-emerald-700 font-semibold py-2 rounded-lg text-center hover:bg-gray-100"
              >
                <LogIn className="inline mr-2" size={18} />
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-lime-400 text-gray-900 font-semibold py-2 rounded-lg text-center hover:bg-lime-500"
              >
                <UserPlus className="inline mr-2" size={18} />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
