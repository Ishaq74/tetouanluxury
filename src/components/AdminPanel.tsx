import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './admin/AdminSidebar';
import { BlogManager, GuideManager, ServiceManager, TranslationManager, FAQManager, MediaManager } from './admin/cms/CMSModules';
import { FinanceManager, CRMManager, BookingsManager, PropertiesManager, MarketingManager } from './admin/business/BusinessModules';
import { StaffManager, InventoryManager, MaintenanceManager, ConciergeManager } from './admin/operations/OperationsModules';
import { SettingsManager } from './admin/system/SystemModules';
import { AdminDashboardOverview } from './AdminDashboard';
import { Menu } from 'lucide-react';
import { UserRole } from '../../types';
import { useNavigate } from '@tanstack/react-router';
import { t } from '@/lib/translations';

type AdminPanelProps = {
  role?: any;
  isLoading?: boolean;
  t?: (key: string) => string;
  lang?: string;
  logout?: () => void;
};

export default function AdminPanel({ role = UserRole.ADMIN, isLoading = false, t: tProp, lang, logout }: AdminPanelProps) {
  const [activeModule, setActiveModule] = useState('overview');
  const [subTab, setSubTab] = useState('LIST');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // Navigation hook
  
  // Simple fallback translation function
  const t = tProp || ((key: string) => key);
  
  // Simple fallback logout function
  const handleLogout = logout || (() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  });

  useEffect(() => {
    if (!isLoading && role !== UserRole.ADMIN && role !== UserRole.MANAGER) {
      // @ts-ignore - TanStack Router search type mismatch
      navigate({ to: '/login', search: {} });
    }
  }, [role, isLoading, navigate]);

  if (isLoading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Chargement...</div>;

  const handleNavigate = (module: string, sub = 'LIST') => {
    setActiveModule(module);
    setSubTab(sub);
    setMobileMenuOpen(false);
  };

  const renderModule = () => {
    // Default empty props for managers
    const defaultShowToast = (msg: string, type?: string) => console.log(msg);
    const defaultEmpty = () => {};
    
    switch(activeModule) {
      case 'overview': return <AdminDashboardOverview t={t} lang={lang} />;
      case 'bookings': return <BookingsManager 
        bookings={[]}
        villas={[]}
        addBooking={defaultEmpty}
        deleteBooking={defaultEmpty}
        updateBooking={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'crm': return <CRMManager 
        clients={[]}
        updateClient={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'properties': return <PropertiesManager 
        villas={[]}
        updateVilla={defaultEmpty}
        addVilla={defaultEmpty}
        deleteVilla={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'finance': return <FinanceManager 
        expenses={[]}
        invoices={[]}
        bookings={[]}
        addExpense={defaultEmpty}
        deleteExpense={defaultEmpty}
        deleteInvoice={defaultEmpty}
        addInvoice={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'marketing': return <MarketingManager 
        marketingCampaigns={[]}
        addMarketingCampaign={defaultEmpty}
        updateCampaignStatus={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'operations': return <StaffManager 
        staff={[]}
        updateStaffSchedule={defaultEmpty}
        addStaffMember={defaultEmpty}
        updateStaffMember={defaultEmpty}
        deleteStaffMember={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'maintenance': return <MaintenanceManager 
        tickets={[]}
        addTicket={defaultEmpty}
        updateTicketStatus={defaultEmpty}
        deleteTicket={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'inventory': return <InventoryManager 
        inventory={[]}
        updateInventory={defaultEmpty}
        addInventoryItem={defaultEmpty}
        updateInventoryItem={defaultEmpty}
        deleteInventoryItem={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'concierge': return <ConciergeManager 
        serviceRequests={[]}
        updateServiceRequestStatus={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'cms_blog': return <BlogManager 
        subTab={subTab} 
        setSubTab={setSubTab}
        blogPosts={[]}
        addBlogPost={defaultEmpty}
        updateBlogPost={defaultEmpty}
        deleteBlogPost={defaultEmpty}
        categories={[]}
        addCategory={defaultEmpty}
        updateCategory={defaultEmpty}
        deleteCategory={defaultEmpty}
        indexPageSettings={[]}
        updateIndexPageSettings={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'cms_guide': return <GuideManager 
        subTab={subTab} 
        setSubTab={setSubTab}
        guideItems={[]}
        addGuideItem={defaultEmpty}
        updateGuideItem={defaultEmpty}
        deleteGuideItem={defaultEmpty}
        categories={[]}
        addCategory={defaultEmpty}
        updateCategory={defaultEmpty}
        deleteCategory={defaultEmpty}
        indexPageSettings={[]}
        updateIndexPageSettings={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'cms_services': return <ServiceManager 
        subTab={subTab} 
        setSubTab={setSubTab}
        premiumServices={[]}
        addPremiumService={defaultEmpty}
        updatePremiumService={defaultEmpty}
        deletePremiumService={defaultEmpty}
        indexPageSettings={[]}
        updateIndexPageSettings={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'cms_media': return <MediaManager 
        mediaLibrary={[]}
        addMedia={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'cms_faq': return <FAQManager 
        faqs={[]}
        addFAQ={defaultEmpty}
        updateFAQ={defaultEmpty}
        deleteFAQ={defaultEmpty}
        showToast={defaultShowToast}
      />;
      case 'cms_translations': return <TranslationManager 
        translations={{ EN: {}, FR: {}, ES: {}, AR: {} }}
        updateTranslation={defaultEmpty}
      />;
      case 'settings': return <SettingsManager 
        showToast={defaultShowToast}
        resetData={defaultEmpty}
        staff={[]}
      />;
      default: return <AdminDashboardOverview t={t} lang={lang} />;
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 font-sans overflow-hidden text-slate-800">
      <AdminSidebar 
        activeModule={activeModule} 
        subTab={subTab} 
        onNavigate={handleNavigate} 
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        logout={handleLogout}
      />
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 md:px-8 shadow-sm shrink-0 z-10">
          <div className="flex items-center">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden mr-4 text-slate-500">
              <Menu size={24} />
            </button>
            <div className="flex items-center text-sm font-bold uppercase tracking-wide text-slate-500">
              <span className="text-slate-800">{activeModule.replace('_', ' ').replace('cms', 'CMS')}</span>
              {subTab && <span className="mx-2 text-slate-300">/</span>}
              {subTab && <span className="text-amber-600">{subTab}</span>}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow">
              {role === UserRole.ADMIN ? 'A' : 'M'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-stone-50">
          {renderModule()}
        </main>
      </div>
      <style>{`
        .btn-primary { @apply px-4 py-2 bg-slate-900 text-white rounded text-xs font-bold uppercase hover:bg-slate-800 transition flex items-center shadow-sm justify-center; }
        .btn-secondary { @apply px-4 py-2 border border-stone-200 text-slate-600 rounded text-xs font-bold uppercase hover:bg-stone-50 transition flex items-center justify-center; }
        .input-std { @apply w-full border border-stone-200 rounded p-2 text-sm outline-none focus:border-amber-600 transition focus:ring-1 focus:ring-amber-500/20 bg-white; }
        .label-xs { @apply block text-[10px] font-bold uppercase text-slate-500 mb-1 tracking-wide; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .animate-scale-up { animation: scaleUp 0.2s ease-out forwards; }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
