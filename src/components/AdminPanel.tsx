import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './admin/AdminSidebar';
import { BlogManager, GuideManager, ServiceManager, TranslationManager, FAQManager, MediaManager } from './admin/cms/CMSModules';
import { FinanceManager, CRMManager, BookingsManager, PropertiesManager, MarketingManager } from './admin/business/BusinessModules';
import { StaffManager, InventoryManager, MaintenanceManager, ConciergeManager } from './admin/operations/OperationsModules';
import { SettingsManager } from './admin/system/SystemModules';
import { AdminDashboardOverview } from './AdminDashboard';
import { Menu } from 'lucide-react';
import { UserRole } from '@/types';
import { useNavigate } from '@tanstack/react-router';
import { t } from '@/lib/translations';

type AdminPanelProps = {
  role?: any;
  isLoading?: boolean;
  t?: (key: string) => string;
  lang?: string;
  logout?: () => void;
};

export default function AdminPanel({ role = UserRole.ADMIN, isLoading = false, t, lang }: AdminPanelProps) {
  const [activeModule, setActiveModule] = useState('overview');
  const [subTab, setSubTab] = useState('LIST');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate(); // Navigation hook
    const renderModule = () => {
      switch(activeModule) {
        case 'overview': return <AdminDashboardOverview t={t} lang={lang} />;
        case 'bookings': return <BookingsManager t={t} lang={lang} />;
        case 'crm': return <CRMManager t={t} lang={lang} />;
        case 'properties': return <PropertiesManager t={t} lang={lang} />;
        case 'finance': return <FinanceManager t={t} lang={lang} />;
        case 'marketing': return <MarketingManager t={t} lang={lang} />;
        case 'staff': return <StaffManager t={t} lang={lang} />;
        case 'inventory': return <InventoryManager t={t} lang={lang} />;
        case 'maintenance': return <MaintenanceManager t={t} lang={lang} />;
        case 'concierge': return <ConciergeManager t={t} lang={lang} />;
        case 'cms-blog': return <BlogManager t={t} lang={lang} />;
        case 'cms-guide': return <GuideManager t={t} lang={lang} />;
        case 'cms-services': return <ServiceManager t={t} lang={lang} />;
        case 'cms-translation': return <TranslationManager t={t} lang={lang} />;
        case 'cms-faq': return <FAQManager t={t} lang={lang} />;
        case 'cms-media': return <MediaManager t={t} lang={lang} />;
        case 'settings': return <SettingsManager t={t} lang={lang} />;
        default: return <AdminDashboardOverview t={t} lang={lang} />;
      }
    };

  useEffect(() => {
    if (!isLoading && role !== UserRole.ADMIN && role !== UserRole.MANAGER) {
      navigate({ to: '/login', search: {} });
    }
  }, [role, isLoading, navigate]);

  if (isLoading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Chargement...</div>;

  const handleNavigate = (module, sub = 'LIST') => {
    setActiveModule(module);
    setSubTab(sub);
    setMobileMenuOpen(false);
  };

  const renderModule = () => {
    switch(activeModule) {
      case 'overview': return <AdminDashboardOverview />;
      case 'bookings': return <BookingsManager />;
      case 'crm': return <CRMManager />;
      case 'properties': return <PropertiesManager />;
      case 'finance': return <FinanceManager />;
      case 'marketing': return <MarketingManager />;
      case 'operations': return <StaffManager />;
      case 'maintenance': return <MaintenanceManager />;
      case 'inventory': return <InventoryManager />;
      case 'concierge': return <ConciergeManager />;
      case 'cms_blog': return <BlogManager subTab={subTab} setSubTab={setSubTab} />;
      case 'cms_guide': return <GuideManager subTab={subTab} setSubTab={setSubTab} />;
      case 'cms_services': return <ServiceManager subTab={subTab} setSubTab={setSubTab} />;
      case 'cms_media': return <MediaManager />;
      case 'cms_faq': return <FAQManager />;
      case 'cms_translations': return <TranslationManager />;
      case 'settings': return <SettingsManager />;
      default: return <AdminDashboardOverview />;
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
