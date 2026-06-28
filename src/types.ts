export interface FileAttachment {
  name: string;
  dataUrl: string; // Base64 representation of the file
  type: string;
  size: number;
}

export type OrderStatus = 'Pending' | 'In Progress' | 'Ready' | 'Delivered';

export interface CustomOrder {
  id: string;
  trackingId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  deliveryAddress: string;
  garmentType: string;
  gender: 'Male' | 'Female' | 'Other';
  fabricPreference: string;
  sizeType: 'Standard' | 'Custom';
  // Manual size fields
  chest?: string;
  waist?: string;
  hips?: string;
  shoulder?: string;
  sleeves?: string;
  length?: string;
  customSizeNotes?: string;
  eventDate: string;
  preferredDeliveryDate: string;
  budgetRange: string;
  additionalNotes: string;
  attachments: FileAttachment[];
  status: OrderStatus;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: 'Traditional' | 'Wedding' | 'Corporate' | 'Womens' | 'Mens' | 'Custom';
  imageUrl: string;
  featured: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  imageUrl?: string;
  createdAt: string;
}

export interface InquiryMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Pending' | 'Resolved';
  createdAt: string;
}

export interface WebsiteSettings {
  heroTitle: string;
  heroTagline: string;
  aboutStory: string;
  aboutMission: string;
  aboutVision: string;
  phoneNumbers: string[];
  emails: string[];
  location: string;
  whatsappNumber: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}
