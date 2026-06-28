import React, { useState, useRef } from "react";
import { Upload, Scissors, FileText, ChevronRight, MessageSquare, Sparkles, CheckCircle, AlertTriangle, AlertCircle, Ruler } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FileAttachment, WebsiteSettings } from "../types";
import HowToMeasureModal from "./HowToMeasureModal";

interface BookingFormProps {
  settings: WebsiteSettings;
  onSubmitOrder: (orderData: any) => Promise<{ success: boolean; order?: any }>;
}

export default function BookingForm({ settings, onSubmitOrder }: BookingFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    deliveryAddress: "",
    garmentType: "",
    gender: "Male",
    fabricPreference: "",
    sizeType: "Standard",
    chest: "",
    waist: "",
    hips: "",
    shoulder: "",
    sleeves: "",
    length: "",
    customSizeNotes: "",
    eventDate: "",
    preferredDeliveryDate: "",
    budgetRange: "D5,000 - D10,000",
    additionalNotes: ""
  });

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; trackingId?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMeasureModalOpen, setIsMeasureModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const budgetOptions = [
    "Under D5,000",
    "D5,000 - D10,000",
    "D10,000 - D15,000",
    "D15,000 - D25,000",
    "D25,000+",
    "Negotiable"
  ];

  const garmentTemplates = [
    "Traditional Grand Boubou",
    "Embroidered Agbada",
    "Bespoke Kaftan Set",
    "Luxury Bridal Gown",
    "Groom's Embroidered Suit",
    "Double-Breasted Corporate Blazer",
    "Custom Dress / Kaftan",
    "Alteration / Re-design"
  ];

  const handleMeasureModalChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle standard changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Convert File to base64
  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`File "${file.name}" exceeds the maximum limit of 10MB.`);
      return;
    }

    const validFormats = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validFormats.includes(file.type)) {
      alert(`File "${file.name}" has an unsupported format. Please upload JPG, PNG, WEBP, or PDF.`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAttachments(prev => [
        ...prev,
        {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl
        }
      ]);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(processFile);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(processFile);
    }
  };

  const handleSelectTemplate = (garment: string) => {
    setFormData(prev => ({ ...prev, garmentType: garment }));
  };

  // Submits to Server AND formats direct WhatsApp redirect
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.garmentType) {
      setErrorMessage("Please complete all required fields (Full Name, Email, Phone, and Garment Type).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        ...formData,
        attachments
      };

      // 1. Submit to Backend database (so Admin sees it in dashboard!)
      const result = await onSubmitOrder(payload);

      if (result.success && result.order) {
        const order = result.order;
        setSubmitResult({ success: true, trackingId: order.trackingId });

        // 2. Format a gorgeous message for WhatsApp dispatch!
        const whatsappMsg = generateWhatsAppMessage(order);
        const formattedWhatsApp = settings.whatsappNumber.replace(/[^0-9+]/g, "");
        const waUrl = `https://wa.me/${formattedWhatsApp}?text=${encodeURIComponent(whatsappMsg)}`;

        // Open WhatsApp in a new tab to complete order submission!
        setTimeout(() => {
          window.open(waUrl, "_blank");
        }, 1500);

        // Reset Form State
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          deliveryAddress: "",
          garmentType: "",
          gender: "Male",
          fabricPreference: "",
          sizeType: "Standard",
          chest: "",
          waist: "",
          hips: "",
          shoulder: "",
          sleeves: "",
          length: "",
          customSizeNotes: "",
          eventDate: "",
          preferredDeliveryDate: "",
          budgetRange: "D5,000 - D10,000",
          additionalNotes: ""
        });
        setAttachments([]);
      } else {
        setErrorMessage("We encountered an issue registering your order in our database. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to submit custom order. Please verify connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppMessage = (order: any) => {
    let msg = `👑 *NEW CUSTOM COUTURE BOOKING - KING ASH* 👑\n\n`;
    msg += `*Tracking ID:* ${order.trackingId}\n`;
    msg += `*Customer:* ${order.fullName}\n`;
    msg += `*Phone:* ${order.phoneNumber}\n`;
    msg += `*Email:* ${order.email}\n`;
    msg += `*Address:* ${order.deliveryAddress || "Not specified"}\n\n`;

    msg += `📋 *GARMENT DETAILS:*\n`;
    msg += `• *Garment Type:* ${order.garmentType}\n`;
    msg += `• *Gender Fit:* ${order.gender}\n`;
    msg += `• *Fabric Preference:* ${order.fabricPreference || "Merchant Choice"}\n`;
    msg += `• *Budget Target:* ${order.budgetRange}\n\n`;

    msg += `📐 *SIZING TYPE:* ${order.sizeType}\n`;
    if (order.sizeType === "Custom") {
      msg += `• *Chest:* ${order.chest || "N/A"} in\n`;
      msg += `• *Waist:* ${order.waist || "N/A"} in\n`;
      msg += `• *Hips:* ${order.hips || "N/A"} in\n`;
      msg += `• *Shoulder:* ${order.shoulder || "N/A"} in\n`;
      msg += `• *Sleeves:* ${order.sleeves || "N/A"} in\n`;
      msg += `• *Length:* ${order.length || "N/A"} in\n`;
      if (order.customSizeNotes) msg += `• *Sizing Notes:* ${order.customSizeNotes}\n`;
    } else {
      msg += `• _Standard Sizing Profile Selected. Client will do fitting in-atelier._\n`;
    }
    msg += `\n`;

    msg += `📅 *CALENDAR SCHEDULE:*\n`;
    msg += `• *Event Date:* ${order.eventDate || "Flexible"}\n`;
    msg += `• *Required Delivery:* ${order.preferredDeliveryDate || "Flexible"}\n\n`;

    if (order.additionalNotes) {
      msg += `💬 *ADDITIONAL SPECIFICATIONS:*\n"${order.additionalNotes}"\n\n`;
    }

    if (attachments.length > 0) {
      msg += `📎 *ATTACHED FILES:* ${attachments.length} reference file(s) uploaded online.\n`;
    }

    msg += `⚡ _Submitted from King Ash Digital Atelier. Opening WhatsApp thread for chat validation._`;
    return msg;
  };

  return (
    <section id="booking" className="py-24 bg-charcoal/40 border-t border-gold/10 relative">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold font-sans">Bespoke Fitting Studio</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white uppercase mt-2">
            Book Custom <span className="gold-text-shimmer">Order</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          <p className="text-gray-400 font-light text-sm mt-3">
            Design your ideal outfit. Fill out your measurement requirements, upload sketches, and instantly dispatch details to our master tailors via WhatsApp.
          </p>
        </div>

        {/* Outer Form Box */}
        <div className="bg-gradient-to-b from-charcoal to-onyx border border-gold/20 rounded-xl shadow-2xl overflow-hidden p-6 md:p-10 relative shadow-[0_8px_35px_rgba(223,178,87,0.06)]">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-burgundy-deep to-gold-dark" />

          {/* Form Quick Templates */}
          <div className="mb-10">
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold mb-3 font-sans">
              ✨ Tap to Quick-Select Garment Template:
            </label>
            <div className="flex flex-wrap gap-2">
              {garmentTemplates.map((t, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleSelectTemplate(t)}
                  className={`px-3 py-1.5 rounded text-xs tracking-wide border cursor-pointer transition-all ${
                    formData.garmentType === t
                      ? "bg-burgundy-deep text-gold border-gold"
                      : "bg-charcoal text-gray-400 border-gold/5 hover:border-gold/25 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Contact details */}
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-white border-b border-gold/10 pb-2 uppercase tracking-wider flex items-center gap-2">
                <span className="p-1 bg-burgundy-deep text-gold rounded text-xs font-sans">1</span>
                <span>Personal Details</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your first & last name"
                    className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-sm focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-sm focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                    Phone Number (WhatsApp Active) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. +220 760 7728"
                    className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-sm focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                    Delivery Address (The Gambia or Worldwide)
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="e.g. Kairaba Avenue, Fajara"
                    className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-sm focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Garment Specifications */}
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-white border-b border-gold/10 pb-2 uppercase tracking-wider flex items-center gap-2">
                <span className="p-1 bg-burgundy-deep text-gold rounded text-xs font-sans">2</span>
                <span>Garment Specifications</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                    Garment Design Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="garmentType"
                    required
                    value={formData.garmentType}
                    onChange={handleInputChange}
                    placeholder="e.g. Traditional Bazin Grand Boubou"
                    className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-sm focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                    Gender Specification (Cut/Fit style)
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-sm focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-sans"
                  >
                    <option value="Male">Men's Apparel Cut (Structured, masculine tailoring)</option>
                    <option value="Female">Women's Apparel Cut (Flowing, feminine drape)</option>
                    <option value="Other">Unisex / Neutral Fitting Cut</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                    Fabric Preference & Color
                  </label>
                  <input
                    type="text"
                    name="fabricPreference"
                    value={formData.fabricPreference}
                    onChange={handleInputChange}
                    placeholder="e.g. Rich Bazin Gold, Italian Wool, Damask, Silk"
                    className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-sm focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                    Budget Range Allocation (Dalasi D)
                  </label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleInputChange}
                    className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-sm focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-sans"
                  >
                    {budgetOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Measurements Collection */}
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-white border-b border-gold/10 pb-2 uppercase tracking-wider flex items-center gap-2">
                <span className="p-1 bg-burgundy-deep text-gold rounded text-xs font-sans">3</span>
                <span>Size & Measurements Profile</span>
              </h3>

              <div className="flex gap-4 p-1.5 bg-charcoal rounded w-fit border border-gold/5 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, sizeType: "Standard" }))}
                  className={`px-4 py-2 text-xs uppercase font-semibold rounded cursor-pointer transition-all ${
                    formData.sizeType === "Standard"
                      ? "bg-gold text-black shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Standard Fit / In-Store Fitting
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, sizeType: "Custom" }))}
                  className={`px-4 py-2 text-xs uppercase font-semibold rounded cursor-pointer transition-all ${
                    formData.sizeType === "Custom"
                      ? "bg-gold text-black shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Submit Manual Sizing
                </button>
              </div>

              {formData.sizeType === "Standard" ? (
                <div className="p-4 bg-burgundy-deep/10 border border-gold/10 rounded-lg text-xs leading-relaxed text-gray-300">
                  <p className="font-semibold text-gold mb-1">💡 Standard Fitting & Tailor Verification:</p>
                  We will tailor standard size block profiles or welcome you to visit our **Latrikunda Sabiji shop (Jakabi)** for precise manual tailor recordings. You can also upload a measurement certificate/sheet below!
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gold/5 border border-gold/20 rounded-lg text-xs leading-relaxed text-gold-hover flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-gold flex-shrink-0" />
                      <span>Please supply values in **inches** for best measurement rendering. Ask a friend to assist you!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMeasureModalOpen(true)}
                      className="px-3.5 py-2 bg-burgundy-deep border border-gold/30 rounded text-[10px] uppercase tracking-widest font-bold text-white hover:border-gold hover:text-gold hover:shadow-[0_0_15px_rgba(223,178,108,0.15)] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Ruler className="w-3.5 h-3.5 text-gold" />
                      <span>How to Measure Guide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Chest</label>
                      <input
                        type="text"
                        name="chest"
                        value={formData.chest}
                        onChange={handleInputChange}
                        placeholder="e.g. 40"
                        className="w-full bg-charcoal text-white rounded border border-gold/10 px-3 py-2 text-xs text-center focus:outline-hidden focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Waist</label>
                      <input
                        type="text"
                        name="waist"
                        value={formData.waist}
                        onChange={handleInputChange}
                        placeholder="e.g. 34"
                        className="w-full bg-charcoal text-white rounded border border-gold/10 px-3 py-2 text-xs text-center focus:outline-hidden focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Hips</label>
                      <input
                        type="text"
                        name="hips"
                        value={formData.hips}
                        onChange={handleInputChange}
                        placeholder="e.g. 38"
                        className="w-full bg-charcoal text-white rounded border border-gold/10 px-3 py-2 text-xs text-center focus:outline-hidden focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Shoulder Width</label>
                      <input
                        type="text"
                        name="shoulder"
                        value={formData.shoulder}
                        onChange={handleInputChange}
                        placeholder="e.g. 18"
                        className="w-full bg-charcoal text-white rounded border border-gold/10 px-3 py-2 text-xs text-center focus:outline-hidden focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Sleeve Length</label>
                      <input
                        type="text"
                        name="sleeves"
                        value={formData.sleeves}
                        onChange={handleInputChange}
                        placeholder="e.g. 25"
                        className="w-full bg-charcoal text-white rounded border border-gold/10 px-3 py-2 text-xs text-center focus:outline-hidden focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Total Length</label>
                      <input
                        type="text"
                        name="length"
                        value={formData.length}
                        onChange={handleInputChange}
                        placeholder="e.g. 58"
                        className="w-full bg-charcoal text-white rounded border border-gold/10 px-3 py-2 text-xs text-center focus:outline-hidden focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">Custom Sizing Specifications / Comments</label>
                    <textarea
                      name="customSizeNotes"
                      rows={2}
                      value={formData.customSizeNotes}
                      onChange={handleInputChange}
                      placeholder="e.g. Broad chest fitting, relaxed sleeve cuff sizing, pants require high-waisted bands..."
                      className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-xs focus:outline-hidden focus:border-gold transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Calendar Dates */}
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-white border-b border-gold/10 pb-2 uppercase tracking-wider flex items-center gap-2">
                <span className="p-1 bg-burgundy-deep text-gold rounded text-xs font-sans">4</span>
                <span>Important Dates</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                    Wear Date / Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-sm focus:outline-hidden focus:border-gold transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                    Preferred Delivery Date (We recommend 5 days before your event)
                  </label>
                  <input
                    type="date"
                    name="preferredDeliveryDate"
                    value={formData.preferredDeliveryDate}
                    onChange={handleInputChange}
                    className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-sm focus:outline-hidden focus:border-gold transition-all font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Design Upload Feature (Sketches, references, sheets) */}
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-white border-b border-gold/10 pb-2 uppercase tracking-wider flex items-center gap-2">
                <span className="p-1 bg-burgundy-deep text-gold rounded text-xs font-sans">5</span>
                <span>Inspiration & Reference uploads</span>
              </h3>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gold/25 hover:border-gold/65 bg-charcoal/30 rounded-xl p-8 text-center cursor-pointer hover:bg-charcoal/50 transition-all flex flex-col items-center gap-3 relative group"
              >
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  className="hidden"
                />

                <div className="p-3.5 bg-burgundy-deep/20 rounded-full text-gold group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">Drag & drop files or click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP, or PDF (Max 10MB per file)</p>
                </div>
              </div>

              {/* Render Uploaded Attachments */}
              {attachments.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                  {attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-charcoal rounded-lg border border-gold/15 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-5 h-5 text-gold flex-shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-xs text-white font-medium truncate">{file.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="text-red-400 hover:text-red-600 font-serif text-xs p-1 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* S6: Notes */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                Additional Notes / Embroidery details / Specific styling
              </label>
              <textarea
                name="additionalNotes"
                rows={4}
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Include custom descriptions of styling pattern, gold vs black thread embroideries, buttons, specific lining fabrics, etc."
                className="w-full bg-charcoal text-white rounded border border-gold/15 px-4 py-3 text-sm focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-sans"
              />
            </div>

            {/* Error notifications */}
            {errorMessage && (
              <div className="p-4 rounded-lg bg-red-900/25 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form actions */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4.5 bg-gradient-to-r from-gold to-gold-dark text-black font-semibold text-xs uppercase tracking-[0.2em] rounded border border-gold hover:gold-glow transition-all flex items-center justify-center gap-2.5 shadow-xl ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-black animate-pulse" />
              <span>{isSubmitting ? "Dispatching Order Request..." : "Confirm & Dispatch via WhatsApp"}</span>
            </button>
          </form>

          {/* Success Dialog Modal */}
          <AnimatePresence>
            {submitResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30"
              >
                <div className="p-4 bg-burgundy-deep/20 rounded-full border border-gold text-gold mb-4 animate-bounce">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                  Order Registered Successfully!
                </h3>
                <p className="text-sm text-gold-hover mt-1 font-mono tracking-wider">
                  YOUR TRACKING ID: <span className="text-white font-bold bg-burgundy-deep/60 px-2 py-0.5 border border-gold/20 rounded">{submitResult.trackingId}</span>
                </p>
                <p className="text-xs text-gray-300 max-w-md mt-4 leading-relaxed font-light">
                  We have saved your bespoke requirements to our database. We are now **redirecting you to WhatsApp** with your prefilled form detail block to finalize fabric selections and fitting details directly with **King Ash**!
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSubmitResult(null)}
                    className="px-6 py-2.5 bg-neutral-900 border border-gold/30 hover:border-gold text-xs uppercase tracking-widest text-gold hover:text-white rounded transition-all cursor-pointer"
                  >
                    Close Window
                  </button>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9+]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 bg-burgundy-deep border border-gold/50 text-xs uppercase tracking-widest text-white font-bold rounded hover:gold-glow transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4 text-gold" />
                    <span>Open WhatsApp Manual Thread</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <HowToMeasureModal
        isOpen={isMeasureModalOpen}
        onClose={() => setIsMeasureModalOpen(false)}
        values={formData}
        onChange={handleMeasureModalChange}
      />
    </section>
  );
}
