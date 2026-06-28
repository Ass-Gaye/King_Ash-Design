import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Check, Ruler, Sparkles, Info, HelpCircle } from "lucide-react";

interface HowToMeasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  values: {
    chest?: string;
    waist?: string;
    hips?: string;
    shoulder?: string;
    sleeves?: string;
    length?: string;
  };
  onChange: (name: string, value: string) => void;
}

interface MeasurementStep {
  id: string;
  fieldName: "chest" | "waist" | "hips" | "shoulder" | "sleeves" | "length";
  title: string;
  subtitle: string;
  description: string;
  tailorTip: string;
  placeholder: string;
  svgHighlight: (active: boolean) => React.ReactNode;
}

export default function HowToMeasureModal({ isOpen, onClose, values, onChange }: HowToMeasureModalProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps: MeasurementStep[] = [
    {
      id: "chest",
      fieldName: "chest",
      title: "Chest Size",
      subtitle: "Fullest part of your chest",
      description: "Place the tape measure under your arms and wrap it around the widest, fullest part of your chest. Keep your chest relaxed, stand natural, and breathe normally. Ensure the tape is level all the way around your back.",
      tailorTip: "Keep one finger flat between the tape measure and your chest to guarantee perfect comfortable breathing room in your final Kaftan or Agbada.",
      placeholder: "e.g. 40",
      svgHighlight: (active) => (
        <svg viewBox="0 0 200 320" className="w-full h-full text-gold/30">
          {/* Base Mannequin Body Silhouette */}
          <path
            d="M50 300 L150 300 L140 260 L145 200 L150 120 L135 70 L120 50 L110 50 L108 30 L92 30 L90 50 L80 50 L65 70 L50 120 L55 200 L60 260 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-800 transition-colors duration-300"
          />
          {/* Mannequin Stand */}
          <line x1="100" y1="300" x2="100" y2="315" stroke="currentColor" strokeWidth="2" className="text-gray-800" />
          <path d="M70 315 L130 315" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gray-800" />

          {/* Chest Guide line (Glowing gold) */}
          <ellipse
            cx="100"
            cy="115"
            rx="50"
            ry="10"
            fill="none"
            stroke={active ? "url(#gold-glow)" : "rgba(223, 178, 108, 0.2)"}
            strokeWidth={active ? "3" : "1"}
            strokeDasharray={active ? "4 2" : "none"}
            className={active ? "animate-[dash_10s_linear_infinite]" : ""}
          />
          {/* Pointer tag */}
          {active && (
            <>
              <line x1="150" y1="115" x2="175" y2="115" stroke="#DFB76C" strokeWidth="1" />
              <circle cx="150" cy="115" r="3" fill="#DFB76C" />
              <text x="180" y="119" fill="#F8E7C5" className="text-[10px] font-mono" textAnchor="start">CHEST</text>
            </>
          )}
        </svg>
      )
    },
    {
      id: "waist",
      fieldName: "waist",
      title: "Waistline",
      subtitle: "Where your trousers sit comfortable",
      description: "Wrap the tape measure horizontally around your waist, exactly where you normally wear the waistband of your trousers. Keep your abdomen natural—do not suck in or puff out your stomach.",
      tailorTip: "Traditional African trousers use tie-strings or tailored waistbands. Measure where you tie your waist comfortably to ensure perfect, secure draping.",
      placeholder: "e.g. 34",
      svgHighlight: (active) => (
        <svg viewBox="0 0 200 320" className="w-full h-full text-gold/30">
          {/* Base Mannequin */}
          <path
            d="M50 300 L150 300 L140 260 L145 200 L150 120 L135 70 L120 50 L110 50 L108 30 L92 30 L90 50 L80 50 L65 70 L50 120 L55 200 L60 260 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-800"
          />
          {/* Stand */}
          <line x1="100" y1="300" x2="100" y2="315" stroke="currentColor" strokeWidth="2" className="text-gray-800" />
          <path d="M70 315 L130 315" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gray-800" />

          {/* Waist Guide line (Glowing gold) */}
          <ellipse
            cx="100"
            cy="180"
            rx="45"
            ry="9"
            fill="none"
            stroke={active ? "url(#gold-glow)" : "rgba(223, 178, 108, 0.2)"}
            strokeWidth={active ? "3" : "1"}
            strokeDasharray={active ? "4 2" : "none"}
            className={active ? "animate-[dash_10s_linear_infinite]" : ""}
          />
          {/* Pointer tag */}
          {active && (
            <>
              <line x1="145" y1="180" x2="175" y2="180" stroke="#DFB76C" strokeWidth="1" />
              <circle cx="145" cy="180" r="3" fill="#DFB76C" />
              <text x="180" y="184" fill="#F8E7C5" className="text-[10px] font-mono" textAnchor="start">WAIST</text>
            </>
          )}
        </svg>
      )
    },
    {
      id: "hips",
      fieldName: "hips",
      title: "Hips & Seat",
      subtitle: "Fullest part of your hips",
      description: "Stand straight with your heels together. Guide the measuring tape horizontally around the absolute widest part of your hips and seat.",
      tailorTip: "Empty your pockets of keys, wallets, and phones completely, and avoid wearing exceptionally bulky jeans or thick garments while measuring.",
      placeholder: "e.g. 38",
      svgHighlight: (active) => (
        <svg viewBox="0 0 200 320" className="w-full h-full text-gold/30">
          {/* Base Mannequin */}
          <path
            d="M50 300 L150 300 L140 260 L145 200 L150 120 L135 70 L120 50 L110 50 L108 30 L92 30 L90 50 L80 50 L65 70 L50 120 L55 200 L60 260 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-800"
          />
          {/* Stand */}
          <line x1="100" y1="300" x2="100" y2="315" stroke="currentColor" strokeWidth="2" className="text-gray-800" />
          <path d="M70 315 L130 315" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gray-800" />

          {/* Hips Guide line (Glowing gold) */}
          <ellipse
            cx="100"
            cy="230"
            rx="48"
            ry="10"
            fill="none"
            stroke={active ? "url(#gold-glow)" : "rgba(223, 178, 108, 0.2)"}
            strokeWidth={active ? "3" : "1"}
            strokeDasharray={active ? "4 2" : "none"}
            className={active ? "animate-[dash_10s_linear_infinite]" : ""}
          />
          {/* Pointer tag */}
          {active && (
            <>
              <line x1="148" y1="230" x2="175" y2="230" stroke="#DFB76C" strokeWidth="1" />
              <circle cx="148" cy="230" r="3" fill="#DFB76C" />
              <text x="180" y="234" fill="#F8E7C5" className="text-[10px] font-mono" textAnchor="start">HIPS</text>
            </>
          )}
        </svg>
      )
    },
    {
      id: "shoulder",
      fieldName: "shoulder",
      title: "Shoulder Width",
      subtitle: "Bone-to-bone shoulder span",
      description: "Measure across your upper back from the very tip of one shoulder bone (the prominent joint where your arm connects) straight across the curvature of your neck base, to the tip of the opposite shoulder bone.",
      tailorTip: "If measuring alone, locate a formal business shirt that fits you perfectly. Measure directly from the shoulder seam on the left, straight across to the shoulder seam on the right.",
      placeholder: "e.g. 18",
      svgHighlight: (active) => (
        <svg viewBox="0 0 200 320" className="w-full h-full text-gold/30">
          {/* Base Mannequin */}
          <path
            d="M50 300 L150 300 L140 260 L145 200 L150 120 L135 70 L120 50 L110 50 L108 30 L92 30 L90 50 L80 50 L65 70 L50 120 L55 200 L60 260 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-800"
          />
          {/* Stand */}
          <line x1="100" y1="300" x2="100" y2="315" stroke="currentColor" strokeWidth="2" className="text-gray-800" />
          <path d="M70 315 L130 315" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gray-800" />

          {/* Shoulder Width line (Glowing gold arrow across shoulders) */}
          {active && (
            <>
              <path
                d="M66 70 Q100 66 134 70"
                fill="none"
                stroke="url(#gold-glow)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="66" cy="70" r="4.5" fill="#DFB76C" className="animate-pulse" />
              <circle cx="134" cy="70" r="4.5" fill="#DFB76C" className="animate-pulse" />
              {/* Pointer tag */}
              <line x1="134" y1="70" x2="175" y2="70" stroke="#DFB76C" strokeWidth="1" />
              <text x="180" y="74" fill="#F8E7C5" className="text-[10px] font-mono" textAnchor="start">SHOULDER</text>
            </>
          )}
        </svg>
      )
    },
    {
      id: "sleeves",
      fieldName: "sleeves",
      title: "Sleeve Length",
      subtitle: "From shoulder tip to wrist bone",
      description: "Start from the same prominent shoulder bone tip (where you ended the shoulder measurement). Guide the tape down along the outer curve of your arm, past your elbow, to the knobby wrist bone.",
      tailorTip: "Keep your arm slightly bent at the elbow when measuring. If your arm is locked perfectly straight, the sleeve will ride up and feel short when you bend your arms to dine or pray.",
      placeholder: "e.g. 25",
      svgHighlight: (active) => (
        <svg viewBox="0 0 200 320" className="w-full h-full text-gold/30">
          {/* Base Mannequin with Arm Outlines */}
          <path
            d="M50 300 L150 300 L140 260 L145 200 L150 120 L135 70 L120 50 L110 50 L108 30 L92 30 L90 50 L80 50 L65 70 L50 120 L55 200 L60 260 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-800"
          />
          {/* Left sleeve arm drawing */}
          <path
            d="M65 70 L48 115 L40 180 L36 215"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-800"
          />
          {/* Stand */}
          <line x1="100" y1="300" x2="100" y2="315" stroke="currentColor" strokeWidth="2" className="text-gray-800" />
          <path d="M70 315 L130 315" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gray-800" />

          {/* Sleeve measurement line (Glowing gold down arm path) */}
          {active && (
            <>
              <path
                d="M65 70 L48 115 L40 180 L36 215"
                fill="none"
                stroke="url(#gold-glow)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="4 2"
                className="animate-[dash_10s_linear_infinite]"
              />
              <circle cx="65" cy="70" r="4.5" fill="#DFB76C" />
              <circle cx="36" cy="215" r="4.5" fill="#DFB76C" className="animate-pulse" />
              {/* Pointer tag */}
              <line x1="36" y1="215" x2="100" y2="215" stroke="#DFB76C" strokeWidth="1" strokeDasharray="2 2" />
              <text x="105" y="219" fill="#F8E7C5" className="text-[10px] font-mono" textAnchor="start">SLEEVE LENGTH</text>
            </>
          )}
        </svg>
      )
    },
    {
      id: "length",
      fieldName: "length",
      title: "Total Garment Length",
      subtitle: "From collar base to desired hem",
      description: "Place the measuring tape at the highest point of your shoulder (right next to the base of your neck). Let the tape hang straight down the front of your chest to the level you wish your garment to end.",
      tailorTip: "For majestic Gambian Grand Boubous or full-length Kaftans, we recommend measuring down to the top of your shoes (ankle bone). For tunics, measure down to the knee or mid-thigh.",
      placeholder: "e.g. 58",
      svgHighlight: (active) => (
        <svg viewBox="0 0 200 320" className="w-full h-full text-gold/30">
          {/* Full-length Mannequin outline */}
          <path
            d="M50 300 L150 300 L140 260 L145 200 L150 120 L135 70 L120 50 L110 50 L108 30 L92 30 L90 50 L80 50 L65 70 L50 120 L55 200 L60 260 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-800"
          />
          {/* Stand */}
          <line x1="100" y1="300" x2="100" y2="315" stroke="currentColor" strokeWidth="2" className="text-gray-800" />
          <path d="M70 315 L130 315" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gray-800" />

          {/* Full height line */}
          {active && (
            <>
              <line
                x1="86"
                y1="50"
                x2="86"
                y2="285"
                stroke="url(#gold-glow)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="4 2"
                className="animate-[dash_10s_linear_infinite]"
              />
              <circle cx="86" cy="50" r="4.5" fill="#DFB76C" />
              <circle cx="86" cy="285" r="4.5" fill="#DFB76C" className="animate-pulse" />
              {/* Pointer tag */}
              <line x1="86" y1="260" x2="175" y2="260" stroke="#DFB76C" strokeWidth="1" />
              <text x="180" y="264" fill="#F8E7C5" className="text-[10px] font-mono" textAnchor="start">TOTAL LENGTH</text>
            </>
          )}
        </svg>
      )
    }
  ];

  const activeStep = steps[activeStepIndex];

  const handleNext = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Dark luxury glass overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md"
          />

          {/* Content container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-b from-charcoal/95 to-onyx border border-gold/25 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative z-10 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[800px]"
          >
            {/* Elegant horizontal gold accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-burgundy-deep to-gold-dark z-20" />

            {/* Left Column: Visual Guide and Steps List */}
            <div className="md:col-span-5 bg-black/40 border-r border-gold/10 p-6 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-full">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Ruler className="w-5 h-5 text-gold" />
                  <span className="font-serif text-sm font-bold uppercase tracking-widest text-white">
                    Measure Guide
                  </span>
                </div>

                {/* Steps Navigation Sidebar List */}
                <div className="space-y-2.5">
                  {steps.map((s, idx) => {
                    const isCompleted = !!values[s.fieldName];
                    const isActive = idx === activeStepIndex;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActiveStepIndex(idx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? "bg-burgundy-deep/35 border-gold text-white"
                            : isCompleted
                            ? "bg-charcoal border-gold/10 text-gold-hover"
                            : "bg-transparent border-transparent text-gray-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                            isActive
                              ? "bg-gold text-black"
                              : isCompleted
                              ? "bg-burgundy-deep text-gold"
                              : "bg-neutral-900 border border-gold/10"
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="font-serif font-bold uppercase tracking-wider">{s.title}</span>
                        </div>
                        {isCompleted && <Check className="w-4 h-4 text-gold flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mini instructions */}
              <div className="hidden md:flex items-start gap-2.5 p-3.5 bg-neutral-950/40 rounded-lg border border-gold/5 mt-6">
                <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed text-gray-400">
                  Values are automatically saved and populated directly into your bespoke booking sheet.
                </p>
              </div>
            </div>

            {/* Right Column: Step content, SVG and input form */}
            <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-full">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-neutral-900/60 rounded-full transition-colors z-20 cursor-pointer"
                title="Close guide"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Define definitions once for reusable gradients across SVGs */}
              <svg className="hidden">
                <defs>
                  <linearGradient id="gold-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#DFB76C" />
                    <stop offset="50%" stopColor="#F8E7C5" />
                    <stop offset="100%" stopColor="#A67D38" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Main Step Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-grow">
                {/* Visual mannequin container */}
                <div className="sm:col-span-5 bg-neutral-950/55 rounded-xl border border-gold/10 p-4 h-56 sm:h-72 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-radial-gradient from-burgundy-deep/10 via-transparent to-transparent opacity-60" />
                  {activeStep.svgHighlight(true)}
                </div>

                {/* Info block */}
                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold bg-burgundy-deep/40 px-2.5 py-1 border border-gold/15 rounded">
                      Step {activeStepIndex + 1} of 6
                    </span>
                    <h3 className="font-serif text-xl font-black text-white uppercase tracking-wider mt-3">
                      {activeStep.title}
                    </h3>
                    <p className="text-xs text-gold-hover font-mono mt-0.5">{activeStep.subtitle}</p>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-light">
                    {activeStep.description}
                  </p>

                  <div className="p-3 bg-neutral-950/60 rounded-lg border-l-2 border-gold text-[11px] leading-relaxed text-gray-400">
                    <span className="text-gold font-bold uppercase tracking-wider block text-[9px] mb-0.5">King Ash Tailor Tip:</span>
                    {activeStep.tailorTip}
                  </div>

                  {/* Measurement input direct entry */}
                  <div className="pt-2">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 font-bold">
                      Enter Dimension (Inches)
                    </label>
                    <div className="relative w-44">
                      <input
                        type="text"
                        placeholder={activeStep.placeholder}
                        value={values[activeStep.fieldName] || ""}
                        onChange={(e) => onChange(activeStep.fieldName, e.target.value)}
                        className="w-full bg-neutral-950 text-white rounded border border-gold/25 px-3 py-2.5 text-center text-sm font-bold focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold/30 placeholder-gray-600 font-mono"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] uppercase font-mono text-gold/60">
                        Inches
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action and Navigation bar */}
              <div className="flex items-center justify-between border-t border-gold/10 pt-6 mt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={activeStepIndex === 0}
                  className="px-4 py-2 border border-gold/15 rounded text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-white hover:border-gold/35 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {activeStepIndex === steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gold text-black hover:bg-gold-hover border border-gold rounded text-xs uppercase tracking-widest font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg hover:shadow-gold/10"
                  >
                    <span>Finish Guide</span>
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-burgundy-deep text-white hover:bg-burgundy-deep/80 border border-gold/30 rounded text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
