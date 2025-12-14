
import React from 'react';
import { 
    LayoutDashboard, CalendarDays, UserCheck, Home, 
    Wrench, BellRing, Wallet, Megaphone, 
    FileText, MapPin, Star, HelpCircle, Globe, 
    Settings, Box, Users, LogOut, Image as ImageIcon,
    X 
} from 'lucide-react';

import { useLanguage } from '../../LanguageContext';

interface AdminSidebarProps {
    activeModule: string;
    subTab: string;
    onNavigate: (module: string, subTab?: string) => void;
    mobileOpen?: boolean;
    onMobileClose?: () => void;
    logout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeModule, subTab, onNavigate, mobileOpen, onMobileClose, logout }) => {
    const { t } = useLanguage();
    
    const NavItem = ({ id, label, icon: Icon, defaultSub = 'LIST' }: { id: string, label: string, icon: any, defaultSub?: string }) => (
        <button 
            onClick={() => { onNavigate(id, defaultSub); if(onMobileClose) onMobileClose(); }} 
            className={`w-full flex items-center px-4 py-3 text-xs font-bold transition-all duration-200 rounded-r-md border-l-4 mb-1 ${
                activeModule === id 
                ? 'bg-amber-50 border-amber-600 text-amber-700' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
        >
            <Icon size={16} className={`mr-3 ${activeModule === id ? 'text-amber-600' : 'text-slate-500'}`} />
            {label}
        </button>
    );

    const GroupLabel = ({ label }: { label: string }) => (
        <p className="px-4 mt-6 mb-2 text-[10px] font-bold uppercase text-slate-500 tracking-widest opacity-70">{label}</p>
    );

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 h-full transition-transform transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
            <div className="p-6 shrink-0 flex justify-between items-center">
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center font-serif font-bold text-white shadow-lg">T</div>
                        <span className="font-serif text-lg font-bold text-white tracking-wide">Tétouan Admin</span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest pl-11">Suite Intégrale v4.0</p>
                </div>
                <button onClick={onMobileClose} className="md:hidden text-slate-400"><X size={20}/></button>
            </div>

            <nav className="flex-1 pb-10 overflow-y-auto custom-scrollbar">
                <NavItem id="overview" label={t('admin_nav_overview')} icon={LayoutDashboard} />

                <GroupLabel label={t('admin_group_commercial')} />
                <NavItem id="bookings" label={t('admin_nav_bookings')} icon={CalendarDays} />
                <NavItem id="crm" label={t('admin_nav_crm')} icon={UserCheck} defaultSub="PIPELINE" />
                <NavItem id="properties" label={t('admin_nav_properties')} icon={Home} />

                <GroupLabel label={t('admin_group_ops')} />
                <NavItem id="operations" label={t('admin_nav_staff')} icon={Users} defaultSub="STAFF" />
                <NavItem id="maintenance" label={t('admin_nav_maintenance')} icon={Wrench} />
                <NavItem id="inventory" label={t('admin_nav_inventory')} icon={Box} />
                <NavItem id="concierge" label={t('admin_nav_concierge')} icon={BellRing} />

                <GroupLabel label={t('admin_group_finance')} />
                <NavItem id="finance" label={t('admin_nav_finance')} icon={Wallet} defaultSub="INVOICES" />
                <NavItem id="marketing" label={t('admin_nav_marketing')} icon={Megaphone} defaultSub="CAMPAIGNS" />

                <GroupLabel label={t('admin_group_cms')} />
                <NavItem id="cms_blog" label={t('admin_nav_blog')} icon={FileText} defaultSub="POSTS" />
                <NavItem id="cms_guide" label={t('admin_nav_guide')} icon={MapPin} defaultSub="PLACES" />
                <NavItem id="cms_services" label={t('admin_nav_services')} icon={Star} defaultSub="ITEMS" />
                <NavItem id="cms_media" label={t('admin_nav_media')} icon={ImageIcon} />
                <NavItem id="cms_faq" label={t('admin_nav_faq')} icon={HelpCircle} />
                <NavItem id="cms_translations" label={t('admin_nav_translations')} icon={Globe} />

                <GroupLabel label={t('admin_group_system')} />
                <NavItem id="settings" label={t('admin_nav_settings')} icon={Settings} />
            </nav>

            <div className="p-4 border-t border-slate-800 shrink-0">
                <button onClick={logout} className="flex items-center text-xs font-bold text-slate-500 hover:text-red-400 transition w-full px-4 py-2 rounded hover:bg-slate-800">
                    <LogOut size={14} className="mr-2" /> {t('admin_btn_logout')}
                </button>
            </div>
        </div>
    );
};
