import { Briefcase, Linkedin, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer footer-center bg-emerald-700 text-white py-10">
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <Briefcase size={50} className="text-lime-400" />
          <p className="font-bold text-center">
            Talent Bridge
            <br />
            Bridging Opportunities Since 2025
          </p>
        </div>

        {/* Socials */}
        <div className="flex gap-4">
          <a href="#" className="hover:text-lime-300">
            <Linkedin size={24} />
          </a>
          <a href="#" className="hover:text-lime-300">
            <Twitter size={24} />
          </a>
          <a href="#" className="hover:text-lime-300">
            <Github size={24} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-emerald-100">
          © {new Date().getFullYear()} Talent Bridge. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
