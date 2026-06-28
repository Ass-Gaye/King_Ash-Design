import { useState, useEffect } from "react";
import { Scissors, Menu, X, MessageSquare, ShieldCheck, Clock, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WebsiteSettings } from "../types";

interface NavbarProps {
  onNavigate: (section: string) => void;
  currentSection: string;
  settings: WebsiteSettings;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export default function Navbar({ onNavigate, currentSection, settings, onOpenAdmin, isAdminLoggedIn }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "Our Story" },
    { id: "services", label: "Services" },
    { id: "gallery", label: "Collections" },
    { id: "booking", label: "Book Order" },
    { id: "tracking", label: "Track Status" },
    { id: "testimonials", label: "Reviews" },
    { id: "contact", label: "Contact Us" }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  const formattedWhatsApp = settings.whatsappNumber.replace(/[^0-9+]/g, "");

  return (
    <>
      {/* Top Banner (Opening Hours & Quick Actions) */}
      <div className="bg-burgundy-deep text-xs text-gold-hover border-b border-gold/20 py-2 px-4 flex justify-between items-center z-50 relative font-sans">
        <div className="flex items-center gap-4 text-[10px] md:text-xs">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-gold" />
            <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-gold" />
            <span>+220 760 7728</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] md:text-xs">
          <a
            href={`https://wa.me/${formattedWhatsApp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-white transition-all font-medium text-gold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Quick WhatsApp Order</span>
          </a>
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 hover:text-white text-gray-300 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? "Admin Panel" : "Admin Login"}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 w-full z-40 transition-all duration-300 border-b ${
          scrolled
            ? "bg-onyx/95 backdrop-blur-md border-gold/15 py-3 shadow-lg"
            : "bg-onyx/80 backdrop-blur-xs border-gold/10 py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleItemClick("home")}
          >
            <div className="relative p-2 rounded bg-gradient-to-tr from-burgundy-deep to-charcoal border border-gold/30 group-hover:border-gold/60 transition-all shadow-inner">
              <Scissors className="w-5.5 h-5.5 text-gold group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-serif text-xl md:text-2xl font-bold tracking-widest text-white block group-hover:text-gold transition-colors">
                KING ASH
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gold block -mt-1">
                Haute Couture
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative px-3.5 py-2 text-sm uppercase tracking-wider font-sans transition-all cursor-pointer duration-200 hover:text-gold ${
                    active ? "text-gold font-semibold" : "text-gray-300 font-light"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-gold"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${formattedWhatsApp}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-gradient-to-r from-burgundy-deep to-burgundy-dark text-white border border-gold/30 hover:border-gold hover:gold-glow-hover text-xs uppercase tracking-wider font-semibold rounded transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-gold animate-pulse" />
              <span>Order on WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden border-t border-gold/15 bg-onyx overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2.5">
                {navItems.map((item) => {
                  const active = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`block w-full text-left px-4 py-3 rounded text-sm uppercase tracking-widest font-sans transition-all border-l-2 ${
                        active
                          ? "bg-burgundy-deep/25 border-gold text-gold font-bold"
                          : "border-transparent text-gray-300 hover:bg-neutral-900/50 hover:text-gold"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}

                <div className="pt-4 border-t border-gold/10 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/${formattedWhatsApp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center py-3.5 bg-gradient-to-r from-burgundy-deep to-burgundy-dark text-white border border-gold/30 rounded font-sans uppercase tracking-wider text-xs font-bold hover:gold-glow flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-gold" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
