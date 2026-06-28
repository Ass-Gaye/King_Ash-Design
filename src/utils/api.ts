import { CustomOrder, GalleryItem, InquiryMessage, Testimonial, WebsiteSettings } from "../types";

const BASE_URL = ""; // Relative paths will resolve to the same host/port

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("king_ash_admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Website Settings
  async getSettings(): Promise<WebsiteSettings> {
    const res = await fetch(`${BASE_URL}/api/settings`);
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/settings`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return res.ok;
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch(`${BASE_URL}/api/gallery`);
    if (!res.ok) throw new Error("Failed to fetch gallery");
    return res.json();
  },

  async addGalleryItem(item: { title: string; description: string; category: string; base64Image?: string; featured?: boolean }): Promise<GalleryItem> {
    const res = await fetch(`${BASE_URL}/api/gallery`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add gallery item");
    }
    return res.json();
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/gallery/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.ok;
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch(`${BASE_URL}/api/testimonials`);
    if (!res.ok) throw new Error("Failed to fetch testimonials");
    return res.json();
  },

  async addTestimonial(testimonial: { name: string; role: string; content: string; rating: number }): Promise<Testimonial> {
    const res = await fetch(`${BASE_URL}/api/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testimonial)
    });
    if (!res.ok) throw new Error("Failed to submit testimonial");
    return res.json();
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/testimonials/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.ok;
  },

  // Inquiries
  async getInquiries(): Promise<InquiryMessage[]> {
    const res = await fetch(`${BASE_URL}/api/inquiries`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch inquiries");
    return res.json();
  },

  async addInquiry(inquiry: { name: string; email: string; phone?: string; subject?: string; message: string }): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry)
    });
    return res.ok;
  },

  async updateInquiry(id: string, status: "Pending" | "Resolved"): Promise<InquiryMessage> {
    const res = await fetch(`${BASE_URL}/api/inquiries/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update inquiry status");
    return res.json();
  },

  async deleteInquiry(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/inquiries/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.ok;
  },

  // Custom Orders
  async getOrders(): Promise<CustomOrder[]> {
    const res = await fetch(`${BASE_URL}/api/orders`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  },

  async createOrder(orderData: Omit<CustomOrder, "id" | "trackingId" | "status" | "createdAt">): Promise<{ success: boolean; order: CustomOrder }> {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create order");
    }
    return res.json();
  },

  async updateOrderStatus(id: string, status: string): Promise<CustomOrder> {
    const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update order status");
    return res.json();
  },

  async deleteOrder(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.ok;
  },

  async trackOrder(trackingId: string): Promise<Partial<CustomOrder>> {
    const res = await fetch(`${BASE_URL}/api/tracking/${trackingId}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Order not found");
    }
    return res.json();
  },

  // Authentication
  async login(email: string, password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Invalid credentials");
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("king_ash_admin_token", data.token);
    }
    return data;
  },

  async logout(): Promise<void> {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    localStorage.removeItem("king_ash_admin_token");
  },

  async checkSession(): Promise<boolean> {
    const token = localStorage.getItem("king_ash_admin_token");
    if (!token) return false;
    try {
      const res = await fetch(`${BASE_URL}/api/auth/session`, { headers: getAuthHeaders() });
      if (!res.ok) return false;
      const data = await res.json();
      return data.authenticated;
    } catch {
      return false;
    }
  },

  async resetPassword(currentPassword: string, newPassword: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update password");
    }
    return res.ok;
  }
};
