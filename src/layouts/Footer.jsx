import { Briefcase, Linkedin, Twitter, Github } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-emerald-900 dark:bg-slate-950 text-white border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <Link to="/" className="flex items-center gap-2.5">
            <Briefcase size={28} className="text-lime-400" />
            <span className="text-2xl font-extrabold tracking-tight">
              Talent<span className="text-lime-400">Bridge</span>
            </span>
          </Link>
          <p className="text-sm text-emerald-100/80 max-w-xs">
            Connecting top employers with exceptional talent across Bangladesh.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-emerald-100/90">
          <Link to="/jobs" className="hover:text-lime-300 transition">
            Browse Jobs
          </Link>
          <Link to="/job-categories" className="hover:text-lime-300 transition">
            Categories
          </Link>
          <Link to="/about" className="hover:text-lime-300 transition">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-lime-300 transition">
            Contact
          </Link>
          <Link to="/terms" className="hover:text-lime-300 transition">
            Terms of Service
          </Link>
        </div>

        <div className="flex gap-4">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full bg-white/10 hover:bg-lime-400 hover:text-slate-900 transition"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full bg-white/10 hover:bg-lime-400 hover:text-slate-900 transition"
          >
            <Twitter size={18} />
          </a>
          <a
            href="https://github.com/Mahmud-Hasan2024"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full bg-white/10 hover:bg-lime-400 hover:text-slate-900 transition"
          >
            <Github size={18} />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-white/10 text-center text-xs text-emerald-200/60">
        © {new Date().getFullYear()} Talent Bridge. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
