import { Villa, Booking, Client, Task, TaskType, TaskStatus, BookingStatus, PipelineStage, MaintenanceTicket, BlogPost, InventoryItem, Expense, Supplier, Review, ChatMessage, UserRole, Notification, VillaStatus, ClientInteraction, StaffMember, Invoice, GuideItem, PremiumService, GroceryItem, ServiceRequest, MarketingCampaign, FAQItem, Category } from '../types';

// --- DATA SEEDS ---

export const VILLAS: Villa[] = Array.from({ length: 7 }).map((_, i) => ({
  id: `villa-${i + 1}`,
  name: `Villa ${['Malabata', 'Cabo', 'Martil', 'Sofía', 'Nour', 'Atlas', 'Rif'][i]}`,
  description: {
      EN: "A sanctuary of luxury offering modern elegance with traditional Moroccan touches. Private pool, panoramic views of the Mediterranean, and 24/7 security.",
      FR: "Un sanctuaire de luxe offrant une élégance moderne avec des touches marocaines traditionnelles. Piscine privée, vues panoramiques sur la Méditerranée et sécurité 24/7.",
      ES: "Un santuario de lujo que ofrece elegancia moderna con toques tradicionales marroquíes. Piscina privada, vistas panorámicas del Mediterráneo y seguridad 24/7.",
      AR: "ملاذ من الفخامة يجمع بين الأناقة العصرية واللمسات المغربية التقليدية. مسبح خاص، إطلالات بانورامية على البحر الأبيض المتوسط، وأمن على مدار 24 ساعة."
  },
  shortDescription: {
      EN: "Modern luxury with sea views.",
      FR: "Luxe moderne avec vue mer.",
      ES: "Lujo moderno con vistas al mar.",
      AR: "فخامة عصرية مع إطلالة على البحر."
  },
  pricePerNight: 350 + (i * 20),
  bedrooms: 4,
  bathrooms: 3,
  pool: true,
  isAvailable: i % 3 !== 0,
  maintenanceMode: false,
  images: [
    `https://picsum.photos/800/600?random=${10 + i}`,
    `https://picsum.photos/800/600?random=${20 + i}`,
    `https://picsum.photos/800/600?random=${30 + i}`
  ],
  features: [
      { EN: 'Private Pool', FR: 'Piscine Privée', ES: 'Piscina Privada', AR: 'مسبح خاص' },
      { EN: 'High-Speed Wi-Fi', FR: 'Wi-Fi Haut Débit', ES: 'Wi-Fi de Alta Velocidad', AR: 'واي فاي عالي السرعة' },
      { EN: 'Smart Home', FR: 'Domotique', ES: 'Casa Inteligente', AR: 'منزل ذكي' },
      { EN: 'Daily Housekeeping', FR: 'Ménage Quotidien', ES: 'Limpieza Diaria', AR: 'تدبير منزلي يومي' },
      { EN: '24/7 Security', FR: 'Sécurité 24/7', ES: 'Seguridad 24/7', AR: 'أمن 24/7' }
  ]
}));

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    villaId: 'villa-1',
    clientName: 'Karim Benjelloun',
    clientEmail: 'karim.b@example.com',
    startDate: '2023-10-15',
    endDate: '2023-10-22',
    totalPrice: 2450,
    status: BookingStatus.CONFIRMED,
    guests: 4,
    specialRequests: 'Airport pickup needed'
  },
  {
    id: 'BK-1002',
    villaId: 'villa-3',
    clientName: 'Sophie Marceau',
    clientEmail: 'sophie.m@example.com',
    startDate: '2023-11-01',
    endDate: '2023-11-05',
    totalPrice: 1500,
    status: BookingStatus.PENDING,
    guests: 2
  },
  {
    id: 'BK-1003',
    villaId: 'villa-2',
    clientName: 'Ahmed Al-Fayed',
    clientEmail: 'ahmed.a@example.com',
    startDate: '2023-09-20',
    endDate: '2023-09-25',
    totalPrice: 1750,
    status: BookingStatus.CHECKED_IN,
    guests: 6
  }
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'CL-001',
    fullName: 'Karim Benjelloun',
    email: 'karim.b@example.com',
    phone: '+212 600 000 000',
    passportNumber: 'A1234567',
    passportVerified: true,
    totalSpends: 12500,
    staysCount: 3,
    status: 'VIP',
    notes: 'Prefers extra towels. Allergies to nuts. Always books Villa Malabata.',
    pipelineStage: PipelineStage.CONFIRMED,
    tags: ['Family', 'MRE', 'Big Spender']
  },
  {
    id: 'CL-002',
    fullName: 'Sophie Marceau',
    email: 'sophie.m@example.com',
    phone: '+33 600 000 000',
    passportVerified: false,
    totalSpends: 1500,
    staysCount: 1,
    status: 'NEW',
    notes: 'Interested in Chefchaouen tour. Asked about vegetarian options for chef.',
    pipelineStage: PipelineStage.DISCUSSION,
    tags: ['Tourist', 'French']
  },
  {
    id: 'CL-003',
    fullName: 'James Smith',
    email: 'j.smith@email.com',
    phone: '+44 700 000 000',
    passportVerified: false,
    totalSpends: 0,
    staysCount: 0,
    status: 'NEW',
    notes: 'Inquired about long stay discount (1 month) for winter.',
    pipelineStage: PipelineStage.NEW_LEAD,
    tags: ['Digital Nomad']
  },
  {
    id: 'CL-004',
    fullName: 'Fatima El Amrani',
    email: 'fatima.e@email.com',
    phone: '+212 611 111 111',
    passportVerified: true,
    totalSpends: 5000,
    staysCount: 2,
    status: 'RETURNING',
    notes: 'Loves Villa Nour. Very easy going.',
    pipelineStage: PipelineStage.POST_STAY,
    tags: ['Local']
  }
];

