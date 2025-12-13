
// FRONTEND DATA LAYER
// Note: Seed data is now in src/db/seed.ts and managed by Drizzle ORM
// The following constants are kept for backward compatibility with existing React components
// import * as Seed from '@db/seed';

// --- UI CONSTANTS ---
export const COLORS = {
  primary: '#0f172a', 
  secondary: '#fef3c7', 
  accent: '#d97706',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#333333',
  background: '#ffffff'
};

export const TRANSLATIONS = {
  EN: {
    // Navigation
    nav_home: 'Home',
    nav_villas: 'The Villas',
    nav_services: 'Services',
    nav_reviews: 'Reviews',
    nav_journal: 'Journal',
    nav_guide: 'Discover Tétouan',
    nav_contact: 'Contact',
    login_client: 'Client Area',
    login_staff: 'Staff Access',
    footer_rights: 'All rights reserved.',

    // Common
    btn_save: 'Save Changes',
    btn_cancel: 'Cancel',
    btn_delete: 'Delete',
    btn_edit: 'Edit',
    btn_add: 'Add',
    btn_search: 'Search...',
    btn_filter: 'Filter',
    btn_view_all: 'View All',
    btn_back: 'Back',
    label_date: 'Date',
    label_status: 'Status',
    label_actions: 'Actions',
    label_price: 'Price',
    label_email: 'Email',
    label_phone: 'Phone',
    label_name: 'Name',

    // Home Public
    hero_title: 'Experience Luxury in Tétouan',
    hero_subtitle: 'Private Villas & Concierge',
    home_section_title: 'Modern Luxury Meets Moroccan Heritage',
    home_section_desc: 'Nestled on the pristine coast of Cabo Negro, our collection of seven identical villas offers a sanctuary of privacy, elegance, and comfort.',
    feat_secure: 'Secure & Private',
    feat_secure_desc: '24/7 security in a gated community ensuring total peace of mind.',
    feat_service: 'Premium Service',
    feat_service_desc: 'Concierge, daily housekeeping, and private chef options at your service.',
    feat_amenities: 'Modern Amenities',
    feat_amenities_desc: 'Fiber optic WiFi, smart home features, and heated private pools.',
    
    // Villas Public
    title_our_collection: 'Our Collection',
    msg_booked: 'Booked',
    cta_view_details: 'View Details',
    cta_book_now: 'Book Now',
    label_select_villa: 'Select a Villa',
    label_night: '/ night',
    label_bedrooms: 'Bedrooms',
    label_bathrooms: 'Bathrooms',
    label_pool: 'Private Pool',
    label_guests: 'Guests',
    view_list: 'List View',
    view_map: 'Map View',

    // Booking Flow
    step_dates: 'Dates',
    step_details: 'Details',
    step_confirm: 'Confirm',
    title_guest_info: 'Guest Info',
    title_payment: 'Payment',
    title_summary: 'Summary',
    total_amount: 'Total Amount',
    btn_confirm: 'Confirm Booking',
    btn_next: 'Next',
    book_dynamic_title: 'Dynamic Pricing Active',
    book_dynamic_desc: 'Rates vary by season. Stays longer than 7 nights automatically receive a 10% discount.',
    book_deposit_title: 'Security Deposit',
    book_deposit_desc: 'A pre-authorization of 500€ will be held on your card upon check-in.',
    book_promo_label: 'Promo Code',
    book_promo_btn: 'Apply',
    book_method_card: 'Credit Card (Stripe)',
    book_method_card_desc: 'Secure encrypted payment. Visa, Mastercard, Amex.',
    book_method_transfer: 'Bank Transfer',
    book_method_transfer_desc: 'Manual verification required (24-48h).',
    book_agree_1: 'I agree to the',
    book_agree_2: 'Rental Agreement',
    book_summary_accom: 'Accommodation Total',
    book_summary_clean: 'Cleaning Fees',
    book_summary_tax: 'Taxes (10%)',
    book_summary_discount: 'Discount',
    
    // Guest Form
    label_firstname: 'First Name',
    label_lastname: 'Last Name',
    label_requests: 'Special Requests',
    placeholder_requests: 'Allergies, arrival time, crib needed...',

    // Contact Page
    contact_title: 'Get in Touch',
    contact_desc: 'Our concierge team is available 24/7 to assist with your reservation and any special requests.',
    contact_btn: 'Send Message',

    // Login
    login_title: 'Login',
    login_welcome: 'Welcome Back',
    login_subtitle: 'Choose your account type',
    login_tab_client: 'Client Area',
    login_tab_staff: 'Staff Access',
    login_label_email: 'Email Address',
    login_label_password: 'Password',
    login_label_ref: 'Booking Reference (Optional)',
    login_btn: 'Sign In',
    login_back: 'Back to Home',

    // Operations (Staff)
    ops_tab_brief: 'Brief',
    ops_tab_movements: 'Movements',
    ops_tab_tasks: 'Tasks',
    ops_tab_requests: 'Requests',
    ops_tab_schedule: 'Schedule',
    ops_tab_chat: 'Chat',
    ops_alert_req: 'Action Required',
    ops_btn_panic: 'Report Issue',
    ops_btn_inventory: 'Inventory',
    ops_status_clean: 'Clean',
    ops_status_dirty: 'Dirty',
    ops_status_occupied: 'Occupied',
    ops_status_vacant: 'Vacant',
    ops_section_arrivals: 'Arrivals',
    ops_section_departures: 'Departures',
    ops_btn_checkin: 'Check-in',
    ops_btn_checkout: 'Check-out',
    ops_task_mark_done: 'Mark as Done',
    ops_task_review: 'Pending Review',
    ops_tab_status: 'Status',
    ops_tab_tickets: 'Tickets',
    ops_tab_stock: 'Stock',
    ops_tab_procedures: 'Procedures',
    ops_status_progress: 'In Progress',
    ops_task_checklist: 'Checklist',
    ops_task_evidence: 'Evidence',
    ops_btn_update: 'Update',
    ops_task_approve: 'Approve',
    ops_report_issue: 'Report Issue',
    op_check_ventilate: 'Ventilate Rooms',
    op_check_bed_master: 'Master Bed',
    op_check_bed_guest: 'Guest Bed',
    op_check_bath: 'Bathrooms',
    op_check_floors: 'Floors',
    op_check_kitchen: 'Kitchen',
    op_check_terrace: 'Terrace',

    // Client Portal
    portal_welcome: 'Welcome,',
    portal_tab_home: 'Home',
    portal_tab_bookings: 'Stays',
    portal_tab_chat: 'Chat',
    portal_tab_services: 'Services',
    portal_quick_wifi: 'WiFi Code',
    portal_quick_map: 'Directions',
    portal_quick_guide: 'Villa Guide',
    portal_quick_concierge: 'Concierge',
    portal_booking_confirmed: 'Confirmed',
    portal_access_code: 'Access Code',
    portal_start_checkin: 'Start Check-in',
    portal_experiences: 'Experiences',
    portal_chat_online: 'Online',
    portal_chat_placeholder: 'Type your message...',

    // Admin Sidebar
    admin_nav_overview: 'Overview',
    admin_group_commercial: 'Commercial',
    admin_nav_bookings: 'Bookings',
    admin_nav_crm: 'CRM & Clients',
    admin_nav_properties: 'Villas & Rates',
    admin_group_ops: 'Operations',
    admin_nav_staff: 'Staff & Schedule',
    admin_nav_maintenance: 'Maintenance',
    admin_nav_inventory: 'Inventory',
    admin_nav_concierge: 'Concierge',
    admin_group_finance: 'Business',
    admin_nav_finance: 'Finance',
    admin_nav_marketing: 'Marketing',
    admin_group_cms: 'Content (CMS)',
    admin_nav_blog: 'Blog',
    admin_nav_guide: 'Guide',
    admin_nav_services: 'Services',
    admin_nav_media: 'Media',
    admin_nav_faq: 'FAQ',
    admin_nav_translations: 'Translations',
    admin_group_system: 'System',
    admin_nav_settings: 'Settings',
    admin_btn_logout: 'Logout',

    // Admin Dashboard & Tables
    admin_dashboard_title: 'Manager Dashboard',
    admin_dashboard_subtitle: 'Welcome back, Administrator.',
    admin_kpi_revenue: 'Total Revenue',
    admin_kpi_occupancy: 'Occupancy Rate',
    admin_kpi_guests: 'Active Guests',
    admin_kpi_issues: 'Open Tickets',
    admin_chart_weekly: 'Weekly Activity',
    admin_chart_recent: 'Recent Actions',
    admin_chart_revenue: 'Revenue Analysis',
    admin_col_ref: 'Ref',
    admin_col_client: 'Client',
    admin_col_villa: 'Villa',
    admin_col_dates: 'Dates',
    admin_col_status: 'Status',
    admin_col_total: 'Total',
    admin_col_pipeline: 'Pipeline',
    admin_col_item: 'Item',
    admin_col_category: 'Category',
    admin_col_stock: 'In Stock',
    admin_col_min: 'Min Level',
    admin_btn_new_booking: 'New Booking',
    admin_btn_add_client: 'Add Client',
    admin_btn_create_ticket: 'Create Ticket',
    admin_btn_order_stock: 'Order Supplies',

    // Blog
    blog_title: 'Journal',
    blog_subtitle: 'News & Stories',
    blog_back: 'Back to Journal',
    blog_related: 'Related Articles',
    blog_filter_tag: 'Tag:',
    blog_read_more: 'Read More',
    blog_cat_all: 'All',
    blog_cat_local_life: 'Local Life',
    blog_cat_gastronomy: 'Gastronomy',
    blog_cat_culture: 'Culture',
    blog_cat_travel_tips: 'Travel Tips',
  },
  FR: {
    // Navigation
    nav_home: 'Accueil',
    nav_villas: 'Les Villas',
    nav_services: 'Services',
    nav_reviews: 'Avis',
    nav_journal: 'Journal',
    nav_guide: 'Découvrir Tétouan',
    nav_contact: 'Contact',
    login_client: 'Espace Client',
    login_staff: 'Accès Staff',
    footer_rights: 'Tous droits réservés.',

    // Common
    btn_save: 'Enregistrer',
    btn_cancel: 'Annuler',
    btn_delete: 'Supprimer',
    btn_edit: 'Éditer',
    btn_add: 'Ajouter',
    btn_search: 'Rechercher...',
    btn_filter: 'Filtrer',
    btn_view_all: 'Voir Tout',
    btn_back: 'Retour',
    label_date: 'Date',
    label_status: 'Statut',
    label_actions: 'Actions',
    label_price: 'Prix',
    label_email: 'Email',
    label_phone: 'Téléphone',
    label_name: 'Nom',

    // Home Public
    hero_title: 'Vivez le Luxe à Tétouan',
    hero_subtitle: 'Villas Privées & Conciergerie',
    home_section_title: 'Luxe Moderne et Héritage Marocain',
    home_section_desc: 'Nichée sur la côte immaculée de Cabo Negro, notre collection de sept villas identiques offre un sanctuaire d\'intimité, d\'élégance et de confort.',
    feat_secure: 'Sécurité & Intimité',
    feat_secure_desc: 'Sécurité 24/7 dans une résidence fermée pour une tranquillité d\'esprit totale.',
    feat_service: 'Service Premium',
    feat_service_desc: 'Conciergerie, ménage quotidien et options de chef privé à votre service.',
    feat_amenities: 'Équipements Modernes',
    feat_amenities_desc: 'WiFi fibre optique, domotique et piscines privées chauffées.',

    // Villas Public
    title_our_collection: 'Notre Collection',
    msg_booked: 'Réservé',
    cta_view_details: 'Voir Détails',
    cta_book_now: 'Réserver',
    label_select_villa: 'Choisir une Villa',
    label_night: '/ nuit',
    label_bedrooms: 'Chambres',
    label_bathrooms: 'Salles de bain',
    label_pool: 'Piscine Privée',
    label_guests: 'Voyageurs',
    view_list: 'Vue Liste',
    view_map: 'Vue Carte',

    // Booking Flow
    step_dates: 'Dates',
    step_details: 'Détails',
    step_confirm: 'Confirmer',
    title_guest_info: 'Infos Invité',
    title_payment: 'Paiement',
    title_summary: 'Résumé',
    total_amount: 'Montant Total',
    btn_confirm: 'Confirmer la Réservation',
    btn_next: 'Suivant',
    book_dynamic_title: 'Tarification Dynamique',
    book_dynamic_desc: 'Les tarifs varient selon la saison. Les séjours de plus de 7 nuits bénéficient de -10%.',
    book_deposit_title: 'Caution de Garantie',
    book_deposit_desc: 'Une pré-autorisation de 500€ sera bloquée sur votre carte lors du check-in.',
    book_promo_label: 'Code Promo',
    book_promo_btn: 'Appliquer',
    book_method_card: 'Carte Bancaire (Stripe)',
    book_method_card_desc: 'Paiement sécurisé crypté. Visa, Mastercard, Amex.',
    book_method_transfer: 'Virement Bancaire',
    book_method_transfer_desc: 'Vérification manuelle requise (24-48h).',
    book_agree_1: 'J\'accepte le',
    book_agree_2: 'Contrat de Location',
    book_summary_accom: 'Hébergement',
    book_summary_clean: 'Frais de Ménage',
    book_summary_tax: 'Taxes (10%)',
    book_summary_discount: 'Remise',

    // Guest Form
    label_firstname: 'Prénom',
    label_lastname: 'Nom',
    label_requests: 'Demandes Spéciales',
    placeholder_requests: 'Allergies, heure d\'arrivée, lit bébé...',

    // Contact Page
    contact_title: 'Contactez-nous',
    contact_desc: 'Notre équipe de conciergerie est disponible 24/7 pour vous assister dans votre réservation.',
    contact_btn: 'Envoyer le Message',

    // Login
    login_title: 'Connexion',
    login_welcome: 'Bienvenue',
    login_subtitle: 'Choisissez votre type de compte',
    login_tab_client: 'Espace Client',
    login_tab_staff: 'Accès Staff',
    login_label_email: 'Adresse Email',
    login_label_password: 'Mot de passe',
    login_label_ref: 'Référence Réservation (Optionnel)',
    login_btn: 'Se Connecter',
    login_back: 'Retour à l\'accueil',

    // Operations (Staff)
    ops_tab_brief: 'Brief',
    ops_tab_movements: 'Mouvements',
    ops_tab_tasks: 'Tâches',
    ops_tab_requests: 'Demandes',
    ops_tab_schedule: 'Planning',
    ops_tab_chat: 'Chat',
    ops_alert_req: 'Action Requise',
    ops_btn_panic: 'Signaler Panne',
    ops_btn_inventory: 'Inventaire',
    ops_status_clean: 'Propre',
    ops_status_dirty: 'Sale',
    ops_status_occupied: 'Occupé',
    ops_status_vacant: 'Libre',
    ops_section_arrivals: 'Arrivées',
    ops_section_departures: 'Départs',
    ops_btn_checkin: 'Check-in',
    ops_btn_checkout: 'Check-out',
    ops_task_mark_done: 'Marquer Fait',
    ops_task_review: 'En Validation',
    ops_tab_status: 'Statut',
    ops_tab_tickets: 'Tickets',
    ops_tab_stock: 'Stock',
    ops_tab_procedures: 'Procédures',
    ops_status_progress: 'En Cours',
    ops_task_checklist: 'Checklist',
    ops_task_evidence: 'Preuve',
    ops_btn_update: 'Mettre à jour',
    ops_task_approve: 'Approuver',
    ops_report_issue: 'Signaler Problème',
    op_check_ventilate: 'Aérer',
    op_check_bed_master: 'Lit Principal',
    op_check_bed_guest: 'Lits Invités',
    op_check_bath: 'Salles de bain',
    op_check_floors: 'Sols',
    op_check_kitchen: 'Cuisine',
    op_check_terrace: 'Terrasse',

    // Client Portal
    portal_welcome: 'Bienvenue,',
    portal_tab_home: 'Accueil',
    portal_tab_bookings: 'Séjours',
    portal_tab_chat: 'Chat',
    portal_tab_services: 'Services',
    portal_quick_wifi: 'Code WiFi',
    portal_quick_map: 'Itinéraire',
    portal_quick_guide: 'Guide Villa',
    portal_quick_concierge: 'Conciergerie',
    portal_booking_confirmed: 'Confirmé',
    portal_access_code: 'Code d\'accès',
    portal_start_checkin: 'Check-in Express',
    portal_experiences: 'Expériences',
    portal_chat_online: 'En ligne',
    portal_chat_placeholder: 'Écrivez votre message...',

    // Admin Sidebar
    admin_nav_overview: 'Vue d\'ensemble',
    admin_group_commercial: 'Commercial',
    admin_nav_bookings: 'Réservations',
    admin_nav_crm: 'CRM & Clients',
    admin_nav_properties: 'Villas & Tarifs',
    admin_group_ops: 'Opérations',
    admin_nav_staff: 'Staff & Planning',
    admin_nav_maintenance: 'Maintenance',
    admin_nav_inventory: 'Stocks',
    admin_nav_concierge: 'Conciergerie',
    admin_group_finance: 'Business',
    admin_nav_finance: 'Finance',
    admin_nav_marketing: 'Marketing',
    admin_group_cms: 'Contenu (CMS)',
    admin_nav_blog: 'Blog',
    admin_nav_guide: 'Guide',
    admin_nav_services: 'Services',
    admin_nav_media: 'Médiathèque',
    admin_nav_faq: 'FAQ',
    admin_nav_translations: 'Traductions',
    admin_group_system: 'Système',
    admin_nav_settings: 'Paramètres',
    admin_btn_logout: 'Déconnexion',

    // Admin Dashboard
    admin_dashboard_title: 'Tableau de Bord',
    admin_dashboard_subtitle: 'Bon retour, Administrateur.',
    admin_kpi_revenue: 'Revenu Total',
    admin_kpi_occupancy: 'Taux d\'Occupation',
    admin_kpi_guests: 'Invités Actifs',
    admin_kpi_issues: 'Tickets Ouverts',
    admin_chart_weekly: 'Activité Hebdomadaire',
    admin_chart_recent: 'Dernières Actions',
    admin_chart_revenue: 'Analyse des Revenus',
    admin_col_ref: 'Réf',
    admin_col_client: 'Client',
    admin_col_villa: 'Villa',
    admin_col_dates: 'Dates',
    admin_col_status: 'Statut',
    admin_col_total: 'Total',
    admin_col_pipeline: 'Pipeline',
    admin_col_item: 'Article',
    admin_col_category: 'Catégorie',
    admin_col_stock: 'En Stock',
    admin_col_min: 'Min',
    admin_btn_new_booking: 'Nouvelle Résa',
    admin_btn_add_client: 'Ajouter Client',
    admin_btn_create_ticket: 'Créer Ticket',
    admin_btn_order_stock: 'Commander',

    // Blog
    blog_title: 'Journal',
    blog_subtitle: 'Actualités & Histoires',
    blog_back: 'Retour au Journal',
    blog_related: 'Articles Similaires',
    blog_filter_tag: 'Tag :',
    blog_read_more: 'Lire la suite',
    blog_cat_all: 'Tout',
    blog_cat_local_life: 'Vie Locale',
    blog_cat_gastronomy: 'Gastronomie',
    blog_cat_culture: 'Culture',
    blog_cat_travel_tips: 'Conseils Voyage',
  },
  ES: { 
    nav_home: 'Inicio', nav_villas: 'Las Villas', nav_services: 'Servicios', nav_reviews: 'Reseñas', nav_journal: 'Diario', nav_guide: 'Descubrir Tétouan', nav_contact: 'Contacto', login_client: 'Área Cliente', login_staff: 'Acceso Personal',
    // Minimal fallback for demo
    login_title: 'Iniciar Sesión', login_btn: 'Entrar', ops_tab_brief: 'Resumen', ops_status_clean: 'Limpio', ops_status_dirty: 'Sucio', admin_nav_overview: 'Visión General', portal_welcome: 'Bienvenido,',
    home_section_title: 'Lujo Moderno y Herencia Marroquí', feat_secure: 'Seguridad y Privacidad', feat_service: 'Servicio Premium', cta_book_now: 'Reservar Ahora',
    label_select_villa: 'Seleccionar Villa', label_guests: 'Huéspedes', book_method_card: 'Tarjeta de Crédito', book_method_transfer: 'Transferencia Bancaria',
    admin_dashboard_title: 'Panel de Control', admin_dashboard_subtitle: 'Bienvenido de nuevo, Administrador.', admin_kpi_revenue: 'Ingresos Totales'
  },
  AR: { 
    nav_home: 'الرئيسية', nav_villas: 'الفيلات', nav_services: 'الخدمات', nav_reviews: 'آراء الزوار', nav_journal: 'المدونة', nav_guide: 'اكتشف تطوان', nav_contact: 'اتصل بنا', login_client: 'بوابة العميل', login_staff: 'دخول الموظفين',
    // Minimal fallback for demo
    login_title: 'تسجيل الدخول', login_btn: 'دخول', ops_tab_brief: 'ملخص', ops_status_clean: 'نظيف', ops_status_dirty: 'متسخ', admin_nav_overview: 'نظرة عامة', portal_welcome: 'مرحباً،',
    home_section_title: 'فخامة عصرية وتراث مغربي', feat_secure: 'أمن وخصوصية', feat_service: 'خدمة متميزة', cta_book_now: 'احجز الآن',
    label_select_villa: 'اختر فيلا', label_guests: 'الضيوف', book_method_card: 'بطاقة ائتمان', book_method_transfer: 'تحويل بنكي',
    admin_dashboard_title: 'لوحة التحكم', admin_dashboard_subtitle: 'مرحباً بعودتك، المسؤول.', admin_kpi_revenue: 'إجمالي الإيرادات'
  }
};


