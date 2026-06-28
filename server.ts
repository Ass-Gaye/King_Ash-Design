import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase payload limit for base64 file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Dynamic persistence folder setup
const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use("/uploads", express.static(UPLOADS_DIR));

// File-based db helpers
const getFilePath = (filename: string) => path.join(DATA_DIR, filename);

function readData<T>(filename: string, defaultData: T): T {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    writeData(filename, defaultData);
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading database file: ${filename}`, e);
    return defaultData;
  }
}

function writeData<T>(filename: string, data: T): void {
  const filePath = getFilePath(filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`Error writing database file: ${filename}`, e);
  }
}

// Default Seed Data
const defaultSettings = {
  heroTitle: "King Ash Design",
  heroTagline: "Custom Tailoring & Fashion Design Crafted with Excellence in The Gambia",
  aboutStory: "Founded with a passion for exquisite tailoring and high fashion, King Ash is the leading fashion house in The Gambia for luxury bespoke apparel. Owned and operated by a visionary Gambian entrepreneur, King Ash merges centuries-old West African design sensibilities with sharp modern silhouettes. Every stitch tells a story of elegance, power, and heritage.",
  aboutMission: "To craft world-class, premium bespoke tailoring that celebrates individual expression and African elegance, establishing Gambian craftsmanship on the global fashion stage.",
  aboutVision: "To be the ultimate luxury design house in West Africa, synonymous with peerless fitting, exquisite custom embroidery, and revolutionary fashion design.",
  phoneNumbers: ["+220 760 7728", "+220 338 5184"],
  emails: ["niangass460@gmail.com"],
  location: "Latrikunda Sabiji, Jakabi, The Gambia",
  whatsappNumber: "+220 760 7728",
  facebookUrl: "https://facebook.com/kingashdesign",
  instagramUrl: "https://instagram.com/kingashdesign",
  tiktokUrl: "https://tiktok.com/@kingashdesign"
};

const defaultGallery = [
  {
    id: "g1",
    title: "The Royal Emerald Agbada",
    description: "Premium rich deep emerald green damask Agbada adorned with intricate custom golden embroidery, crafted for prestigious occasions.",
    category: "Traditional",
    imageUrl: "/src/assets/images/traditional_wear_1782620142530.jpg",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "g2",
    title: "Golden Ivory Bridal Symphony",
    description: "A breathtaking West African wedding gown paired with matching groom's premium suit, featuring delicate custom gold lace patterns and hand-stitched detailing.",
    category: "Wedding",
    imageUrl: "/src/assets/images/wedding_attire_1782620155878.jpg",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "g3",
    title: "Elite Charcoal & Kente Suit",
    description: "Crisp tailored double-breasted corporate blazer with luxury traditional Kente print accents hand-woven into the cuffs and collar.",
    category: "Corporate",
    imageUrl: "/src/assets/images/corporate_wear_1782620168834.jpg",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "g4",
    title: "Gambia Blossom Flowing Kaftan",
    description: "Flowy, dramatic high-fashion silk kaftan in gold and deep green accents, celebrating modern Gambian femininity.",
    category: "Womens",
    imageUrl: "/src/assets/images/womens_fashion_1782620180047.jpg",
    featured: true,
    createdAt: new Date().toISOString()
  }
];

const defaultTestimonials = [
  {
    id: "t1",
    name: "Fatou Ceesay",
    role: "Bride",
    content: "King Ash designed my entire bridal party outfits and my wedding dress. The fitting was absolute perfection! Everyone in Latrikunda is still talking about the golden embroidery.",
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: "t2",
    name: "Alieu Jobe",
    role: "Business Executive",
    content: "The corporate suit with African accents is a masterpiece. I wear it to international summits and receive endless compliments. The craftsmanship is of the highest international standard.",
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: "t3",
    name: "Mariama Diallo",
    role: "Event Hostess",
    content: "King Ash delivers premium designs on-time, every time. Their attention to detail in traditional boubous is simply incredible. The best luxury designer in The Gambia!",
    rating: 5,
    createdAt: new Date().toISOString()
  }
];

const defaultOrders = [
  {
    id: "o1",
    trackingId: "KA-93821",
    fullName: "Mustapha Sallah",
    email: "mustapha.sallah@gmail.com",
    phoneNumber: "+220 777 1234",
    deliveryAddress: "Kairaba Avenue, Fajara",
    garmentType: "Traditional Agbada",
    gender: "Male",
    fabricPreference: "Rich Bazin",
    sizeType: "Custom",
    chest: "42 inches",
    waist: "36 inches",
    hips: "40 inches",
    shoulder: "18 inches",
    sleeves: "25 inches",
    length: "58 inches",
    customSizeNotes: "Likes a slightly relaxed fit around the sleeves.",
    eventDate: "2026-07-25",
    preferredDeliveryDate: "2026-07-20",
    budgetRange: "D15,000 - D25,000",
    additionalNotes: "Gold embroidery pattern matching the Royal Emerald showcase model.",
    attachments: [],
    status: "In Progress",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  },
  {
    id: "o2",
    trackingId: "KA-48201",
    fullName: "Binta Barrow",
    email: "bintab@outlook.com",
    phoneNumber: "+220 331 9876",
    deliveryAddress: "Senegambia Area",
    garmentType: "Wedding Reception Dress",
    gender: "Female",
    fabricPreference: "Silk Brocade and Lace",
    sizeType: "Standard",
    customSizeNotes: "Standard size M. Will visit Latrikunda shop for final fit.",
    eventDate: "2026-08-10",
    preferredDeliveryDate: "2026-08-05",
    budgetRange: "D25,000+",
    additionalNotes: "Please make the dress flowy and include matching headscarf (Gele).",
    attachments: [],
    status: "Pending",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  }
];

const defaultInquiries = [
  {
    id: "i1",
    name: "Lamin Touray",
    email: "lamintouray@gmail.com",
    phone: "+220 991 2233",
    subject: "Fabric Consultation Enquiry",
    message: "Hello King Ash team, do you also supply the silk for wedding boubous, or do I need to bring my own bazin from Senegal?",
    status: "Pending",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

const defaultAdminUser = {
  email: "admin@kingash.com",
  passwordHash: crypto.createHash("sha256").update("KingAshDesign2026!").digest("hex")
};

// Initialize DBs
let settings = readData("settings.json", defaultSettings);
let gallery = readData("gallery.json", defaultGallery);
let testimonials = readData("testimonials.json", defaultTestimonials);
let orders = readData("orders.json", defaultOrders);
let inquiries = readData("inquiries.json", defaultInquiries);
let adminUser = readData("admin.json", defaultAdminUser);

// Secure Session Tokens store (in-memory)
const activeSessions = new Map<string, { email: string; expiresAt: number }>();

// Auth Middleware
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Missing authentication token." });
  }
  const token = authHeader.split(" ")[1];
  const session = activeSessions.get(token);
  
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: "Session expired or invalid token." });
  }
  
  // Extend session duration on active calls
  session.expiresAt = Date.now() + 60 * 60 * 1000; // 1 Hour
  next();
}

// --- API Endpoints ---

// 1. AUTHENTICATION
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const inputHash = crypto.createHash("sha256").update(password).digest("hex");
  
  if (email.toLowerCase() === adminUser.email.toLowerCase() && inputHash === adminUser.passwordHash) {
    const token = crypto.randomBytes(32).toString("hex");
    activeSessions.set(token, {
      email: adminUser.email,
      expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
    });
    
    return res.json({
      success: true,
      token,
      admin: { email: adminUser.email }
    });
  }

  return res.status(401).json({ error: "Invalid email or password." });
});

app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    activeSessions.delete(token);
  }
  res.json({ success: true, message: "Logged out successfully" });
});

app.get("/api/auth/session", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ authenticated: false });
  }
  const token = authHeader.split(" ")[1];
  const session = activeSessions.get(token);
  
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.json({ authenticated: false });
  }
  
  res.json({ authenticated: true, admin: { email: session.email } });
});

app.post("/api/auth/reset-password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "All password fields are required." });
  }

  const currentHash = crypto.createHash("sha256").update(currentPassword).digest("hex");
  if (currentHash !== adminUser.passwordHash) {
    return res.status(400).json({ error: "Incorrect current password." });
  }

  adminUser.passwordHash = crypto.createHash("sha256").update(newPassword).digest("hex");
  writeData("admin.json", adminUser);
  
  res.json({ success: true, message: "Password updated successfully." });
});

// 2. SETTINGS / CONTENT MANAGEMENT
app.get("/api/settings", (req, res) => {
  res.json(settings);
});

app.post("/api/settings", requireAuth, (req, res) => {
  settings = { ...settings, ...req.body };
  writeData("settings.json", settings);
  res.json({ success: true, settings });
});

// 3. GALLERY MANAGEMENT
app.get("/api/gallery", (req, res) => {
  res.json(gallery);
});

app.post("/api/gallery", requireAuth, (req, res) => {
  const { title, description, category, imageUrl, featured, base64Image } = req.body;
  
  if (!title || !category) {
    return res.status(400).json({ error: "Title and category are required." });
  }

  let finalImageUrl = imageUrl || "/placeholder.jpg";

  // Handle uploaded base64 image
  if (base64Image && base64Image.startsWith("data:image/")) {
    try {
      const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const fileType = matches[1];
        const ext = fileType.split("/")[1];
        const base64Data = matches[2];
        const filename = `gallery_${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        
        fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
        finalImageUrl = `/uploads/${filename}`;
      }
    } catch (e) {
      console.error("Failed to save gallery file", e);
      return res.status(500).json({ error: "Failed to save uploaded image file." });
    }
  }

  const newItem = {
    id: "g" + Date.now(),
    title,
    description: description || "",
    category,
    imageUrl: finalImageUrl,
    featured: !!featured,
    createdAt: new Date().toISOString()
  };

  gallery.unshift(newItem);
  writeData("gallery.json", gallery);
  res.status(201).json(newItem);
});

