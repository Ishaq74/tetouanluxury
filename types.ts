
export enum UserRole {
  GUEST = 'GUEST',
  CLIENT = 'CLIENT',
  STAFF_CLEANING = 'STAFF_CLEANING',
  STAFF_MAINTENANCE = 'STAFF_MAINTENANCE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export interface LocalizedString {
  EN: string;
  FR: string;
  ES: string;
  AR: string;
}

export interface SEOMetadata {
  title: LocalizedString;
  description: LocalizedString;
  keywords: string[];
  ogImage?: string;
}

// Global Settings for Index Pages (e.g. /journal, /guide)
export interface IndexPageSettings {
    id: string; // 'BLOG', 'GUIDE', 'VILLAS', 'SERVICES'
    heroTitle: LocalizedString;
    heroSubtitle: LocalizedString;
    seo: SEOMetadata;
}

export interface Villa {
  id: string;
  name: string; 
  description: LocalizedString;
  shortDescription: LocalizedString; 
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  pool: boolean;
  images: string[];
  features: LocalizedString[]; 
  isAvailable: boolean;
  maintenanceMode?: boolean;
  seo?: SEOMetadata;
}

export interface HomePageContent {
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  aboutTitle: LocalizedString;
  aboutText: LocalizedString;
}

export interface FAQItem {
  id: string;
  q: LocalizedString;
  a: LocalizedString;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Booking {
  id: string;
  villaId: string;
  clientName: string;
  clientEmail: string;
  villaName?: string;
  checkIn?: Date;
  checkOut?: Date;
  startDate: Date;
  endDate: Date;
  totalPrice: string;
  status: BookingStatus;
  guests: number;
  specialRequests?: string;
}

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passportNumber?: string;
  passportVerified: boolean;
  totalSpends: number;
  staysCount: number;
  status: 'VIP' | 'NEW' | 'RETURNING';
  notes: string;
  pipelineStage: PipelineStage;
  tags?: string[];
  lastStay?: Date;
}

export interface ClientInteraction {
  id: string;
  clientId: string;
  type: 'WHATSAPP' | 'EMAIL' | 'PHONE' | 'SYSTEM';
  direction: 'INBOUND' | 'OUTBOUND';
  content: string;
  date: string;
  agent?: string;
}

export enum PipelineStage {
  NEW_LEAD = 'NEW_LEAD',
  DISCUSSION = 'DISCUSSION',
  PROPOSAL = 'PROPOSAL',
  CONFIRMED = 'CONFIRMED',
  POST_STAY = 'POST_STAY'
}

export enum TaskType {
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE',
  CONCIERGE = 'CONCIERGE'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  REJECTED = 'REJECTED'
}

export interface TaskChecklistItem {
    id: string;
    label: string;
    completed: boolean;
}

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  villaId: string;
  assignedTo?: string;
  dueDate: string;
  status: TaskStatus;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  // New operational fields
  startedAt?: string;
  completedAt?: string;
  checklist?: TaskChecklistItem[];
  photos?: string[]; // URLs of proof photos
  incidentReport?: string; // If something broke during task
  managerComment?: string; // Feedback
}

export interface MaintenanceTicket {
  id: string;
  category: 'PLUMBING' | 'ELECTRICITY' | 'AC' | 'FURNITURE' | 'POOL';
  description: string;
  villaId: string;
  reportedBy: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  costEstimate?: number;
  assignedTo?: string;
  photos?: string[];
}

// --- CMS TYPES ---

export interface Category {
    id: string;
    type: 'BLOG' | 'GUIDE' | 'SERVICE';
    name: LocalizedString;
    slug: string;
    description: LocalizedString;
    image: string;
    count: number; // Computed
    seo?: SEOMetadata;
}

export interface BlogPost {
  id: string;
  title: LocalizedString;
  slug: string; 
  category: string; // ID of the category
  tags: string[];
  excerpt: LocalizedString;
  content: LocalizedString; 
  image: string;
  date: string;
  author: string;
  seo?: SEOMetadata;
  status: 'DRAFT' | 'PUBLISHED';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'LINEN' | 'TOILETRIES' | 'KITCHEN';
  quantity: number;
  minLevel: number;
  unit: string;
  status: 'OK' | 'LOW' | 'CRITICAL';
}

export interface GroceryItem {
  id: string;
  name: LocalizedString;
  category: 'FRUIT' | 'DAIRY' | 'DRINKS' | 'SNACKS' | 'BAKERY' | 'ESSENTIALS';
  price: number;
  unit: string;
}

export interface Expense {
  id: string;
  category: 'UTILITIES' | 'MAINTENANCE' | 'SUPPLIES' | 'TAXES' | 'OTHER';
  description: string;
  amount: number;
  date: string;
  supplierId?: string;
  status: 'PAID' | 'PENDING';
}

export interface Supplier {
  id: string;
  name: string;
  service: string;
  contact: string;
  email: string;
}

export interface Review {
  id: string;
  villaId: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  category?: 'FAMILY' | 'COUPLE' | 'GROUP' | 'BUSINESS';
  videoUrl?: string;
  status: 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: UserRole;
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'INFO' | 'ALERT' | 'SUCCESS';
  role: UserRole | 'ALL';
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  villaId: string;
  serviceType: 'CHEF' | 'CHAUFFEUR' | 'SPA' | 'EXCURSION';
  dateRequested: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED';
  notes?: string;
  price: number;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'EMAIL' | 'WHATSAPP';
  status: 'DRAFT' | 'SCHEDULED' | 'SENT';
  sentCount: number;
  openRate: number;
  date: string;
}

export interface VillaStatus {
  id: string;
  villaName: string;
  cleanliness: 'CLEAN' | 'DIRTY' | 'IN_PROGRESS';
  occupancy: 'VACANT' | 'OCCUPIED';
  nextArrival?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'OFF_DUTY' | 'ON_LEAVE';
  schedule: { day: string; shift: 'MORNING' | 'AFTERNOON' | 'FULL_DAY' | 'OFF' }[];
  lastLogin?: string; 
  performanceScore?: number; // 0-5
}

export interface Invoice {
  id: string;
  bookingId: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
  url: string;
}

export interface GuideItem {
  id: string;
  title: LocalizedString;
  category: string; // ID of Category
  desc: LocalizedString;
  fullContent?: LocalizedString;
  image?: string;
  location?: string;
  seo?: SEOMetadata;
}

export interface PremiumService {
  id: string;
  title: LocalizedString;
  category: string; // ID of Category
  price: string;
  desc: LocalizedString;
  longDesc?: LocalizedString;
  seo?: SEOMetadata;
}

export interface SystemLog {
    id: number;
    action: string;
    user: string;
    ip: string;
    time: string;
    details?: string;
    type: 'INFO' | 'WARNING' | 'ERROR';
}