// Note: Mock data exports commented out - use database queries instead
// In Astro, fetch data using API routes or direct database queries
// Example: const villas = await db.select().from(villas);
/*
export const VILLAS = Seed.VILLAS;
export const MOCK_BOOKINGS = Seed.MOCK_BOOKINGS;
export const MOCK_CLIENTS = Seed.MOCK_CLIENTS;
export const MOCK_CLIENT_INTERACTIONS = Seed.MOCK_CLIENT_INTERACTIONS;
export const MOCK_TASKS = Seed.MOCK_TASKS;
export const MOCK_TICKETS = Seed.MOCK_TICKETS;
export const BLOG_POSTS = Seed.BLOG_POSTS;
export const INVENTORY_ITEMS = Seed.INVENTORY_ITEMS;
export const TETOUAN_GUIDE = Seed.TETOUAN_GUIDE;
export const ITINERARIES = Seed.ITINERARIES;
export const PREMIUM_SERVICES = Seed.PREMIUM_SERVICES;
export const MOCK_EXPENSES = Seed.MOCK_EXPENSES;
export const MOCK_SUPPLIERS = Seed.MOCK_SUPPLIERS;
export const MOCK_REVIEWS = Seed.MOCK_REVIEWS;
export const MOCK_CHAT = Seed.MOCK_CHAT;
export const FAQ_ITEMS = Seed.FAQ_ITEMS;
export const MOCK_NOTIFICATIONS = Seed.MOCK_NOTIFICATIONS;
export const MOCK_VILLA_STATUS = Seed.MOCK_VILLA_STATUS;
export const MOCK_STAFF = Seed.MOCK_STAFF;
export const MOCK_INVOICES = Seed.MOCK_INVOICES;
export const GROCERY_CATALOG = Seed.GROCERY_CATALOG;
export const MOCK_SERVICE_REQUESTS = Seed.MOCK_SERVICE_REQUESTS;
export const MOCK_MARKETING_CAMPAIGNS = Seed.MOCK_MARKETING_CAMPAIGNS;

export const MOCK_CATEGORIES = Seed.MOCK_CATEGORIES;
*/