app.delete("/api/gallery/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const index = gallery.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Gallery item not found" });
  }

  // Optionally delete physical upload file
  const item = gallery[index];
  if (item.imageUrl.startsWith("/uploads/")) {
    const filename = item.imageUrl.replace("/uploads/", "");
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) { console.error("Error deleting file", e); }
    }
  }

  gallery.splice(index, 1);
  writeData("gallery.json", gallery);
  res.json({ success: true, message: "Gallery item deleted" });
});

// 4. TESTIMONIALS
app.get("/api/testimonials", (req, res) => {
  res.json(testimonials);
});

app.post("/api/testimonials", (req, res) => {
  const { name, role, content, rating } = req.body;
  if (!name || !content || !rating) {
    return res.status(400).json({ error: "Name, rating and review content are required" });
  }
  const newTestimonial = {
    id: "t" + Date.now(),
    name,
    role: role || "Valued Client",
    content,
    rating: parseInt(rating) || 5,
    createdAt: new Date().toISOString()
  };
  testimonials.unshift(newTestimonial);
  writeData("testimonials.json", testimonials);
  res.status(201).json(newTestimonial);
});

app.delete("/api/testimonials/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  testimonials = testimonials.filter(t => t.id !== id);
  writeData("testimonials.json", testimonials);
  res.json({ success: true });
});