export const MOCK_CLIENT_INTERACTIONS: ClientInteraction[] = [
  { id: 'int-1', clientId: 'CL-001', type: 'WHATSAPP', direction: 'INBOUND', content: 'Hello, is the villa available for next Eid?', date: '2023-09-10 14:30' },
  { id: 'int-2', clientId: 'CL-001', type: 'WHATSAPP', direction: 'OUTBOUND', content: 'Yes Mr. Benjelloun, we have Villa Malabata ready for you. Same price as last year.', date: '2023-09-10 14:35', agent: 'Sarah (Sales)' },
  { id: 'int-3', clientId: 'CL-001', type: 'SYSTEM', direction: 'OUTBOUND', content: 'Booking Confirmation Email Sent', date: '2023-09-11 09:00' },
  { id: 'int-4', clientId: 'CL-002', type: 'EMAIL', direction: 'INBOUND', content: 'Do you offer airport transfer from Tangier?', date: '2023-10-01 10:15' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'TSK-001',
    type: TaskType.CLEANING,
    title: 'Deep Clean Villa Malabata',
    description: 'Post-checkout cleaning required. Check pool filter.',
    villaId: 'villa-1',
    assignedTo: 'Fatima',
    dueDate: '2023-10-22',
    status: TaskStatus.TODO
  },
  {
    id: 'TSK-002',
    type: TaskType.MAINTENANCE,
    title: 'AC Repair Villa Atlas',
    description: 'Unit in Master Bedroom making noise.',
    villaId: 'villa-6',
    assignedTo: 'Hassan',
    dueDate: '2023-10-18',
    status: TaskStatus.IN_PROGRESS
  }
];