// Mock Page Settings
export const MOCK_INDEX_SETTINGS = [
    {
        id: 'BLOG',
        heroTitle: { EN: 'Journal', FR: 'Le Journal', ES: 'Diario', AR: 'المدونة' },
        heroSubtitle: { EN: 'News & Stories', FR: 'Actualités & Histoires', ES: 'Noticias e Historias', AR: 'أخبار وقصص' },
        seo: { 
            title: { EN: 'Blog', FR: 'Blog', ES: 'Blog', AR: 'مدونة' },
            description: { EN: 'Latest news.', FR: 'Dernières nouvelles.', ES: 'Últimas noticias.', AR: 'أحدث الأخبار.' },
            keywords: ['blog', 'news']
        }
    },
    {
        id: 'GUIDE',
        heroTitle: { EN: 'Discover Tétouan', FR: 'Découvrir Tétouan', ES: 'Descubrir Tetuán', AR: 'اكتشف تطوان' },
        heroSubtitle: { EN: 'Local Guide', FR: 'Guide Local', ES: 'Guía Local', AR: 'دليل محلي' },
        seo: { 
            title: { EN: 'Guide', FR: 'Guide', ES: 'Guía', AR: 'دليل' },
            description: { EN: 'Local guide.', FR: 'Guide local.', ES: 'Guía local.', AR: 'دليل محلي.' },
            keywords: ['guide', 'travel']
        }
    }
];