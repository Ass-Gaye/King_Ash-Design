import { Scissors, Sparkles, Heart, Briefcase, RefreshCw, MessageCircle, FileText, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface ServicesSectionProps {
  onNavigate: (section: string) => void;
  traditionalImage: string;
  weddingImage: string;
  corporateImage: string;
  womensImage: string;
}

export default function ServicesSection({ onNavigate, traditionalImage, weddingImage, corporateImage, womensImage }: ServicesSectionProps) {
  const serviceList = [
    {
      id: "s1",
      title: "Traditional African Wear",
      desc: "Authentic, majestic West African traditional wear for special occasions. We specialize in grand boubous, custom embroidered Agbadas, kaftans, and matching sets utilizing premium Bazin, damask, and brocade fabrics.",
      details: "Detailed embroidery patterns, hand-tailored cuffs, structural collar lining, matching accessories.",
      icon: Sparkles,
      image: traditionalImage
    },
    {
      id: "s2",
      title: "Wedding & Bridal Attire",
      desc: "Prestige bespoke wedding dresses, luxury West African bridal koutas, and custom grooms' suits. We ensure your couple matching themes are executed with absolute luxury, intricate laces, and custom gold thread embroidery.",
      details: "Full measurements consultations, custom lace inserts, trail structuring, hand-beaded detailing.",
      icon: Heart,
      image: weddingImage
    },
    {
      id: "s3",
      title: "Corporate Bespoke Suiting",
      desc: "Sharp, customized modern suiting, double-breasted blazers, trousers, and skirts tailored specifically for professional elegance. We fuse classic corporate frames with beautiful, subtle African fabric accents.",
      details: "Italian canvassed lining, surgeon's cuffs, customized lining options, sharp custom fit.",
      icon: Briefcase,
      image: corporateImage
    },
    {
      id: "s4",
      title: "Custom Tailoring & Couture",
      desc: "Have a design from a magazine or an original sketch? Our master tailors transform your creative ideas, fashion lookbooks, and sketches into gorgeous physical garments with a pristine custom finish.",
      details: "Sketch review, drape patterns drafting, mockup fit trials, individual size tracking.",
      icon: Scissors,
      image: womensImage
    }
  ];

  const auxiliaryServices = [
    {
      title: "Expert Alterations",
      desc: "Perfect resizing, shortening, tapering, or remodeling of your valued existing wardrobe to achieve an absolute premium fit.",
      icon: RefreshCw
    },
    {
      title: "Private Fashion Consultations",
      desc: "One-on-one sessions in our Latrikunda studio or online to select fabrics, explore embroidery styles, and sketch custom silhouettes.",
      icon: MessageCircle
    },
    {
      title: "Custom Premium Embroidery",
      desc: "Unrivaled high-density hand and machine computer embroidery on Bazins, kaftans, caps, and formal uniform sets.",
      icon: FileText
    }
  ];

  return (
    <section id="services" className="py-24 bg-charcoal/40 border-t border-gold/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold font-sans">Craft & Services</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white uppercase mt-2">
            Our Tailoring <span className="gold-text-shimmer">Services</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          <p className="text-gray-400 font-light text-sm mt-3">
            Handcrafted with absolute precision in Latrikunda Sabiji, customized to your exact requirements.
          </p>
        </div>

        {/* Featured Service Cards */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {serviceList.map((service, index) => (
            <div
              key={service.id}
              className="bg-gradient-to-br from-charcoal to-onyx border border-gold/15 hover:border-gold/35 rounded-xl overflow-hidden shadow-2xl hover:shadow-[0_8px_30px_rgba(223,178,87,0.08)] transition-all duration-300 flex flex-col md:flex-row group"
            >
              {/* Image Column */}
              <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-onyx via-transparent to-transparent" />
                <div className="absolute top-4 left-4 p-2 bg-burgundy-deep/85 border border-gold/30 rounded shadow-md">
                  <service.icon className="w-5 h-5 text-gold" />
                </div>
              </div>

              {/* Text Column */}
              <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-white tracking-wide group-hover:text-gold transition-colors mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-300 font-light leading-relaxed mb-4">
                    {service.desc}
                  </p>
                  
                  {/* Premium Bullet details */}
                  <div className="p-4 bg-onyx/50 rounded-lg border-l-2 border-gold text-[11px] text-gray-300 font-sans tracking-wide leading-relaxed font-light shadow-inner">
                    <span className="font-bold text-gold uppercase block text-[9px] tracking-widest mb-1">Couture Elements</span>
                    {service.details}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate("booking")}
                  className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-hover uppercase tracking-widest w-fit border-b border-transparent hover:border-gold transition-all cursor-pointer"
                >
                  <span>Book this service</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Auxiliary Services Bento */}
        <div className="pt-16 border-t border-gold/10">
          <div className="text-center mb-10">
            <h3 className="font-serif text-lg md:text-xl font-bold uppercase tracking-wider text-white">
              Specialized Fashion Solutions
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {auxiliaryServices.map((as, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-gradient-to-b from-charcoal/80 to-onyx border border-gold/10 hover:border-gold/30 hover:shadow-[0_4px_15px_rgba(223,178,87,0.05)] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded bg-burgundy-deep/15 text-gold group-hover:bg-burgundy-deep/25 transition-colors border border-gold/10">
                    <as.icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-white group-hover:text-gold transition-colors">
                    {as.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  {as.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
