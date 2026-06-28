import { useState, useEffect } from "react";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CustomOrder, GalleryItem, InquiryMessage, Testimonial, WebsiteSettings } from "./types";
import { api } from "./utils/api";

// Import modular components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import GallerySection from "./components/GallerySection";
import BookingForm from "./components/BookingForm";
import TrackingSection from "./components/TrackingSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  // Page section state
  const [currentSection, setCurrentSection] = useState("home");
  
  // Data Sync States
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Admin Access States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Asset mapping (Generated image outputs from filesystem)
  const heroImage = "/src/assets/images/king_ash_hero_1782620125446.jpg";
  const traditionalImage = "/src/assets/images/traditional_wear_1782620142530.jpg";
  const weddingImage = "/src/assets/images/wedding_attire_1782620155878.jpg";
  const corporateImage = "/src/assets/images/corporate_wear_1782620168834.jpg";
  const womensImage = "/src/assets/images/womens_fashion_1782620180047.jpg";

  // Bootstrap initial server data
  useEffect(() => {
    const bootstrapData = async () => {
      setLoading(true);
      setError("");
      try {
        // Run initial parallel fetches
        const [loadedSettings, loadedGallery, loadedTestimonials] = await Promise.all([
          api.getSettings(),
          api.getGallery(),
          api.getTestimonials()
        ]);
        
        setSettings(loadedSettings);
        setGallery(loadedGallery);
        setTestimonials(loadedTestimonials);

        // Check if admin is already authenticated
        const authenticated = await api.checkSession();
        setIsAdminLoggedIn(authenticated);

        // If authenticated, fetch private admin logs
        if (authenticated) {
          const [loadedOrders, loadedInquiries] = await Promise.all([
            api.getOrders(),
            api.getInquiries()
          ]);
          setOrders(loadedOrders);
          setInquiries(loadedInquiries);
        }
      } catch (err: any) {
        console.error("Bootstrap error", err);
        setError("Failed to coordinate server connections. Check if backend is active.");
      } finally {
        setLoading(false);
      }
    };

    bootstrapData();
  }, []);

  // Sync private admin logs whenever logged state shifts
  useEffect(() => {
    const fetchAdminLogs = async () => {
      if (isAdminLoggedIn) {
        try {
          const [loadedOrders, loadedInquiries] = await Promise.all([
            api.getOrders(),
            api.getInquiries()
          ]);
          setOrders(loadedOrders);
          setInquiries(loadedInquiries);
        } catch (e) {
          console.error("Failed to sync private logs", e);
        }
      }
    };
    fetchAdminLogs();
  }, [isAdminLoggedIn]);

  // Section smooth scroll helper
  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Callback handlers for submissions
  const handleSubmitOrder = async (orderData: any) => {
    try {
      const res = await api.createOrder(orderData);
      if (res.success && res.order) {
        // If logged in, reload logs to display instantly in dashboard
        if (isAdminLoggedIn) {
          const updatedOrders = await api.getOrders();
          setOrders(updatedOrders);
        }
      }
      return res;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleSubmitInquiry = async (inquiryData: any) => {
    try {
      const ok = await api.addInquiry(inquiryData);
      if (ok && isAdminLoggedIn) {
        const updatedInq = await api.getInquiries();
        setInquiries(updatedInq);
      }
      return ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleSubmitReview = async (reviewData: any) => {
    try {
      const newReview = await api.addTestimonial(reviewData);
      setTestimonials(prev => [newReview, ...prev]);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // Administrative Dash Callbacks
  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const data = await api.login(email, pass);
      if (data.success) {
        setIsAdminLoggedIn(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAdminLoggedIn(false);
    setOrders([]);
    setInquiries([]);
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    const updated = await api.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: updated.status } : o));
  };

  const handleDeleteOrder = async (id: string) => {
    const ok = await api.deleteOrder(id);
    if (ok) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: "Pending" | "Resolved") => {
    const updated = await api.updateInquiry(id, status);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: updated.status } : i));
  };

  const handleDeleteInquiry = async (id: string) => {
    const ok = await api.deleteInquiry(id);
    if (ok) {
      setInquiries(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleAddGalleryItem = async (itemData: any) => {
    const newItem = await api.addGalleryItem(itemData);
    setGallery(prev => [newItem, ...prev]);
  };

  const handleDeleteGalleryItem = async (id: string) => {
    const ok = await api.deleteGalleryItem(id);
    if (ok) {
      setGallery(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    const ok = await api.deleteTestimonial(id);
    if (ok) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleUpdateSettings = async (settingsData: Partial<WebsiteSettings>) => {
    const ok = await api.updateSettings(settingsData);
    if (ok) {
      const refreshedSettings = await api.getSettings();
      setSettings(refreshedSettings);
    }
  };

  // Track order dispatcher (public view)
  const handleTrackOrder = async (trackingId: string) => {
    return api.trackOrder(trackingId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-onyx text-white flex flex-col items-center justify-center gap-4">
        <div className="relative p-3.5 bg-gradient-to-tr from-burgundy-deep to-charcoal border border-gold/40 rounded-full shadow-lg">
          <Loader2 className="w-10 h-10 text-gold animate-spin" />
        </div>
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold tracking-widest text-white uppercase block">
            KING ASH ATELIER
          </h1>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold block mt-0.5 animate-pulse">
            Loading Luxury Fashion Lookbooks...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-onyx text-white flex flex-col items-center justify-center p-6 text-center gap-3">
        <AlertCircle className="w-12 h-12 text-red-500 animate-bounce" />
        <h2 className="font-serif text-xl font-bold uppercase tracking-wider">Atelier Connection Fault</h2>
        <p className="text-xs text-gray-400 max-w-sm leading-relaxed">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2.5 bg-gold text-black text-xs font-bold uppercase tracking-widest rounded hover:gold-glow transition-all cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const activeSettings = settings || {
    heroTitle: "King Ash Design",
    heroTagline: "Custom Tailoring & Fashion Design Crafted with Excellence in The Gambia",
    aboutStory: "",
    aboutMission: "",
    aboutVision: "",
    phoneNumbers: ["+220 760 7728"],
    emails: ["niangass460@gmail.com"],
    location: "Latrikunda Sabiji, Jakabi, The Gambia",
    whatsappNumber: "+220 760 7728",
  };

  return (
    <div className="min-h-screen bg-onyx flex flex-col justify-between selection:bg-gold selection:text-black">
      {/* Invisible anchor target for scroll to top */}
      <div id="top-anchor" />

      {/* Persistent Visible Luxury Header Navbar */}
      <Navbar
        onNavigate={handleNavigate}
        currentSection={currentSection}
        settings={activeSettings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Single Page Sections */}
      <main className="flex-grow">
        {/* S1: Hero showcase */}
        <HeroSection
          onNavigate={handleNavigate}
          settings={activeSettings}
          heroImage={heroImage}
        />

        {/* S2: About & Story */}
        <AboutSection
          settings={activeSettings}
          traditionalImage={traditionalImage}
          womensImage={womensImage}
        />

        {/* S3: Tailoring Services */}
        <ServicesSection
          onNavigate={handleNavigate}
          traditionalImage={traditionalImage}
          weddingImage={weddingImage}
          corporateImage={corporateImage}
          womensImage={womensImage}
        />

        {/* S4: Portfolio Masonry Gallery Lookbook */}
        <GallerySection items={gallery} />

        {/* S5: Bespoke Custom Booking System Form */}
        <BookingForm
          settings={activeSettings}
          onSubmitOrder={handleSubmitOrder}
        />

        {/* S6: Client Order tracking stepper */}
        <TrackingSection onTrackOrder={handleTrackOrder} />

        {/* S7: Testimonials review board */}
        <TestimonialsSection
          items={testimonials}
          onSubmitReview={handleSubmitReview}
        />

        {/* S8: Contact form & Local Atelier Map */}
        <ContactSection
          settings={activeSettings}
          onSubmitInquiry={handleSubmitInquiry}
        />
      </main>

      {/* Main footer details */}
      <Footer
        settings={activeSettings}
        onNavigate={handleNavigate}
      />

      {/* Administrative Dashboard Overlay Panel */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel
            onClose={() => setIsAdminOpen(false)}
            orders={orders}
            gallery={gallery}
            inquiries={inquiries}
            testimonials={testimonials}
            settings={activeSettings}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onUpdateInquiryStatus={handleUpdateInquiryStatus}
            onDeleteInquiry={handleDeleteInquiry}
            onAddGalleryItem={handleAddGalleryItem}
            onDeleteGalleryItem={handleDeleteGalleryItem}
            onDeleteTestimonial={handleDeleteTestimonial}
            onUpdateSettings={handleUpdateSettings}
            onLogin={handleLogin}
            onLogout={handleLogout}
            isLoggedIn={isAdminLoggedIn}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
