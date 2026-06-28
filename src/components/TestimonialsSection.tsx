import React, { useState } from "react";
import { Star, MessageSquare, Sparkles, CheckCircle, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Testimonial } from "../types";

interface TestimonialsSectionProps {
  items: Testimonial[];
  onSubmitReview: (review: { name: string; role: string; content: string; rating: number }) => Promise<void>;
}

export default function TestimonialsSection({ items, onSubmitReview }: TestimonialsSectionProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    setLoading(true);
    try {
      await onSubmitReview({ name, role: role || "Valued Client", content, rating });
      setSuccess(true);
      setName("");
      setRole("");
      setContent("");
      setRating(5);
      setTimeout(() => {
        setSuccess(false);
        setShowReviewForm(false);
      }, 3000);
    } catch (e) {
      console.error(e);
      alert("Failed to save review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-charcoal/40 border-t border-gold/10 relative overflow-hidden">
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold font-sans">Client Voices</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white uppercase mt-2">
            Reviews & <span className="gold-text-shimmer">Testimonials</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          <p className="text-gray-400 font-light text-sm mt-3">
            Real stories from our clients who experience the perfection, heritage embroidery, and luxury fit of King Ash creations.
          </p>
        </div>

        {/* Carousel / Grid of Reviews */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {items.map((t) => (
            <div
              key={t.id}
              className="bg-gradient-to-b from-charcoal/90 to-onyx border border-gold/15 hover:border-gold/35 hover:shadow-[0_4px_20px_rgba(223,178,87,0.06)] p-6 md:p-8 rounded-xl relative flex flex-col justify-between shadow-2xl transition-all duration-300 hover:translate-y-[-4px] group"
            >
              <Quote className="w-8 h-8 text-gold/15 absolute right-6 top-6" />

              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating ? "text-gold fill-gold" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Body */}
                <p className="text-xs md:text-sm text-gray-300 font-light leading-relaxed italic mb-6">
                  "{t.content}"
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gold/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-burgundy-deep to-charcoal border border-gold/25 flex items-center justify-center font-serif text-gold font-bold text-sm uppercase shadow-inner group-hover:border-gold/45 transition-colors">
                  {t.name.substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-white tracking-wide group-hover:text-gold transition-colors">{t.name}</h4>
                  <p className="text-[10px] text-gold/75 tracking-wider uppercase font-sans font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Accordion Trigger */}
        <div className="text-center">
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-transparent hover:bg-white/5 border border-gold/30 hover:border-gold text-xs uppercase tracking-widest text-gold hover:text-white rounded transition-all cursor-pointer font-sans font-semibold inline-flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Leave an Atelier Review</span>
            </button>
          ) : (
            <div className="bg-onyx border border-gold/15 max-w-xl mx-auto p-6 md:p-8 rounded-xl text-left relative shadow-2xl">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider mb-5 pb-2 border-b border-gold/10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Submit Your Experience</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Fatou Jobe"
                      className="w-full bg-charcoal text-white rounded border border-gold/10 px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Role / Event</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Groom / Special Guest"
                      className="w-full bg-charcoal text-white rounded border border-gold/10 px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Star Rating</label>
                  <div className="flex gap-2.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 transition-transform hover:scale-110 ${
                            star <= rating ? "text-gold fill-gold" : "text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Review Content</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe the tailor fit, embroidery quality, customer communication, or overall look of your garment..."
                    className="w-full bg-charcoal text-white rounded border border-gold/10 px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-gold"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 bg-transparent text-gray-400 hover:text-white text-[11px] uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-black font-bold text-[11px] uppercase tracking-wider rounded hover:gold-glow cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    {loading ? "Saving..." : "Submit Review"}
                  </button>
                </div>
              </form>

              {/* Success confirmation popup */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-onyx/98 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center rounded-xl"
                  >
                    <CheckCircle className="w-10 h-10 text-gold mb-2" />
                    <h4 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Review Submitted!</h4>
                    <p className="text-xs text-gray-400 mt-1">Thank you for sharing your experience. We appreciate your loyalty to King Ash Design.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