export const MOCK_TICKETS: MaintenanceTicket[] = [
  {
    id: 'TKT-101',
    category: 'PLUMBING',
    description: 'Low water pressure in guest bathroom.',
    villaId: 'villa-2',
    reportedBy: 'Guest',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2023-10-20',
    costEstimate: 150
  },
  {
    id: 'TKT-102',
    category: 'POOL',
    description: 'Pool lights flickering.',
    villaId: 'villa-5',
    reportedBy: 'Maintenance Staff',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '2023-10-19',
    assignedTo: 'Tetouan Elec',
    costEstimate: 80
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: { EN: 'Top 5 Hidden Gems in the Tetouan Medina', FR: 'Top 5 des trésors cachés de la Médina de Tétouan', ES: 'Top 5 joyas ocultas en la Medina de Tetuán', AR: 'أفضل 5 جواهر خفية في مدينة تطوان القديمة' },
    slug: 'hidden-gems-tetouan-medina',
    category: 'LOCAL_LIFE',
    tags: ['Medina', 'History', 'UNESCO', 'Shopping'],
    excerpt: {
        EN: 'Discover the secret courtyards and artisan workshops that most tourists miss when visiting the UNESCO World Heritage site.',
        FR: 'Découvrez les cours secrètes et les ateliers d\'artisans que la plupart des touristes manquent lors de la visite du site du patrimoine mondial de l\'UNESCO.',
        ES: 'Descubra los patios secretos y talleres artesanos que la mayoría de los turistas se pierden.',
        AR: 'اكتشف الأفنية السرية وورش الحرفيين التي يفتقدها معظم السياح عند زيارة موقع التراث العالمي لليونسكو.'
    },
    content: {
        EN: `<p>The Medina of Tétouan is a labyrinth of history...</p>`,
        FR: `<p>La Médina de Tétouan est un labyrinthe d'histoire...</p>`,
        ES: `<p>La Medina de Tetuán es un laberinto de historia...</p>`,
        AR: `<p>مدينة تطوان القديمة هي متاهة من التاريخ...</p>`
    },
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1920',
    date: 'Oct 12, 2023',
    author: 'Sarah M.',
    status: 'PUBLISHED'
  },
  {
    id: 'post-2',
    title: { EN: 'A Guide to Moroccan Tea Culture', FR: 'Guide de la culture du thé marocain', ES: 'Guía de la cultura del té marroquí', AR: 'دليل لثقافة الشاي المغربي' },
    slug: 'guide-moroccan-tea-culture',
    category: 'GASTRONOMY',
    tags: ['Food', 'Tea', 'Culture', 'Tradition'],
    excerpt: {
        EN: 'How to prepare, serve, and enjoy the perfect glass of mint tea like a local.',
        FR: 'Comment préparer, servir et déguster le verre de thé à la menthe parfait comme un local.',
        ES: 'Cómo preparar, servir y disfrutar el vaso de té a la menta perfecto como un local.',
        AR: 'كيفية تحضير وتقديم والاستمتاع بكوب الشاي بالنعناع المثالي مثل السكان المحليين.'
    },
    content: { EN: `<p>Moroccan Mint Tea...</p>`, FR: `<p>Le Thé à la Menthe Marocain...</p>`, ES: `<p>El té a la menta marroquí...</p>`, AR: `<p>الشاي المغربي بالنعناع...</p>` },
    image: 'https://images.unsplash.com/photo-1597250559670-36209b19e2e5?q=80&w=1920',
    date: 'Sep 28, 2023',
    author: 'Karim B.',
    status: 'PUBLISHED'
  }
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'inv-1', name: 'Bath Towels (White)', category: 'LINEN', quantity: 45, minLevel: 20, unit: 'pcs', status: 'OK' },
  { id: 'inv-2', name: 'Nespresso Pods', category: 'KITCHEN', quantity: 12, minLevel: 50, unit: 'box', status: 'CRITICAL' },
  { id: 'inv-3', name: 'Shampoo (500ml)', category: 'TOILETRIES', quantity: 8, minLevel: 10, unit: 'bottles', status: 'LOW' },
  { id: 'inv-4', name: 'Pool Chlorine Tablets', category: 'LINEN', quantity: 5, minLevel: 2, unit: 'bucket', status: 'OK' },
];

export const TETOUAN_GUIDE: GuideItem[] = [
  { 
      id: 'g-1', 
      title: { EN: 'Medina of Tétouan', FR: 'Médina de Tétouan', ES: 'Medina de Tetuán', AR: 'المدينة القديمة لتطوان' }, 
      category: 'Culture', 
      desc: { EN: 'A UNESCO World Heritage site.', FR: 'Un site du patrimoine mondial de l\'UNESCO.', ES: 'Patrimonio de la Humanidad por la UNESCO.', AR: 'موقع التراث العالمي لليونسكو.' }, 
      image: 'https://picsum.photos/800/600?random=201', 
      location: 'City Center', 
      fullContent: { EN: 'Full text...', FR: 'Texte complet...', ES: 'Texto completo...', AR: 'النص الكامل...' } 
  },
  { 
      id: 'g-2', 
      title: { EN: 'Cabo Negro Beach', FR: 'Plage de Cabo Negro', ES: 'Playa de Cabo Negro', AR: 'شاطئ كابو نيغرو' }, 
      category: 'Relaxation', 
      desc: { EN: 'Golden sands and crystal clear waters.', FR: 'Sable doré et eaux cristallines.', ES: 'Arenas doradas y aguas cristalinas.', AR: 'رمال ذهبية ومياه صافية.' }, 
      image: 'https://picsum.photos/800/600?random=202', 
      location: 'Cabo Negro' 
  }
];

