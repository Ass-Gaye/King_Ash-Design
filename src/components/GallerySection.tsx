import { useState } from "react";
import { Maximize2, X, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GalleryItem } from "../types";

interface GallerySectionProps {
  items: GalleryItem[];
}

export default function GallerySection({ items }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    "All",
    "Traditional",
    "Wedding",
    "Corporate",
    "Womens",
    "Mens",
    "Custom"
  ];

  const getLabel = (cat: string) => {
    switch (cat) {
      case "All": return "All Creations";
      case "Traditional": return "Traditional Wear";
      case "Wedding": return "Wedding Collection";
      case "Corporate": return "Corporate & Suits";
      case "Womens": return "Women's Fashion";
      case "Mens": return "Men's Fashion";
      case "Custom": return "Custom Designs";
      default: return cat;
    }
  };

  const filteredItems = selectedCategory === "All"
    ? items
    : items.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleOpenLightbox = (imageUrl: string) => {
    const idx = items.findIndex(item => item.imageUrl === imageUrl);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      const prev = (lightboxIndex - 1 + items.length) % items.length;
      setLightboxIndex(prev);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      const next = (lightboxIndex + 1) % items.length;
      setLightboxIndex(next);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-onyx border-t border-gold/10 relative">
      {/* Background flare */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-burgundy-deep/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold font-sans">Visual Portfolio</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white uppercase mt-2">
            The Lookbook <span className="gold-text-shimmer">Gallery</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          <p className="text-gray-400 font-light text-sm mt-3">
            A showcase of bespoke excellence. Filter through our signature collections and custom-tailored projects.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4.5 py-2 text-xs uppercase tracking-wider rounded font-sans transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-gradient-to-r from-gold to-gold-dark text-black font-semibold shadow-lg shadow-gold/10"
                    : "bg-charcoal text-gray-400 hover:text-white hover:bg-neutral-900 border border-gold/5 hover:border-gold/20"
                }`}
              >
                {getLabel(category)}
              </button>
            );
          })}
        </div>

        {/* Masonry-Style Grid Display */}
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center text-gray-500 flex flex-col items-center justify-center gap-2"
            >
              <AlertCircle className="w-10 h-10 text-gold/50" />
              <p className="font-serif italic text-lg text-gray-400">No showcase items in this category yet.</p>
              <p className="text-xs text-gray-500 font-sans">Check back soon for new haute couture releases!</p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  className="group bg-charcoal rounded-lg overflow-hidden border border-gold/10 hover:border-gold/30 hover:gold-glow-hover transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  {/* Image Stage */}
                  <div className="relative h-80 overflow-hidden cursor-pointer" onClick={() => handleOpenLightbox(item.imageUrl)}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark luxury card gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />
                    
                    {/* Float tags */}
                    <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                      <span className="px-2 py-1 text-[9px] uppercase tracking-wider bg-burgundy-deep/90 border border-gold/30 text-gold font-bold rounded">
                        {getLabel(item.category)}
                      </span>
                      {item.featured && (
                        <span className="px-2 py-1 text-[9px] uppercase tracking-wider bg-gold text-black font-bold rounded flex items-center gap-0.5 shadow">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    {/* Hover full view button overlay */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                      <button className="p-3 bg-gold text-black rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform cursor-pointer">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details Card Drawer */}
                  <div className="p-4 border-t border-gold/5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white tracking-wide mb-1 group-hover:text-gold transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-[10px] text-gold/60 font-mono mt-3 uppercase tracking-widest text-right">
                      King Ash Atelier
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Interactive Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 p-2 bg-neutral-900 border border-gold/30 text-gold hover:text-white rounded-full transition-all hover:bg-neutral-800 cursor-pointer z-50"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative max-w-4xl w-full flex flex-col items-center gap-4">
                {/* Main Lightbox Frame */}
                <div className="relative aspect-3/4 max-h-[70vh] rounded-lg overflow-hidden border border-gold/20 shadow-2xl">
                  <img
                    src={items[lightboxIndex].imageUrl}
                    alt={items[lightboxIndex].title}
                    className="max-w-full max-h-[70vh] object-contain"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category overlay */}
                  <span className="absolute top-4 left-4 px-2.5 py-1 text-xs font-bold uppercase tracking-widest bg-burgundy-deep text-gold border border-gold/30 rounded">
                    {getLabel(items[lightboxIndex].category)}
                  </span>
                </div>

                {/* Left/Right controls */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none">
                  <button
                    onClick={handlePrev}
                    className="p-3 bg-neutral-900/80 hover:bg-neutral-800 text-gold hover:text-white border border-gold/20 rounded-full transition-all pointer-events-auto cursor-pointer"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-3 bg-neutral-900/80 hover:bg-neutral-800 text-gold hover:text-white border border-gold/20 rounded-full transition-all pointer-events-auto cursor-pointer"
                  >
                    →
                  </button>
                </div>

                {/* Subtitle / Details Card below Image */}
                <div className="text-center max-w-xl">
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-gold-hover tracking-wide">
                    {items[lightboxIndex].title}
                  </h3>
                  <p className="text-xs text-gray-300 font-light leading-relaxed mt-2.5">
                    {items[lightboxIndex].description}
                  </p>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-gold/50 block mt-4">
                    Bespoke Craftsmanship • The Gambia
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
