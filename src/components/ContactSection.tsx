import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WebsiteSettings } from "../types";

interface ContactSectionProps {
  settings: WebsiteSettings;
  onSubmitInquiry: (data: any) => Promise<boolean>;
}

export default function ContactSection({ settings, onSubmitInquiry }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    try {
      const ok = await onSubmitInquiry({ name, email, phone, subject, message });
      if (ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        setTimeout(() => setSuccess(false), 4000);
      } else {
        alert("Encountered an issue submitting your message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const formattedWhatsApp = settings.whatsappNumber.replace(/[^0-9+]/g, "");

  return (
    <section id="contact" className="py-24 bg-onyx border-t border-gold/10 relative overflow-hidden">
      {/* Visual flares */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-burgundy-deep/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold font-sans">Locate & Inquire</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white uppercase mt-2">
            Contact <span className="gold-text-shimmer">King Ash</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          <p className="text-gray-400 font-light text-sm mt-3">
            Ready to design your bespoke wardrobe? Reach out via WhatsApp, visit our Latrikunda atelier, or submit a message below.
          </p>
        </div>

        {/* Layout container */}
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Direct contact metadata & Interactive SVG Map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                Visit Our Atelier
              </h3>
              <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
                Step into the realm of custom excellence. Experience our handwoven premium bazins, embroidery options, and measure with our master tailors.
              </p>

              {/* Direct listings */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded bg-burgundy-deep/20 border border-gold/20 text-gold mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gold font-bold">Atelier Location</h4>
                    <p className="text-sm text-white font-medium mt-0.5">{settings.location}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Serekunda metropolitan region, Jakabi, The Gambia</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded bg-burgundy-deep/20 border border-gold/20 text-gold mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gold font-bold">Phone & WhatsApp Threads</h4>
                    <p className="text-sm text-white font-medium mt-0.5">Primary: {settings.phoneNumbers[0]}</p>
                    {settings.phoneNumbers[1] && (
                      <p className="text-xs text-gray-300">Secondary: {settings.phoneNumbers[1]}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded bg-burgundy-deep/20 border border-gold/20 text-gold mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gold font-bold">Email Inbox</h4>
                    <p className="text-sm text-white font-medium mt-0.5 underline">{settings.emails[0]}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Luxury Interactive SVG Map of Latrikunda Sabiji */}
            <div className="border border-gold/20 bg-gradient-to-b from-charcoal/90 to-onyx rounded-xl overflow-hidden shadow-2xl relative p-5 shadow-[0_4px_25px_rgba(223,178,87,0.04)]">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-gold-hover">ATELIER DIRECT MAP</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Latrikunda Sabiji, Jakabi</span>
              </div>

              {/* Graphical SVG grid representing Serekunda/Latrikunda roads */}
              <div className="bg-onyx h-48 border border-gold/10 rounded-lg relative overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid Lines representing Latrikunda streets */}
                  <line x1="10" y1="0" x2="10" y2="100" stroke="#D4AF37" strokeWidth="0.2" />
                  <line x1="30" y1="0" x2="30" y2="100" stroke="#D4AF37" strokeWidth="0.2" />
                  <line x1="60" y1="0" x2="60" y2="100" stroke="#D4AF37" strokeWidth="0.4" /> {/* Jakabi main road */}
                  <line x1="85" y1="0" x2="85" y2="100" stroke="#D4AF37" strokeWidth="0.2" />
                  
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#D4AF37" strokeWidth="0.2" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#D4AF37" strokeWidth="0.5" /> {/* Latrikunda highway */}
                  <line x1="0" y1="75" x2="100" y2="75" stroke="#D4AF37" strokeWidth="0.2" />

                  {/* Shading representing buildings */}
                  <rect x="35" y="5" width="20" height="12" fill="#D4AF37" opacity="0.1" rx="1" />
                  <rect x="65" y="25" width="15" height="18" fill="#D4AF37" opacity="0.1" rx="1" />
                  <rect x="15" y="55" width="35" height="15" fill="#D4AF37" opacity="0.15" rx="1" />
                </svg>

                {/* Real-time pinpoint overlay in center representing King Ash */}
                <div className="absolute top-[50%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="absolute w-8 h-8 rounded-full bg-gold/25 animate-ping duration-1000" />
                  <div className="relative p-2 rounded-full bg-gold text-black shadow-lg">
                    <Award className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-black bg-gold border border-gold-dark px-1.5 rounded-sm shadow mt-1">
                    KING ASH
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 text-[9px] text-gray-500 font-mono uppercase tracking-widest bg-onyx/80 px-2 py-0.5 rounded border border-gold/5">
                  JAKABI JUNCTION
                </div>
              </div>

              {/* Direct Open in Maps / Trigger Quick WhatsApp Call button */}
              <div className="mt-4 flex gap-3.5">
                <a
                  href={`https://wa.me/${formattedWhatsApp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-grow text-center py-2.5 bg-gradient-to-r from-burgundy-deep to-burgundy-dark text-white border border-gold/20 rounded text-[10px] uppercase tracking-widest font-bold hover:border-gold hover:gold-glow-hover transition-all"
                >
                  Message Location Details
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry form */}
          <div className="lg:col-span-7 bg-gradient-to-b from-charcoal to-onyx border border-gold/20 p-6 md:p-10 rounded-xl shadow-2xl relative shadow-[0_8px_30px_rgba(223,178,87,0.06)]">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-white tracking-wide mb-2 uppercase">
              Send an Inquiry
            </h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed mb-8">
              Fill out the message form below for general quotes, bulk bridal team packages, or partnerships questions. Our customer service representatives reply within 12 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-300 font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lamin Touray"
                    className="w-full bg-onyx text-white rounded border border-gold/15 px-4 py-3 text-xs focus:outline-hidden focus:border-gold font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-300 font-semibold mb-1">Your Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. lamin@gmail.com"
                    className="w-full bg-onyx text-white rounded border border-gold/15 px-4 py-3 text-xs focus:outline-hidden focus:border-gold font-sans"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-300 font-semibold mb-1">WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +220 760 7728"
                    className="w-full bg-onyx text-white rounded border border-gold/15 px-4 py-3 text-xs focus:outline-hidden focus:border-gold font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-300 font-semibold mb-1">Message Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Bridal team embroidery pricing"
                    className="w-full bg-onyx text-white rounded border border-gold/15 px-4 py-3 text-xs focus:outline-hidden focus:border-gold font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-300 font-semibold mb-1">Your Message Details *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the fabric Bazin, embroidery colors, event schedule, or alterations you require..."
                  className="w-full bg-onyx text-white rounded border border-gold/15 px-4 py-3 text-xs focus:outline-hidden focus:border-gold font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-gold to-gold-dark text-black font-bold text-xs uppercase tracking-[0.15em] rounded transition-all hover:gold-glow flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-4 h-4 text-black" />
                <span>{loading ? "Sending inquiry..." : "Send Message"}</span>
              </button>
            </form>

            {/* Success dialogue modal */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-charcoal/98 flex flex-col items-center justify-center p-6 text-center z-20 rounded-xl"
                >
                  <CheckCircle className="w-12 h-12 text-gold mb-3 animate-bounce" />
                  <h4 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">Inquiry Dispatched!</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Thank you. We have saved your inquiry in our central merchant database. An atelier representative will review and contact you shortly!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