// 5. INQUIRIES
app.get("/api/inquiries", requireAuth, (req, res) => {
  res.json(inquiries);
});

app.post("/api/inquiries", (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required" });
  }
  const newInquiry = {
    id: "i" + Date.now(),
    name,
    email,
    phone: phone || "",
    subject: subject || "General Inquiry",
    message,
    status: "Pending" as const,
    createdAt: new Date().toISOString()
  };
  inquiries.unshift(newInquiry);
  writeData("inquiries.json", inquiries);
  res.status(201).json({ success: true, inquiry: newInquiry });
});

app.patch("/api/inquiries/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const inquiry = inquiries.find(i => i.id === id);
  if (!inquiry) {
    return res.status(404).json({ error: "Inquiry not found" });
  }
  if (status) {
    inquiry.status = status;
    writeData("inquiries.json", inquiries);
  }
  res.json(inquiry);
});

app.delete("/api/inquiries/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  inquiries = inquiries.filter(i => i.id !== id);
  writeData("inquiries.json", inquiries);
  res.json({ success: true });
});

// 6. CUSTOM ORDERS
app.get("/api/orders", requireAuth, (req, res) => {
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const {
    fullName, email, phoneNumber, deliveryAddress, garmentType, gender,
    fabricPreference, sizeType, chest, waist, hips, shoulder, sleeves,
    length, customSizeNotes, eventDate, preferredDeliveryDate, budgetRange,
    additionalNotes, attachments
  } = req.body;

  if (!fullName || !email || !phoneNumber || !garmentType) {
    return res.status(400).json({ error: "Missing required booking details (Name, Email, Phone, Garment Type)." });
  }

  // Handle base64 attachments, save them physically to /uploads
  const savedAttachments = [];
  if (attachments && Array.isArray(attachments)) {
    for (const attach of attachments) {
      if (attach.dataUrl && attach.dataUrl.startsWith("data:")) {
        try {
          const matches = attach.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const fileType = matches[1];
            const ext = attach.name.split(".").pop() || "bin";
            const base64Data = matches[2];
            const filename = `order_${Date.now()}_${crypto.randomBytes(4).toString("hex")}.${ext}`;
            const filePath = path.join(UPLOADS_DIR, filename);
            
            fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
            
            savedAttachments.push({
              name: attach.name,
              type: attach.type,
              size: attach.size,
              dataUrl: `/uploads/${filename}` // Store the local path instead of giant base64!
            });
          }
        } catch (e) {
          console.error("Failed to save attachment file", e);
        }
      }
    }
  }

  const trackingId = "KA-" + Math.floor(10000 + Math.random() * 90000);

  const newOrder = {
    id: "o" + Date.now(),
    trackingId,
    fullName,
    email,
    phoneNumber,
    deliveryAddress: deliveryAddress || "",
    garmentType,
    gender: gender || "Male",
    fabricPreference: fabricPreference || "",
    sizeType: sizeType || "Standard",
    chest,
    waist,
    hips,
    shoulder,
    sleeves,
    length,
    customSizeNotes: customSizeNotes || "",
    eventDate: eventDate || "",
    preferredDeliveryDate: preferredDeliveryDate || "",
    budgetRange: budgetRange || "Negotiable",
    additionalNotes: additionalNotes || "",
    attachments: savedAttachments,
    status: "Pending" as const,
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  writeData("orders.json", orders);
  res.status(201).json({ success: true, order: newOrder });
});

