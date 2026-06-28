import { Scissors, MapPin, Phone, Mail, Instagram, Facebook, Award, ArrowUp } from "lucide-react";
import { WebsiteSettings } from "../types";

interface FooterProps {
  settings: WebsiteSettings;
  onNavigate: (section: string) => void;
}

export default function Footer({ settings, onNavigate }: FooterProps) {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-onyx border-t border-gold/15 py-16 text-gray-400 font-sans text-xs relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("home")}>
              <div className="p-1.5 bg-burgundy-deep rounded border border-gold/30">
                <Scissors className="w-4 h-4 text-gold" />
              </div>
              <span className="font-serif text-lg font-bold tracking-widest text-white uppercase block">
                KING ASH
              </span>
            </div>
            <p className="text-gray-400 font-light leading-relaxed">
              Atelier of luxury West African tailoring, grand boubous, custom embroidered Agbadas, and contemporary corporate suiting. Located in Serekunda, The Gambia.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href={settings.facebookUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-charcoal rounded hover:bg-gold hover:text-black text-gold border border-gold/15 hover:border-gold transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.instagramUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-charcoal rounded hover:bg-gold hover:text-black text-gold border border-gold/15 hover:border-gold transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9+]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-charcoal rounded hover:bg-gold hover:text-black text-gold border border-gold/15 hover:border-gold transition-all font-mono font-bold text-[10px]"
                aria-label="WhatsApp"
              >
                WA
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white">Atelier Navigations</h4>
            <div className="grid grid-cols-2 gap-2.5 font-light">
              <button onClick={() => onNavigate("home")} className="text-left hover:text-gold cursor-pointer transition-colors">Home Stage</button>
              <button onClick={() => onNavigate("about")} className="text-left hover:text-gold cursor-pointer transition-colors">Our Story</button>
              <button onClick={() => onNavigate("services")} className="text-left hover:text-gold cursor-pointer transition-colors">Our Services</button>
              <button onClick={() => onNavigate("gallery")} className="text-left hover:text-gold cursor-pointer transition-colors">Lookbooks</button>
              <button onClick={() => onNavigate("booking")} className="text-left hover:text-gold cursor-pointer transition-colors">Book Fitting</button>
              <button onClick={() => onNavigate("tracking")} className="text-left hover:text-gold cursor-pointer transition-colors">Track Status</button>
              <button onClick={() => onNavigate("testimonials")} className="text-left hover:text-gold cursor-pointer transition-colors">Client Reviews</button>
              <button onClick={() => onNavigate("contact")} className="text-left hover:text-gold cursor-pointer transition-colors">Get in Touch</button>
            </div>
          </div>

          {/* Contact Col */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white">Direct Connect</h4>
            <div className="space-y-2.5 font-light leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{settings.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{settings.phoneNumbers[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="underline">{settings.emails[0]}</span>
              </div>
            </div>
          </div>

          {/* Hours Col */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white">Atelier Hours</h4>
            <div className="space-y-2 font-light">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Monday - Friday</span>
                <span className="text-white font-medium">9:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Saturday</span>
                <span className="text-white font-medium">9:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between pb-1 text-red-400">
                <span>Sunday</span>
                <span className="font-medium uppercase">Atelier Closed</span>
              </div>
            </div>
            <div className="p-3 bg-burgundy-deep/15 border border-gold/10 rounded flex items-center gap-2 text-[10px] text-gold-hover">
              <Award className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Tailoring Gambian Heritage since 2026.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-[10px] uppercase tracking-widest">
          <div>
            © {currentYear} KING ASH COUTURE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>Designed in Serekunda, The Gambia</span>
            <button
              onClick={handleScrollTop}
              className="p-2 bg-charcoal border border-gold/10 hover:border-gold hover:text-gold rounded text-white transition-all cursor-pointer flex items-center justify-center"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
