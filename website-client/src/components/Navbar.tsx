import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { HashLink } from "react-router-hash-link";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Events", path: "/events" },
  { label: "Members", path: "/members" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#090909] backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">

          <HashLink smooth to="/#hero" className="flex items-center gap-3">
            <img
              src="/images/logo.webp"
              alt="Maha Lankeshwara Foundation Logo"
              className="h-14 w-14 object-contain"
            /> 
            <span className="gold-gradient-text font-bold text-lg hidden sm:block">
              MAHA LANKESHWARA FOUNDATION
            </span>
          </HashLink>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200 rounded-md ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-white hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggle}
              className="ml-4 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggle}
              className="p-2 rounded-full bg-primary/10 text-primary"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#D9D9D9]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-primary/10 mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-sm font-medium tracking-wide uppercase transition-colors ${
                  location.pathname === link.path
                    ? "text-[#D9D9D9]"
                    : "text-[#D9D9D9] hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
