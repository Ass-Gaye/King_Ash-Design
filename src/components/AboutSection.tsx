import { Shield, Sparkles, Award, Scissors, Check, Target, Eye } from "lucide-react";
import { motion } from "motion/react";
import { WebsiteSettings } from "../types";

interface AboutSectionProps {
  settings: WebsiteSettings;
  traditionalImage: string;
  womensImage: string;
}

export default function AboutSection({ settings, traditionalImage, womensImage }: AboutSectionProps) {
  const story = settings.aboutStory || "Founded with a passion for exquisite tailoring and high fashion, King Ash is the leading fashion house in The Gambia for luxury bespoke apparel. Owned and operated by a visionary Gambian entrepreneur, King Ash merges centuries-old West African design sensibilities with sharp modern silhouettes. Every stitch tells a story of elegance, power, and heritage.";
  const mission = settings.aboutMission || "To craft world-class, premium bespoke tailoring that celebrates individual expression and African elegance, establishing Gambian craftsmanship on the global fashion stage.";
  const vision = settings.aboutVision || "To be the ultimate luxury design house in West West Africa, synonymous with peerless fitting, exquisite custom embroidery, and revolutionary fashion design.";

  const benefits = [
    {
      title: "Master Craftsmanship",
      desc: "Our tailors possess decades of experience in West African traditional embroidery, draping, and contemporary European suiting.",
      icon: Scissors
    },
    {
      title: "Perfect Fitting Guarantee",
      desc: "We collect complete measurements or accept custom charts, building bespoke patterns that flatter your natural proportions perfectly.",
      icon: Award
    },
    {
      title: "Premium Fabrics Only",
      desc: "We source authentic high-grade Bazins, rich brocades, hand-woven Senegalese cottons, luxury laces, and top-tier Italian wools.",
      icon: Sparkles
    },
    {
      title: "Latrikunda Pride",
      desc: "Operating from the beating fashion heart of Latrikunda Sabiji, we provide rapid, reliable, and authentic custom fashion production.",
      icon: Shield
    }
  ];

  return (
    <section id="about" className="py-24 bg-onyx border-t border-gold/10 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-burgundy-deep/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold font-sans">Heritage & Vision</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white uppercase mt-2">
            The Story of <span className="gold-text-shimmer">King Ash</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Text Story Side */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-gold-hover tracking-wide">
              African Elegance & Modern Haute Couture
            </h3>
            
            <p className="text-gray-300 font-light leading-relaxed text-base md:text-lg">
              {story}
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {/* Mission Card */}
              <div className="p-6 rounded-lg bg-gradient-to-b from-charcoal to-onyx border border-gold/15 hover:border-gold/35 hover:shadow-[0_4px_20px_rgba(223,178,87,0.05)] transition-all duration-300 group">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-1.5 rounded bg-burgundy-deep/20 border border-gold/20 text-gold group-hover:border-gold/40 transition-all">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white tracking-wider group-hover:text-gold transition-colors">Our Mission</h4>
                </div>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  {mission}
                </p>
              </div>

              {/* Vision Card */}
              <div className="p-6 rounded-lg bg-gradient-to-b from-charcoal to-onyx border border-gold/15 hover:border-gold/35 hover:shadow-[0_4px_20px_rgba(223,178,87,0.05)] transition-all duration-300 group">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-1.5 rounded bg-burgundy-deep/20 border border-gold/20 text-gold group-hover:border-gold/40 transition-all">
                    <Eye className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white tracking-wider group-hover:text-gold transition-colors">Our Vision</h4>
                </div>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  {vision}
                </p>
              </div>
            </div>
          </div>

          {/* Luxury Visuals Side */}
          <div className="lg:col-span-5 grid grid-cols-12 gap-4">
            <div className="col-span-8 relative">
              <div className="absolute inset-0 border border-gold/30 translate-x-3 translate-y-3 rounded-lg z-0 pointer-events-none" />
              <img
                src={traditionalImage}
                alt="Traditional African Agbada Design"
                className="rounded-lg w-full h-80 object-cover z-10 relative shadow-2xl hover:scale-102 transition-transform duration-300 border border-gold/15"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="col-span-4 flex items-end">
              <img
                src={womensImage}
                alt="Elegant Womens Kaftan"
                className="rounded-lg w-full h-56 object-cover shadow-xl hover:scale-105 transition-transform duration-300 border border-gold/10"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Tailoring Expertise & Why Choose Grid */}
        <div className="pt-16 border-t border-gold/10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="font-serif text-xl md:text-2xl font-bold tracking-wide uppercase text-white">
              Why Discerning Clients Choose Us
            </h3>
            <p className="text-xs text-gray-400 tracking-wider font-light mt-2">
              Every detail engineered to present absolute prestige, structure, and elegance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-gradient-to-b from-charcoal/65 to-onyx/90 border border-gold/5 hover:border-gold/25 hover:bg-charcoal/70 transition-all duration-300 group shadow-lg"
              >
                <div className="p-3 bg-burgundy-deep/20 rounded-md border border-gold/10 w-fit mb-4 group-hover:border-gold/30 group-hover:bg-burgundy-deep/30 transition-all">
                  <b.icon className="w-5 h-5 text-gold" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white tracking-wide mb-2 group-hover:text-gold-hover transition-colors">
                  {b.title}
                </h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