export const PREMIUM_SERVICES: PremiumService[] = [
  { 
      id: 'srv-1', 
      title: { EN: 'Private Chef', FR: 'Chef Privé', ES: 'Chef Privado', AR: 'طاه خاص' }, 
      category: 'Dining', 
      price: '150€/day', 
      desc: { EN: 'Traditional Moroccan cuisine in your villa.', FR: 'Cuisine marocaine traditionnelle dans votre villa.', ES: 'Cocina marroquí tradicional en su villa.', AR: 'مأكولات مغربية تقليدية في فيلتك.' }, 
      longDesc: { EN: 'Detailed description...', FR: 'Description détaillée...', ES: 'Descripción detallada...', AR: 'وصف مفصل...' } 
  },
  { 
      id: 'srv-2', 
      title: { EN: 'Chauffeur Service', FR: 'Chauffeur Privé', ES: 'Servicio de Chófer', AR: 'خدمة السائق' }, 
      category: 'Transport', 
      price: '100€/day', 
      desc: { EN: 'Luxury vehicle with professional driver.', FR: 'Véhicule de luxe avec chauffeur professionnel.', ES: 'Vehículo de lujo con conductor profesional.', AR: 'سيارة فاخرة مع سائق محترف.' } 
  }
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'EXP-001', category: 'UTILITIES', description: 'Monthly Electricity Bill (Amendis)', amount: 450, date: '2023-10-01', status: 'PENDING' },
  { id: 'EXP-002', category: 'SUPPLIES', description: 'Pool Chemicals & Cleaning Supplies', amount: 120, date: '2023-10-05', supplierId: 'SUP-002', status: 'PAID' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'SUP-001', name: 'Tetouan Clim S.A.R.L', service: 'HVAC Maintenance', contact: '+212 600 123 456', email: 'contact@tetouanclim.ma' },
  { id: 'SUP-002', name: 'Piscine Pro', service: 'Pool Supplies', contact: '+212 600 987 654', email: 'sales@piscinepro.ma' },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'REV-001', villaId: 'villa-1', guestName: 'Alice D.', rating: 5, comment: 'Absolutely stunning villa. The staff was incredibly helpful.', date: 'Oct 2023', category: 'FAMILY', status: 'PUBLISHED' },
];

export const MOCK_CHAT: ChatMessage[] = [
  { id: 'msg-1', sender: 'Fatima (Cleaning)', role: UserRole.STAFF_CLEANING, text: 'Villa Malabata is ready for check-in.', timestamp: '10:30 AM' },
];

