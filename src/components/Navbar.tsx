import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  {
    label: "About",
    path: "/about",
    children: [
      { label: "About Us", path: "/about" },
      { label: "Mission & Vision", path: "/about#mission" },
      { label: "Success Stories", path: "/about#success" },
    ],
  },
  {
    label: "Services",
    path: "/services",
    children: [
      { label: "Career Counselling", path: "/services#career" },
      { label: "Test Preparation", path: "/services#test" },
      { label: "Visa Processing", path: "/services#visa" },
      { label: "Admission Guidance", path: "/services#admission" },
      { label: "Finance Assistance", path: "/services#finance" },
    ],
  },
  {
    label: "Study Abroad",
    path: "/study-abroad/south-korea",
    children: [
      { label: "Study in South Korea", path: "/study-abroad/south-korea" },
      { label: "Study in UK", path: "/study-abroad/uk" },
      { label: "Study in Europe", path: "/study-abroad/europe" },
    ],
  },
  {
    label: "Language",
    path: "/language",
    children: [
      { label: "IELTS", path: "/language#ielts" },
      { label: "TOEFL", path: "/language#toefl" },
      { label: "PTE", path: "/language#pte" },
      { label: "EPS / KLPT / TOPIK", path: "/language#korean" },
    ],
  },
  {
    label: "Resources",
    path: "/resources",
    children: [
      { label: "Blog", path: "/resources#blog" },
      { label: "Gallery", path: "/gallery" },
      { label: "FAQs", path: "/resources#faq" },
      { label: "News & Events", path: "/resources#events" },
    ],
  },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block gradient-primary">
        <div className="container mx-auto flex items-center justify-between px-6 py-2 text-sm text-primary-foreground">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> +977-01-4567890</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> info@futureminds.edu.np</span>
          </div>
          <div className="flex items-center gap-4">
            <div id="google_translate_element"></div>
            <span>Kathmandu</span>
            <span className="opacity-50">|</span>
            <span>Banepa</span>
            <span className="opacity-50">|</span>
            <span>Pokhara</span>
            <span className="opacity-50">|</span>
            <span>Seoul</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-strong shadow-card" : "bg-card/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Future Minds" className="h-10 w-10 rounded-lg object-cover" />
            <div className="leading-tight">
              <span className="text-lg font-bold gradient-text">Future Minds</span>
              <span className="block text-[10px] font-medium text-muted-foreground tracking-wide">EDUCATIONAL CONSULTANCY</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.path}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-primary/5 hover:text-primary ${
                    location.pathname === link.path ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {link.label}
                  {link.children && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>

                <AnimatePresence>
                  {link.children && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1 w-56 rounded-xl bg-card shadow-elevated border border-border p-2"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link
              to="/contact"
              className="ml-3 gradient-primary rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Get Appointment
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-border bg-card"
            >
              <div className="px-6 py-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <div className="flex items-center justify-between">
                      <Link
                        to={link.path}
                        className="flex-1 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                      {link.children && (
                        <button
                          onClick={() =>
                            setActiveDropdown(activeDropdown === link.label ? null : link.label)
                          }
                          className="p-2"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              activeDropdown === link.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>
                    <AnimatePresence>
                      {link.children && activeDropdown === link.label && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden pl-4"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                <Link
                  to="/contact"
                  className="block mt-4 gradient-primary rounded-lg px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
                >
                  Get Appointment
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
