import React, { useState, useEffect } from "react";
import {
  Lock, LayoutDashboard, Inbox, Scissors, Image, Settings, LogOut, Search,
  Filter, CheckCircle, RefreshCw, Trash2, ShieldCheck, Sparkles, Plus,
  FileText, ArrowDownToLine, PhoneCall, Mail, MapPin, Upload
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CustomOrder, GalleryItem, InquiryMessage, Testimonial, WebsiteSettings } from "../types";

interface AdminPanelProps {
  onClose: () => void;
  orders: CustomOrder[];
  gallery: GalleryItem[];
  inquiries: InquiryMessage[];
  testimonials: Testimonial[];
  settings: WebsiteSettings;
  onUpdateOrderStatus: (id: string, status: string) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
  onUpdateInquiryStatus: (id: string, status: "Pending" | "Resolved") => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
  onAddGalleryItem: (item: any) => Promise<void>;
  onDeleteGalleryItem: (id: string) => Promise<void>;
  onDeleteTestimonial: (id: string) => Promise<void>;
  onUpdateSettings: (settings: Partial<WebsiteSettings>) => Promise<void>;
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onLogout: () => Promise<void>;
  isLoggedIn: boolean;
}

export default function AdminPanel({
  onClose, orders, gallery, inquiries, testimonials, settings,
  onUpdateOrderStatus, onDeleteOrder, onUpdateInquiryStatus, onDeleteInquiry,
  onAddGalleryItem, onDeleteGalleryItem, onDeleteTestimonial, onUpdateSettings,
  onLogin, onLogout, isLoggedIn
}: AdminPanelProps) {
  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Nav state inside dashboard
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "gallery" | "inquiries" | "testimonials" | "settings">("dashboard");

  // Filter/Search states
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");
  const [galleryCategory, setGalleryCategory] = useState("All");

  // Gallery Creation form state
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryDesc, setNewGalleryDesc] = useState("");
  const [newGalleryCategory, setNewGalleryCategory] = useState("Traditional");
  const [newGalleryBase64, setNewGalleryBase64] = useState("");
  const [newGalleryFeatured, setNewGalleryFeatured] = useState(false);
  const [galleryUploadLoading, setGalleryUploadLoading] = useState(false);

  // Settings modification states
  const [editSettings, setEditSettings] = useState<Partial<WebsiteSettings>>({});

  useEffect(() => {
    if (isLoggedIn) {
      setEditSettings({ ...settings });
    }
  }, [isLoggedIn, settings]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoginLoading(true);
    setLoginError("");
    try {
      const ok = await onLogin(email, password);
      if (!ok) {
        setLoginError("Incorrect administrative credentials.");
      }
    } catch (err: any) {
      setLoginError(err.message || "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await onUpdateOrderStatus(id, newStatus);
    } catch (e) {
      alert("Failed to update order status");
    }
  };

  const handleDeleteOrderClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer order? This action is irreversible.")) {
      try {
        await onDeleteOrder(id);
      } catch (e) {
        alert("Failed to delete order");
      }
    }
  };

  const handleResolveInquiry = async (id: string, currentStatus: string) => {
    try {
      const targetStatus = currentStatus === "Pending" ? "Resolved" : "Pending";
      await onUpdateInquiryStatus(id, targetStatus);
    } catch (e) {
      alert("Failed to resolve inquiry");
    }
  };

  const handleDeleteInquiryClick = async (id: string) => {
    if (window.confirm("Delete this customer inquiry?")) {
      try {
        await onDeleteInquiry(id);
      } catch (e) {
        alert("Failed to delete inquiry");
      }
    }
  };

  // Convert uploaded gallery image
  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Maximum image upload size is 10MB");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setNewGalleryBase64(reader.result as string);
      };
    }
  };

  const handleAddGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle || !newGalleryBase64) {
      alert("Title and image file are required");
      return;
    }

    setGalleryUploadLoading(true);
    try {
      await onAddGalleryItem({
        title: newGalleryTitle,
        description: newGalleryDesc,
        category: newGalleryCategory,
        base64Image: newGalleryBase64,
        featured: newGalleryFeatured
      });
      setNewGalleryTitle("");
      setNewGalleryDesc("");
      setNewGalleryBase64("");
      setNewGalleryFeatured(false);
      alert("Creations added to portfolio catalog successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to add portfolio item");
    } finally {
      setGalleryUploadLoading(false);
    }
  };

  const handleDeleteGalleryClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this creation from your Lookbook?")) {
      try {
        await onDeleteGalleryItem(id);
      } catch (e) {
        alert("Failed to delete creation");
      }
    }
  };

  const handleDeleteReviewClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer testimonial review?")) {
      try {
        await onDeleteTestimonial(id);
      } catch (e) {
        alert("Failed to delete review");
      }
    }
  };

  const handleUpdateSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdateSettings(editSettings);
      alert("Atelier Website Settings modified successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update settings");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch = o.fullName.toLowerCase().includes(orderSearch.toLowerCase()) || o.trackingId.toLowerCase().includes(orderSearch.toLowerCase());
    const matchFilter = orderFilter === "All" || o.status === orderFilter;
    return matchSearch && matchFilter;
  });

  const filteredGallery = galleryCategory === "All"
    ? gallery
    : gallery.filter(item => item.category === galleryCategory);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      {/* Outer Window Container */}
      <div className="bg-onyx border border-gold/15 w-full max-w-7xl rounded-xl min-h-[80vh] flex flex-col justify-between shadow-2xl overflow-hidden relative">
        
        {/* Top Header */}
        <div className="px-6 py-4.5 bg-charcoal border-b border-gold/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5.5 h-5.5 text-gold" />
            <span className="font-serif text-lg font-bold tracking-wider text-white">
              KING ASH ADMIN ATELIER CONTROL
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-neutral-900 border border-gold/25 hover:border-gold text-gold hover:text-white transition-all text-xs uppercase font-sans tracking-wider cursor-pointer"
          >
            Exit Workspace
          </button>
        </div>

        {/* Auth Screen or Dashboard Stage */}
        {!isLoggedIn ? (
          /* Login Dialog form */
          <div className="flex-grow flex items-center justify-center py-16 px-4">
            <div className="w-full max-w-md bg-charcoal border border-gold/15 rounded-xl p-6 md:p-8 shadow-inner relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-dark" />
              <div className="flex flex-col items-center text-center mb-6">
                <div className="p-3 bg-burgundy-deep/20 rounded-full border border-gold/30 text-gold mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">Atelier Security Gate</h3>
                <p className="text-xs text-gray-400 mt-1">Please enter your authorized administrative email & password to access tailoring logs.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@kingash.com"
                    className="w-full bg-onyx text-white rounded border border-gold/10 px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Pass Phrase</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-onyx text-white rounded border border-gold/10 px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-gold"
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded bg-red-900/15 border border-red-500/40 text-red-200 text-xs">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 bg-gradient-to-r from-gold to-gold-dark text-black font-bold text-xs uppercase tracking-widest rounded hover:gold-glow transition-all cursor-pointer"
                >
                  {loginLoading ? "Authorizing..." : "Authorize Access"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gold/5 text-center text-[10px] text-gray-500 font-mono">
                DEFAULT CREDS: admin@kingash.com / KingAshDesign2026!
              </div>
            </div>
          </div>
        ) : (
          /* Main Dashboard Layout */
          <div className="flex-grow flex flex-col md:flex-row h-[70vh]">
            
            {/* Sidebar Navigation */}
            <div className="md:w-64 bg-charcoal/40 border-r border-gold/10 flex flex-col justify-between p-4 flex-shrink-0">
              <div className="space-y-1.5">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full text-left px-3.5 py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                    activeTab === "dashboard"
                      ? "bg-burgundy-deep/30 text-gold border-l-2 border-gold font-bold"
                      : "text-gray-400 hover:bg-charcoal hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                  <span>Overview stats</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-3.5 py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                    activeTab === "orders"
                      ? "bg-burgundy-deep/30 text-gold border-l-2 border-gold font-bold"
                      : "text-gray-400 hover:bg-charcoal hover:text-white"
                  }`}
                >
                  <Scissors className="w-4.5 h-4.5" />
                  <span>Customer Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`w-full text-left px-3.5 py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                    activeTab === "gallery"
                      ? "bg-burgundy-deep/30 text-gold border-l-2 border-gold font-bold"
                      : "text-gray-400 hover:bg-charcoal hover:text-white"
                  }`}
                >
                  <Image className="w-4.5 h-4.5" />
                  <span>Lookbooks ({gallery.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("inquiries")}
                  className={`w-full text-left px-3.5 py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                    activeTab === "inquiries"
                      ? "bg-burgundy-deep/30 text-gold border-l-2 border-gold font-bold"
                      : "text-gray-400 hover:bg-charcoal hover:text-white"
                  }`}
                >
                  <Inbox className="w-4.5 h-4.5" />
                  <span>Customer Inquiries ({inquiries.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("testimonials")}
                  className={`w-full text-left px-3.5 py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                    activeTab === "testimonials"
                      ? "bg-burgundy-deep/30 text-gold border-l-2 border-gold font-bold"
                      : "text-gray-400 hover:bg-charcoal hover:text-white"
                  }`}
                >
                  <Sparkles className="w-4.5 h-4.5" />
                  <span>Testimonials ({testimonials.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-3.5 py-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-2.5 cursor-pointer transition-all ${
                    activeTab === "settings"
                      ? "bg-burgundy-deep/30 text-gold border-l-2 border-gold font-bold"
                      : "text-gray-400 hover:bg-charcoal hover:text-white"
                  }`}
                >
                  <Settings className="w-4.5 h-4.5" />
                  <span>Atelier Settings</span>
                </button>
              </div>

              {/* Log out */}
              <button
                onClick={onLogout}
                className="w-full text-left px-3.5 py-3 rounded text-xs uppercase tracking-wider text-red-400 hover:bg-red-950/20 hover:text-red-300 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Log out session</span>
              </button>
            </div>

            {/* Main Stage Content (Scrollable) */}
            <div className="flex-grow p-6 overflow-y-auto bg-onyx">
              
              {/* TAB 1: OVERVIEW PANEL */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">Atelier Performance Analytics</h2>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold bg-burgundy-deep/20 px-2.5 py-1 border border-gold/20 rounded">
                      Live Database Sync
                    </span>
                  </div>

                  {/* Quick summary grid indicators */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-lg bg-charcoal border border-gold/10 shadow-md">
                      <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Gross Orders Booked</span>
                      <span className="block text-3xl font-serif text-gold font-bold mt-1.5">{orders.length}</span>
                      <span className="text-[9px] font-mono text-gray-400">Traditional & bespoke</span>
                    </div>

                    <div className="p-5 rounded-lg bg-charcoal border border-gold/10 shadow-md">
                      <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Pending Orders</span>
                      <span className="block text-3xl font-serif text-white font-bold mt-1.5">
                        {orders.filter(o => o.status === "Pending").length}
                      </span>
                      <span className="text-[9px] font-mono text-red-400">Awaiting WhatsApp chats</span>
                    </div>

                    <div className="p-5 rounded-lg bg-charcoal border border-gold/10 shadow-md">
                      <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Lookbook creations</span>
                      <span className="block text-3xl font-serif text-white font-bold mt-1.5">{gallery.length}</span>
                      <span className="text-[9px] font-mono text-gold">Visible to web audience</span>
                    </div>

                    <div className="p-5 rounded-lg bg-charcoal border border-gold/10 shadow-md">
                      <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Client Inquiries</span>
                      <span className="block text-3xl font-serif text-white font-bold mt-1.5">
                        {inquiries.filter(i => i.status === "Pending").length}
                      </span>
                      <span className="text-[9px] font-mono text-gold-hover">Active message queue</span>
                    </div>
                  </div>

                  {/* Recent activities boards */}
                  <div className="grid lg:grid-cols-2 gap-6 pt-2">
                    {/* Orders tracker overview */}
                    <div className="p-5 rounded-lg bg-charcoal border border-gold/10">
                      <h3 className="font-serif text-base font-bold text-white border-b border-gold/5 pb-2.5 mb-4 uppercase tracking-wider">
                        Recent orders log
                      </h3>
                      {orders.length === 0 ? (
                        <p className="text-xs text-gray-500 py-6 text-center italic">No orders registered yet</p>
                      ) : (
                        <div className="space-y-3">
                          {orders.slice(0, 3).map(o => (
                            <div key={o.id} className="p-3 bg-onyx/60 rounded border border-gold/5 flex justify-between items-center text-xs">
                              <div>
                                <span className="font-mono text-gold font-bold mr-2">{o.trackingId}</span>
                                <span className="text-white font-medium">{o.fullName}</span>
                                <p className="text-[10px] text-gray-400 mt-0.5">{o.garmentType}</p>
                              </div>
                              <span className="px-2 py-0.5 bg-burgundy-deep/30 border border-gold/20 text-[10px] text-gold rounded font-mono uppercase">
                                {o.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Messages log */}
                    <div className="p-5 rounded-lg bg-charcoal border border-gold/10">
                      <h3 className="font-serif text-base font-bold text-white border-b border-gold/5 pb-2.5 mb-4 uppercase tracking-wider">
                        Inquiries backlog
                      </h3>
                      {inquiries.length === 0 ? (
                        <p className="text-xs text-gray-500 py-6 text-center italic">No customer inquiries submitted</p>
                      ) : (
                        <div className="space-y-3">
                          {inquiries.slice(0, 3).map(i => (
                            <div key={i.id} className="p-3 bg-onyx/60 rounded border border-gold/5 flex justify-between items-center text-xs">
                              <div>
                                <span className="text-white font-medium block">{i.name}</span>
                                <span className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{i.message}</span>
                              </div>
                              <span className={`px-2 py-0.5 text-[9px] font-mono rounded ${
                                i.status === "Pending" ? "bg-red-950/40 text-red-400 border border-red-500/10" : "bg-amber-950/40 text-amber-400 border border-amber-500/10"
                              }`}>
                                {i.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT LOGS */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gold/10 pb-4">
                    <h2 className="font-serif text-xl font-bold text-white uppercase">Customer Orders Dashboard</h2>
                    
                    {/* Search / Filters tools */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search client/ID..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="bg-charcoal text-white rounded border border-gold/15 pl-8 pr-3 py-1.5 text-xs font-sans w-48 focus:outline-hidden"
                        />
                        <Search className="w-3.5 h-3.5 text-gold absolute left-2.5 top-2.5" />
                      </div>

                      <select
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                        className="bg-charcoal text-white border border-gold/15 text-xs px-2.5 py-1.5 rounded"
                      >
                        <option value="All">All statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Ready">Ready</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders Listing Board */}
                  {filteredOrders.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-16 italic">No customer orders matching selection criteria.</p>
                  ) : (
                    <div className="space-y-5">
                      {filteredOrders.map((o) => (
                        <div key={o.id} className="bg-charcoal rounded-xl border border-gold/15 overflow-hidden p-5 space-y-4">
                          
                          {/* Top Row: Info Summary */}
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-gold/10">
                            <div>
                              <span className="font-mono text-gold font-bold text-sm bg-onyx px-2 py-0.5 border border-gold/10 rounded mr-2">
                                {o.trackingId}
                              </span>
                              <span className="font-serif text-base font-bold text-white">{o.fullName}</span>
                              <p className="text-[10px] text-gray-400 mt-1">
                                Booked: {new Date(o.createdAt).toLocaleString()} • Event Date: <span className="text-white font-medium">{o.eventDate || "N/A"}</span>
                              </p>
                            </div>

                            {/* Status and Action operations */}
                            <div className="flex items-center gap-2.5">
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                                className="bg-onyx text-gold-hover border border-gold/20 text-xs px-2 py-1 rounded focus:outline-hidden"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Ready">Ready</option>
                                <option value="Delivered">Delivered</option>
                              </select>

                              <button
                                onClick={() => handleDeleteOrderClick(o.id)}
                                className="p-2 bg-red-950/20 hover:bg-red-900 border border-red-500/20 hover:border-red-500 rounded text-red-400 hover:text-white transition-all cursor-pointer"
                                title="Delete Order Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Info specifications grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                            <div className="p-3 bg-onyx/40 rounded border border-white/5">
                              <span className="block text-gray-500 text-[10px] uppercase">Garment Type</span>
                              <span className="text-white font-medium mt-0.5 block">{o.garmentType}</span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">({o.gender} fit cut)</span>
                            </div>

                            <div className="p-3 bg-onyx/40 rounded border border-white/5">
                              <span className="block text-gray-500 text-[10px] uppercase">Contact Details</span>
                              <span className="text-white font-medium mt-0.5 block truncate flex items-center gap-1">
                                <Mail className="w-3 h-3 text-gold" /> {o.email}
                              </span>
                              <span className="text-gray-300 block mt-0.5 flex items-center gap-1 font-mono">
                                <PhoneCall className="w-3 h-3 text-gold" /> {o.phoneNumber}
                              </span>
                            </div>

                            <div className="p-3 bg-onyx/40 rounded border border-white/5">
                              <span className="block text-gray-500 text-[10px] uppercase">Fabric Preference & Target Budget</span>
                              <span className="text-white font-medium mt-0.5 block">{o.fabricPreference || "Merchant Selection"}</span>
                              <span className="text-gold-hover block font-bold mt-0.5">{o.budgetRange}</span>
                            </div>

                            <div className="p-3 bg-onyx/40 rounded border border-white/5">
                              <span className="block text-gray-500 text-[10px] uppercase">Delivery Target</span>
                              <span className="text-white font-medium mt-0.5 block">
                                {o.preferredDeliveryDate ? new Date(o.preferredDeliveryDate).toLocaleDateString() : "Flexible / Coordinate"}
                              </span>
                              <span className="text-[10px] text-gray-400 block truncate">{o.deliveryAddress || "Self collection"}</span>
                            </div>
                          </div>

                          {/* Measurements Sub-drawer */}
                          <div className="p-3.5 bg-onyx/75 border border-gold/10 rounded-lg text-xs space-y-1.5">
                            <div className="flex justify-between items-center border-b border-white/5 pb-1 mb-1.5">
                              <span className="font-serif text-gold font-bold uppercase tracking-wider text-[10px]">Measurements Profile ({o.sizeType})</span>
                              {o.sizeType === "Custom" && (
                                <span className="text-[9px] text-gray-400 font-mono uppercase">Standard Inches</span>
                              )}
                            </div>
                            {o.sizeType === "Custom" ? (
                              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center font-mono text-[11px]">
                                <div className="bg-charcoal px-2 py-1 rounded border border-gold/5">
                                  <span className="text-gray-500 block text-[9px]">CHEST</span>
                                  <span className="text-white font-bold">{o.chest || "N/A"} in</span>
                                </div>
                                <div className="bg-charcoal px-2 py-1 rounded border border-gold/5">
                                  <span className="text-gray-500 block text-[9px]">WAIST</span>
                                  <span className="text-white font-bold">{o.waist || "N/A"} in</span>
                                </div>
                                <div className="bg-charcoal px-2 py-1 rounded border border-gold/5">
                                  <span className="text-gray-500 block text-[9px]">HIPS</span>
                                  <span className="text-white font-bold">{o.hips || "N/A"} in</span>
                                </div>
                                <div className="bg-charcoal px-2 py-1 rounded border border-gold/5">
                                  <span className="text-gray-500 block text-[9px]">SHOULDER</span>
                                  <span className="text-white font-bold">{o.shoulder || "N/A"} in</span>
                                </div>
                                <div className="bg-charcoal px-2 py-1 rounded border border-gold/5">
                                  <span className="text-gray-500 block text-[9px]">SLEEVES</span>
                                  <span className="text-white font-bold">{o.sleeves || "N/A"} in</span>
                                </div>
                                <div className="bg-charcoal px-2 py-1 rounded border border-gold/5">
                                  <span className="text-gray-500 block text-[9px]">LENGTH</span>
                                  <span className="text-white font-bold">{o.length || "N/A"} in</span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[11px] text-gray-400 italic">Client selected standard fitting profiles. Fitting will be coordinated at Latrikunda shop.</p>
                            )}

                            {o.customSizeNotes && (
                              <p className="text-[11px] text-gray-300 font-light pt-1 border-t border-white/5">
                                <span className="font-semibold text-gold">Sizing comments:</span> "{o.customSizeNotes}"
                              </p>
                            )}
                          </div>

                          {/* Extra info & sketches uploaded */}
                          {(o.additionalNotes || (o.attachments && o.attachments.length > 0)) && (
                            <div className="grid sm:grid-cols-2 gap-4 text-xs">
                              {o.additionalNotes && (
                                <div className="p-3 bg-onyx/20 rounded border border-white/5">
                                  <span className="block text-gray-500 text-[10px] uppercase font-bold mb-1">Additional specifications notes</span>
                                  <p className="text-gray-300 font-light italic leading-relaxed">"{o.additionalNotes}"</p>
                                </div>
                              )}

                              {o.attachments && o.attachments.length > 0 && (
                                <div className="p-3 bg-onyx/20 rounded border border-white/5">
                                  <span className="block text-gray-500 text-[10px] uppercase font-bold mb-1">Client Uploaded References ({o.attachments.length})</span>
                                  <div className="space-y-1.5 mt-1.5">
                                    {o.attachments.map((attach: any, aIdx: number) => (
                                      <div key={aIdx} className="flex justify-between items-center p-2 bg-charcoal rounded text-[11px] border border-gold/5">
                                        <span className="truncate max-w-[200px] text-gray-300">{attach.name}</span>
                                        <a
                                          href={attach.dataUrl}
                                          download={attach.name}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-gold hover:text-white flex items-center gap-1 font-semibold uppercase text-[9px]"
                                        >
                                          <ArrowDownToLine className="w-3.5 h-3.5" />
                                          <span>Download File</span>
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: GALLERY LOOKBOOK MANAGEMENT */}
              {activeTab === "gallery" && (
                <div className="space-y-6">
                  <div className="border-b border-gold/10 pb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="font-serif text-xl font-bold text-white uppercase">Portfolio LOOKBOOK Catalog</h2>
                    <select
                      value={galleryCategory}
                      onChange={(e) => setGalleryCategory(e.target.value)}
                      className="bg-charcoal text-white border border-gold/15 text-xs px-2.5 py-1.5 rounded"
                    >
                      <option value="All">All Categories</option>
                      <option value="Traditional">Traditional</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Womens">Womens</option>
                      <option value="Mens">Mens</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8">
                    {/* Add portfolio form column */}
                    <div className="lg:col-span-4 bg-charcoal border border-gold/15 p-5 rounded-lg h-fit space-y-4">
                      <h3 className="font-serif text-base font-bold text-white border-b border-gold/5 pb-2 uppercase tracking-wider flex items-center gap-1">
                        <Plus className="w-4 h-4 text-gold" />
                        <span>Add New Creation</span>
                      </h3>

                      <form onSubmit={handleAddGallerySubmit} className="space-y-4 text-xs font-sans">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Creation Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Royal Indigo Kaftan Set"
                            value={newGalleryTitle}
                            onChange={(e) => setNewGalleryTitle(e.target.value)}
                            className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Catalog Category *</label>
                          <select
                            value={newGalleryCategory}
                            onChange={(e) => setNewGalleryCategory(e.target.value)}
                            className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                          >
                            <option value="Traditional">Traditional Wear</option>
                            <option value="Wedding">Wedding Collection</option>
                            <option value="Corporate">Corporate & Suits</option>
                            <option value="Womens">Women's Fashion</option>
                            <option value="Mens">Men's Fashion</option>
                            <option value="Custom">Custom Designs</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Upload Photo File *</label>
                          <div className="border border-dashed border-gold/15 bg-onyx p-4 text-center rounded relative cursor-pointer hover:border-gold/50 transition-all flex flex-col items-center gap-1.5">
                            <Upload className="w-5 h-5 text-gold/60" />
                            <span className="text-[10px] text-gray-400">Select file (Max 10MB)</span>
                            <input
                              type="file"
                              required
                              onChange={handleGalleryFileSelect}
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                          {newGalleryBase64 && (
                            <div className="mt-2 text-[10px] text-gold flex items-center gap-1 font-medium font-sans">
                              ✓ Image Loaded successfully. Ready to post.
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Lookbook Description</label>
                          <textarea
                            rows={3}
                            placeholder="Describe fabrics, embroidery patterns, thread styling details..."
                            value={newGalleryDesc}
                            onChange={(e) => setNewGalleryDesc(e.target.value)}
                            className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="newGalleryFeatured"
                            checked={newGalleryFeatured}
                            onChange={(e) => setNewGalleryFeatured(e.target.checked)}
                            className="accent-gold h-4 w-4 rounded"
                          />
                          <label htmlFor="newGalleryFeatured" className="text-[10px] uppercase tracking-wider text-gray-300 font-bold select-none cursor-pointer">
                            Mark as Featured creation
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={galleryUploadLoading}
                          className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-dark text-black font-bold text-xs uppercase tracking-widest rounded hover:gold-glow transition-all"
                        >
                          {galleryUploadLoading ? "Uploading to Server..." : "Post Lookbook creation"}
                        </button>
                      </form>
                    </div>

                    {/* Listing grid column */}
                    <div className="lg:col-span-8">
                      {filteredGallery.length === 0 ? (
                        <p className="text-xs text-gray-500 italic py-12 text-center">No catalog items matching category criteria.</p>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {filteredGallery.map((item) => (
                            <div key={item.id} className="bg-charcoal rounded border border-gold/10 overflow-hidden relative group">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-36 object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="p-2.5 text-xs space-y-1">
                                <span className="px-1.5 py-0.5 bg-burgundy-deep/60 border border-gold/25 text-[9px] text-gold font-bold rounded">
                                  {item.category}
                                </span>
                                <h4 className="font-serif font-bold text-white truncate mt-1">{item.title}</h4>
                                <p className="text-[10px] text-gray-400 line-clamp-1">{item.description}</p>
                              </div>

                              {/* Actions overlay on hover or top right */}
                              <button
                                onClick={() => handleDeleteGalleryClick(item.id)}
                                className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-red-900 text-red-400 hover:text-white rounded border border-gold/10 transition-all cursor-pointer"
                                title="Delete Catalog item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CLIENT INQUIRIES */}
              {activeTab === "inquiries" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-bold text-white uppercase border-b border-gold/10 pb-4">
                    Inquiries Messages backlog
                  </h2>

                  {inquiries.length === 0 ? (
                    <p className="text-xs text-gray-500 py-16 text-center italic">No customer inquiries recorded in database.</p>
                  ) : (
                    <div className="space-y-4 font-sans">
                      {inquiries.map((i) => (
                        <div key={i.id} className="p-5 bg-charcoal border border-gold/10 rounded-lg relative space-y-3">
                          
                          {/* Info header row */}
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gold/5 pb-2 gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-white">{i.name}</h4>
                              <p className="text-[10px] text-gray-400">
                                Submitted: {new Date(i.createdAt).toLocaleString()} • Phone: {i.phone || "N/A"}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleResolveInquiry(i.id, i.status)}
                                className={`px-2.5 py-1 text-[10px] font-mono rounded border uppercase transition-all cursor-pointer ${
                                  i.status === "Pending"
                                    ? "bg-red-950/20 text-red-400 border-red-500/20 hover:border-red-500 hover:bg-red-900 hover:text-white"
                                    : "bg-burgundy-deep/40 text-gold-hover border-gold/30 hover:bg-burgundy-dark"
                                }`}
                              >
                                Status: {i.status}
                              </button>

                              <button
                                onClick={() => handleDeleteInquiryClick(i.id)}
                                className="p-1.5 bg-red-950/20 hover:bg-red-900 text-red-400 hover:text-white rounded border border-red-500/15 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Subject & Message details */}
                          <div className="text-xs space-y-1.5">
                            <span className="block font-bold text-gold uppercase tracking-wider text-[9px]">Subject: {i.subject}</span>
                            <p className="text-gray-300 font-light leading-relaxed whitespace-pre-line bg-onyx/40 p-3 rounded border border-white/5 italic">
                              "{i.message}"
                            </p>
                          </div>

                          {/* Quick Mail to Client link */}
                          <div className="text-right">
                            <a
                              href={`mailto:${i.email}?subject=RE: King Ash Design - ${i.subject}`}
                              className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-gold hover:text-white"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Draft Email Response</span>
                            </a>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: TESTIMONIAL REVIEWS MANAGEMENT */}
              {activeTab === "testimonials" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-bold text-white uppercase border-b border-gold/10 pb-4">
                    Client Testimonials Review Board
                  </h2>

                  {testimonials.length === 0 ? (
                    <p className="text-xs text-gray-500 py-16 text-center italic">No client reviews in the portfolio.</p>
                  ) : (
                    <div className="space-y-4 font-sans text-xs">
                      {testimonials.map((t) => (
                        <div key={t.id} className="p-4 bg-charcoal border border-gold/10 rounded flex justify-between items-start gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-white text-sm">{t.name}</span>
                              <span className="text-[9px] uppercase tracking-widest bg-burgundy-deep text-gold px-1.5 rounded">{t.role}</span>
                            </div>
                            <p className="italic font-light text-gray-300 leading-relaxed">"{t.content}"</p>
                            
                            {/* Stars rating display */}
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-sm ${i < t.rating ? "text-gold" : "text-gray-600"}`}>★</span>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteReviewClick(t.id)}
                            className="p-1.5 bg-red-950/20 hover:bg-red-900 text-red-400 hover:text-white border border-red-500/20 rounded cursor-pointer transition-all"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: WEBSITE SETTINGS EDITOR */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-bold text-white uppercase border-b border-gold/10 pb-4">
                    Website Settings & Content Editor
                  </h2>

                  <form onSubmit={handleUpdateSettingsSubmit} className="space-y-6 text-xs font-sans">
                    
                    {/* S1: Hero details */}
                    <div className="bg-charcoal p-5 rounded-lg border border-gold/10 space-y-4">
                      <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider pb-1.5 border-b border-white/5">
                        Homepage Hero Section Branding
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Primary Brand Title</label>
                          <input
                            type="text"
                            value={editSettings.heroTitle || ""}
                            onChange={(e) => setEditSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
                            className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Creative Tagline / Motto</label>
                          <input
                            type="text"
                            value={editSettings.heroTagline || ""}
                            onChange={(e) => setEditSettings(prev => ({ ...prev, heroTagline: e.target.value }))}
                            className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* S2: About Story details */}
                    <div className="bg-charcoal p-5 rounded-lg border border-gold/10 space-y-4">
                      <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider pb-1.5 border-b border-white/5">
                        Brand Heritage & Mission details
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Our Story Narrative</label>
                          <textarea
                            rows={4}
                            value={editSettings.aboutStory || ""}
                            onChange={(e) => setEditSettings(prev => ({ ...prev, aboutStory: e.target.value }))}
                            className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Atelier Mission Statement</label>
                            <textarea
                              rows={3}
                              value={editSettings.aboutMission || ""}
                              onChange={(e) => setEditSettings(prev => ({ ...prev, aboutMission: e.target.value }))}
                              className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Atelier Vision Statement</label>
                            <textarea
                              rows={3}
                              value={editSettings.aboutVision || ""}
                              onChange={(e) => setEditSettings(prev => ({ ...prev, aboutVision: e.target.value }))}
                              className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* S3: Contact details */}
                    <div className="bg-charcoal p-5 rounded-lg border border-gold/10 space-y-4">
                      <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider pb-1.5 border-b border-white/5">
                        Contact Info & Store Location coordinates
                      </h3>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Primary Phone Contact</label>
                          <input
                            type="text"
                            value={editSettings.phoneNumbers?.[0] || ""}
                            onChange={(e) => {
                              const nextPh = [...(editSettings.phoneNumbers || [])];
                              nextPh[0] = e.target.value;
                              setEditSettings(prev => ({ ...prev, phoneNumbers: nextPh }));
                            }}
                            className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Secondary Phone Contact</label>
                          <input
                            type="text"
                            value={editSettings.phoneNumbers?.[1] || ""}
                            onChange={(e) => {
                              const nextPh = [...(editSettings.phoneNumbers || [])];
                              nextPh[1] = e.target.value;
                              setEditSettings(prev => ({ ...prev, phoneNumbers: nextPh }));
                            }}
                            className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Dispatch WhatsApp Number</label>
                          <input
                            type="text"
                            value={editSettings.whatsappNumber || ""}
                            onChange={(e) => setEditSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                            className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Business Location Address</label>
                          <input
                            type="text"
                            value={editSettings.location || ""}
                            onChange={(e) => setEditSettings(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Primary Email inbox</label>
                          <input
                            type="text"
                            value={editSettings.emails?.[0] || ""}
                            onChange={(e) => {
                              const nextEm = [...(editSettings.emails || [])];
                              nextEm[0] = e.target.value;
                              setEditSettings(prev => ({ ...prev, emails: nextEm }));
                            }}
                            className="w-full bg-onyx text-white rounded border border-gold/10 px-3 py-2 text-xs focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit settings button */}
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-gold to-gold-dark text-black font-bold text-xs uppercase tracking-widest rounded hover:gold-glow transition-all"
                    >
                      Save Atelier Website Content Settings
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Footer info block */}
        <div className="px-6 py-3 bg-charcoal/90 border-t border-gold/10 text-center text-[10px] text-gray-500 font-mono">
          © {new Date().getFullYear()} KING ASH ATELIER WORKSPACE • THE GAMBIA
        </div>

      </div>
    </div>
  );
}