export const FAQ_ITEMS: FAQItem[] = [
  { 
      id: 'f-1', 
      q: { EN: 'Is breakfast included?', FR: 'Le petit-déjeuner est-il inclus ?', ES: '¿El desayuno está incluido?', AR: 'هل الإفطار مشمول؟' }, 
      a: { EN: 'We offer a welcome basket upon arrival.', FR: 'Nous offrons un panier de bienvenue à l\'arrivée.', ES: 'Ofrecemos una cesta de bienvenida a la llegada.', AR: 'نقدم سلة ترحيب عند الوصول.' } 
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', title: 'New Booking', message: 'Villa Malabata booked for Oct 15-22', time: '5m ago', read: false, type: 'SUCCESS', role: UserRole.MANAGER },
];

export const MOCK_VILLA_STATUS: VillaStatus[] = [
  { id: 'villa-1', villaName: 'Villa Malabata', cleanliness: 'CLEAN', occupancy: 'OCCUPIED' },
  { id: 'villa-2', villaName: 'Villa Cabo', cleanliness: 'DIRTY', occupancy: 'VACANT', nextArrival: 'Today, 2PM' },
];

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'ST-001', name: 'Fatima Benali', role: UserRole.STAFF_CLEANING, phone: '+212 600 000 001', email: 'fatima@villas.ma', status: 'ACTIVE',
    schedule: [
      { day: 'Mon', shift: 'MORNING' }, { day: 'Tue', shift: 'MORNING' }, { day: 'Wed', shift: 'OFF' },
      { day: 'Thu', shift: 'MORNING' }, { day: 'Fri', shift: 'MORNING' }, { day: 'Sat', shift: 'MORNING' }, { day: 'Sun', shift: 'OFF' }
    ]
  },
  {
    id: 'ST-002', name: 'Hassan Idrissi', role: UserRole.STAFF_MAINTENANCE, phone: '+212 600 000 002', email: 'hassan@villas.ma', status: 'ACTIVE',
    schedule: [
      { day: 'Mon', shift: 'AFTERNOON' }, { day: 'Tue', shift: 'AFTERNOON' }, { day: 'Wed', shift: 'AFTERNOON' },
      { day: 'Thu', shift: 'OFF' }, { day: 'Fri', shift: 'AFTERNOON' }, { day: 'Sat', shift: 'OFF' }, { day: 'Sun', shift: 'FULL_DAY' }
    ]
  }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-001', bookingId: 'BK-1001', clientName: 'Karim Benjelloun', amount: 2450, date: '2023-09-15', status: 'PAID', url: '#' },
];

export const GROCERY_CATALOG: GroceryItem[] = [
    { id: 'gr-1', name: { EN: 'Mineral Water (6x1.5L)', FR: 'Eau Minérale (6x1.5L)', ES: 'Agua Mineral (6x1.5L)', AR: 'مياه معدنية (6x1.5L)' }, category: 'DRINKS', price: 4, unit: 'pack' },
    { id: 'gr-3', name: { EN: 'Seasonal Fruit Basket', FR: 'Corbeille de Fruits', ES: 'Cesta de Frutas', AR: 'سلة فواكه' }, category: 'FRUIT', price: 15, unit: 'basket' },
];

export const MOCK_SERVICE_REQUESTS: ServiceRequest[] = [
    { id: 'SRV-101', clientId: 'CL-001', clientName: 'Karim Benjelloun', villaId: 'villa-1', serviceType: 'CHEF', dateRequested: '2023-10-16', status: 'PENDING', price: 150, notes: 'Dinner for 4, no nuts.' },
];

export const MOCK_MARKETING_CAMPAIGNS: MarketingCampaign[] = [
    { id: 'MC-001', name: 'Winter Warmers - Long Stay', type: 'EMAIL', status: 'SENT', sentCount: 150, openRate: 42, date: '2023-09-01' },
];

export const MOCK_CATEGORIES: Category[] = [
    { 
        id: 'CAT-BLOG-1', type: 'BLOG', slug: 'local-life', 
        name: {EN:'Local Life', FR:'Vie Locale', ES:'Vida Local', AR:'الحياة المحلية'},
        description: {EN:'Stories from the medina.', FR:'Histoires de la médina.', ES:'Historias de la medina.', AR:'قصص من المدينة.'},
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800', count: 12
    },
    { 
        id: 'CAT-BLOG-2', type: 'BLOG', slug: 'gastronomy', 
        name: {EN:'Gastronomy', FR:'Gastronomie', ES:'Gastronomía', AR:'فن الطهو'},
        description: {EN:'Taste of Morocco.', FR:'Le goût du Maroc.', ES:'Sabor de Marruecos.', AR:'مذاق المغرب.'},
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800', count: 8
    },
    { 
        id: 'CAT-GUIDE-1', type: 'GUIDE', slug: 'culture', 
        name: {EN:'Culture', FR:'Culture', ES:'Cultura', AR:'ثقافة'},
        description: {EN:'Museums and sites.', FR:'Musées et sites.', ES:'Museos y sitios.', AR:'متاحف ومواقع.'},
        image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800', count: 5
    }
];

// ITINERARIES (Kept simple for now, but should also be localized)
export const ITINERARIES = [
  { title: '3-Day Cultural Immersion', duration: '3 Days', steps: ['Morning walk in Medina', 'Lunch at Riad Blanco', 'Visit Archaeological Museum', 'Sunset at Martil Corniche'] },
];