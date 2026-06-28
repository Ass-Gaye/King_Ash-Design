import React, { useState } from "react";
import { Search, Loader2, CheckCircle, Package, Scissors, Check, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TrackingSectionProps {
  onTrackOrder: (trackingId: string) => Promise<any>;
}

export default function TrackingSection({ onTrackOrder }: TrackingSectionProps) {
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<any | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError("");
    setOrderStatus(null);

    try {
      const data = await onTrackOrder(trackingId);
      setOrderStatus(data);
    } catch (err: any) {
      setError(err.message || "Invalid tracking code. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Pending Verification", status: "Pending", desc: "Design & materials review", icon: HelpCircle },
    { label: "In Active Tailoring", status: "In Progress", desc: "Embroidery drafting & cutting", icon: Scissors },
    { label: "Ready for Delivery", status: "Ready", desc: "Final press & lookbook checks", icon: CheckCircle },
    { label: "Delivered to Client", status: "Delivered", desc: "Aesthetic fit completed", icon: Package }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Pending": return 0;
      case "In Progress": return 1;
      case "Ready": return 2;
      case "Delivered": return 3;
      default: return 0;
    }
  };

  const currentIdx = orderStatus ? getStepIndex(orderStatus.status) : 0;

  return (
    <section id="tracking" className="py-24 bg-onyx border-t border-gold/10 relative overflow-hidden">
      {/* Decorative background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-burgundy-deep/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold font-sans">Active Progress Tracker</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white uppercase mt-2">
            Track <span className="gold-text-shimmer">Order Status</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          <p className="text-gray-400 font-light text-sm mt-3">
            Keep track of your custom clothing. Enter your King Ash tracking ID below to check active cutting, embroidery, and delivery phases.
          </p>
        </div>

        {/* Tracker Search Bar Box */}
        <div className="bg-gradient-to-b from-charcoal/90 to-onyx border border-gold/15 p-6 md:p-8 rounded-xl shadow-2xl hover:shadow-[0_4px_25px_rgba(223,178,87,0.05)] mb-8 transition-all duration-300">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking ID (e.g. KA-93821)"
                className="w-full bg-onyx text-white rounded border border-gold/15 pl-11 pr-4 py-3.5 text-sm uppercase tracking-widest focus:outline-hidden focus:border-gold font-mono"
              />
              <Search className="w-5 h-5 text-gold/60 absolute left-4.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-black font-semibold text-xs uppercase tracking-widest rounded transition-all hover:gold-glow flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <span>Track Status</span>
              )}
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-500 font-sans">
            <span>💡 Try active demo IDs:</span>
            <button
              onClick={() => setTrackingId("KA-93821")}
              className="text-gold-hover hover:underline bg-onyx px-2 py-0.5 border border-gold/10 rounded font-mono"
            >
              KA-93821
            </button>
            <button
              onClick={() => setTrackingId("KA-48201")}
              className="text-gold-hover hover:underline bg-onyx px-2 py-0.5 border border-gold/10 rounded font-mono"
            >
              KA-48201
            </button>
          </div>
        </div>

        {/* Response Stage */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-900/15 border border-red-500/30 text-red-200 text-xs text-center rounded-lg font-sans"
            >
              {error}
            </motion.div>
          )}

          {orderStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-gradient-to-b from-charcoal to-onyx border border-gold/20 p-6 md:p-10 rounded-xl shadow-2xl relative shadow-[0_8px_30px_rgba(223,178,87,0.07)]"
            >
              {/* Header summary info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gold/15 mb-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold font-sans">Verification Details</span>
                  <h3 className="font-serif text-xl font-bold text-white uppercase mt-0.5">
                    Order {orderStatus.trackingId}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Client: <span className="text-white font-medium">{orderStatus.fullName}</span> • Garment: <span className="text-white font-medium">{orderStatus.garmentType}</span>
                  </p>
                </div>
                <div className="px-3.5 py-1.5 bg-burgundy-deep/40 border border-gold/30 text-gold-hover rounded font-mono text-xs uppercase tracking-wider">
                  Status: {orderStatus.status}
                </div>
              </div>

              {/* Graphical Stepper */}
              <div className="relative pt-4 pb-8">
                {/* Connector Line background */}
                <div className="absolute top-10 left-6 right-6 h-0.5 bg-neutral-800 z-0 hidden md:block" />
                {/* Active connector cover */}
                <div
                  className="absolute top-10 left-6 h-0.5 bg-gold z-0 hidden md:block transition-all duration-700"
                  style={{ width: `${(currentIdx / (steps.length - 1)) * 94}%` }}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                  {steps.map((step, idx) => {
                    const completed = idx <= currentIdx;
                    const active = idx === currentIdx;
                    return (
                      <div key={idx} className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3.5">
                        {/* Circle Icon */}
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            completed
                              ? "bg-gold text-black border-gold shadow-lg shadow-gold/15"
                              : "bg-onyx text-gray-500 border-neutral-800"
                          } ${active ? "ring-4 ring-gold/20 animate-pulse" : ""}`}
                        >
                          {completed && idx < currentIdx ? (
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          ) : (
                            <step.icon className="w-5 h-5" />
                          )}
                        </div>

                        {/* Title text */}
                        <div className="md:pt-1">
                          <h4
                            className={`text-sm font-semibold tracking-wider ${
                              completed ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-gray-400 font-light mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Details */}
              <div className="mt-6 pt-6 border-t border-gold/10 grid sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 bg-onyx/40 border border-gold/5 rounded-lg">
                  <span className="block text-gray-500 uppercase tracking-wider text-[10px]">Booking Date</span>
                  <span className="text-white font-medium text-sm mt-0.5 block">
                    {new Date(orderStatus.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="p-4 bg-onyx/40 border border-gold/5 rounded-lg">
                  <span className="block text-gray-500 uppercase tracking-wider text-[10px]">Expected Target Delivery</span>
                  <span className="text-gold-hover font-medium text-sm mt-0.5 block">
                    {orderStatus.preferredDeliveryDate
                      ? new Date(orderStatus.preferredDeliveryDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
                      : "To be coordinated via WhatsApp"}
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
