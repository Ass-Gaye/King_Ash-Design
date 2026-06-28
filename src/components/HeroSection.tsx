import { Sparkles, ArrowRight, MessageSquare, Compass, PhoneCall } from "lucide-react";
import { motion } from "motion/react";
import { WebsiteSettings } from "../types";

interface HeroSectionProps {
  onNavigate: (section: string) => void;
  settings: WebsiteSettings;
  heroImage: string;
}

export default function HeroSection({ onNavigate, settings, heroImage }: HeroSectionProps) {
  // Extract custom title or use default King Ash Design
  const title = settings.heroTitle || "King Ash Design";
  const tagline = settings.heroTagline || "Custom Tailoring & Fashion Design Crafted with Excellence in The Gambia";
  const formattedWhatsApp = settings.whatsappNumber.replace(/[^0-9+]/g, "");

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-onyx py-16 md:py-0">
      {/* Elegant Thin Double Frame Border for Haute Couture Atelier Vibe */}
      <div className="absolute inset-4 md:inset-8 border border-gold/15 pointer-events-none z-10 rounded-sm">
        <div className="absolute inset-1 border border-gold/5 rounded-xs" />
        
        {/* Elegant corner framing notches */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold" />
      </div>

      {/* Background image with parallax effect and multiple overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="King Ash Luxury Tailoring"
          className="w-full h-full object-cover scale-105 select-none brightness-50 contrast-[1.08]"
          referrerPolicy="no-referrer"
        />
        {/* Deep luxurious black and golden dark room gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/50 to-onyx/90" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-onyx/40 to-onyx" />
        
        {/* High-luxury glowing spotlights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-r from-gold/15 via-gold-dark/5 to-gold/15 rounded-full blur-[140px] pointer-events-none mix-blend-screen opacity-75" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-burgundy-deep/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Decorative vertical lines and indicators for high luxury editorial aesthetic */}
      <div className="absolute left-10 top-1/3 hidden xl:flex flex-col gap-8 items-center z-10 text-[10px] tracking-[0.3em] uppercase text-gold/60 font-mono">
        <span className="rotate-270 -my-8">EST. 2026</span>
        <div className="w-px h-24 bg-gold/30" />
        <span className="rotate-270 -my-10">THE GAMBIA</span>
      </div>

      <div className="absolute right-10 top-1/3 hidden xl:flex flex-col gap-8 items-center z-10 text-[10px] tracking-[0.3em] uppercase text-gold/60 font-mono">
        <span className="rotate-90 -my-8">LATRIKUNDA</span>
        <div className="w-px h-24 bg-gold/30" />
        <span className="rotate-90 -my-8">BESPOKE</span>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-burgundy-deep/40 border border-gold/30 backdrop-blur-md mb-6 shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold animate-spin-slow" />
          <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold text-gold-hover">
            Luxury West African Fashion
          </span>
        </motion.div>

        {/* Brand Display Header */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="font-serif text-5xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4 text-white uppercase leading-none drop-shadow-2xl"
        >
          <span className="gold-text-shimmer drop-shadow-md">KING ASH</span>
        </motion.h1>

        {/* Tagline / Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl font-light text-gray-200 tracking-wide max-w-3xl mx-auto mb-10 leading-relaxed font-serif italic border-l border-r border-gold/20 px-6 py-2"
        >
          "{tagline}"
        </motion.p>

        {/* Primary Call-to-actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto sm:max-w-none"
        >
          <button
            onClick={() => onNavigate("booking")}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-black font-semibold text-xs uppercase tracking-[0.15em] rounded transition-all transform hover:scale-103 duration-300 shadow-xl border border-gold-hover hover:gold-glow flex items-center justify-center gap-2 cursor-pointer font-sans"
          >
            <span>Book an Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate("gallery")}
            className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-gold/40 hover:border-gold rounded font-semibold text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
          >
            <Compass className="w-4 h-4 text-gold" />
            <span>View Gallery</span>
          </button>

          <button
            onClick={() => onNavigate("contact")}
            className="w-full sm:w-auto px-8 py-4 bg-burgundy-deep/20 hover:bg-burgundy-deep/40 text-gold-hover border border-burgundy-deep/50 hover:border-gold/30 rounded font-semibold text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
          >
            <PhoneCall className="w-4 h-4 text-gold" />
            <span>Contact Us</span>
          </button>
        </motion.div>

        {/* Quick info indicators on bottom hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gold/10 text-center max-w-4xl mx-auto"
        >
          <div className="p-3">
            <span className="block text-2xl font-serif text-gold font-bold">100%</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Bespoke Fit</span>
          </div>
          <div className="p-3">
            <span className="block text-2xl font-serif text-gold font-bold">Handcrafted</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Embroidery</span>
          </div>
          <div className="p-3">
            <span className="block text-2xl font-serif text-gold font-bold">Gambia</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Proudly Local</span>
          </div>
          <div className="p-3">
            <span className="block text-2xl font-serif text-gold font-bold">Global</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Shipping Ready</span>
          </div>
        </motion.div>
      </div>

      {/* Elegant fade to the next section */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-onyx to-transparent z-10" />
    </section>
  );
}
