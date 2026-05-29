import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Youtube } from "lucide-react";
import { HashLink } from "react-router-hash-link";

const Footer = () => {
  return (
    <footer className="bg-[#090909] text-[#D9D9D9]">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <HashLink smooth to="/#hero" className="flex items-center gap-3">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.webp" alt="Logo" className="h-12 w-12 object-contain" />
              <span className="gold-gradient-text font-bold text-lg">Maha Lankeshwara Foundation</span>
            </div>
            </HashLink>
            <p className="text-sm leading-relaxed text-[#D9D9D9]">
              For a Proud Sri Lankan Era. An unforgettable thirteen years of experience in social welfare.
            </p>
          </div>

          <div>
            <h4 className="gold-gradient-text text-[#D9D9D9] font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <div className="space-y-2 text-[#D9D9D9]">
              {["Home", "About", "Projects", "Events", "Members", "Blog", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="block text-sm text-[#D9D9D9] hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="gold-gradient-text font-semibold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-[#D9D9D9]">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <span>No 2-110, BMICH, Block 02, Bauddhaloka Mawatha, Colombo 07</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#D9D9D9]">
                <Phone size={16} className="text-primary shrink-0" />
                <span>+94 11 3660 152</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#D9D9D9]">
                <Mail size={16} className="text-primary shrink-0" />
                <span>info@mahalankeshwara.org</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="gold-gradient-text font-semibold text-sm uppercase tracking-wider mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://web.facebook.com/profile.php?id=61587109193326"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.youtube.com/channel/UC8xwodTUvoi9pY9kZwQeBfQ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary/10 text-center">
          <p className="text-xs text-[#A2A2A2]">
            © {new Date().getFullYear()} Maha Lankeshwara Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