app.patch("/api/orders/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (status) {
    order.status = status;
    writeData("orders.json", orders);
  }
  res.json(order);
});

app.delete("/api/orders/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Delete associated physical upload attachments
  const order = orders[index];
  if (order.attachments && Array.isArray(order.attachments)) {
    for (const attach of order.attachments) {
      if (attach.dataUrl.startsWith("/uploads/")) {
        const filename = attach.dataUrl.replace("/uploads/", "");
        const filePath = path.join(UPLOADS_DIR, filename);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) { console.error("Error deleting attachment", e); }
        }
      }
    }
  }

  orders.splice(index, 1);
  writeData("orders.json", orders);
  res.json({ success: true });
});


// 7. ORDER TRACKING (PUBLIC API)
app.get("/api/tracking/:trackingId", (req, res) => {
  const { trackingId } = req.params;
  const order = orders.find(o => o.trackingId.toLowerCase() === trackingId.trim().toLowerCase());
  if (!order) {
    return res.status(404).json({ error: "No order found with this tracking ID." });
  }
  res.json({
    trackingId: order.trackingId,
    fullName: order.fullName,
    garmentType: order.garmentType,
    status: order.status,
    createdAt: order.createdAt,
    preferredDeliveryDate: order.preferredDeliveryDate
  });
});

// --- Vite Integrations ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
