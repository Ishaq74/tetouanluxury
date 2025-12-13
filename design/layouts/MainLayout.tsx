
import React, { useState } from 'react';
import { Cookie, LogOut } from 'lucide-react';
import { useUser } from '../../auth/UserContext';
import { Navigation } from '../partials/Navigation';
import { Footer } from '../partials/Footer';
import { useNavigate } from '@tanstack/react-router';
import { UserRole } from '../../types';
import { t } from '@/lib/translations';

interface LayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  // TODO: Déterminer dynamiquement la langue utilisateur si besoin
  const lang = 'fr';
  const isRTL = lang === 'ar';
  const { role: userRole, login, logout } = useUser();
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole: string) => {
      let userData = { name: 'Invité', email: '' };
      let roleEnum = UserRole.GUEST;

      // DEFINITION STRICTE DES PERSONAS POUR LA DEMO
      switch (newRole) {
          case 'ADMIN':
              roleEnum = UserRole.ADMIN;
              userData = { name: 'Propriétaire', email: 'admin@villas.ma' };
              break;
          case 'MANAGER':
              roleEnum = UserRole.MANAGER;
              userData = { name: 'Sarah (Gérante)', email: 'manager@villas.ma' };
              break;
          case 'STAFF_CLEANING':
              roleEnum = UserRole.STAFF_CLEANING;
              userData = { name: 'Fatima Benali', email: 'fatima@villas.ma' }; // Correspond aux tâches seed.ts
              break;
          case 'STAFF_MAINTENANCE':
              roleEnum = UserRole.STAFF_MAINTENANCE;
              userData = { name: 'Hassan Idrissi', email: 'hassan@villas.ma' }; // Correspond aux tâches seed.ts
              break;
          case 'CLIENT':
              roleEnum = UserRole.CLIENT;
              userData = { name: 'Karim Benjelloun', email: 'karim.b@example.com' };
              break;
          default:
              roleEnum = UserRole.GUEST;
      }

      login(roleEnum, userData);

      // ROUTAGE STRICT
      if(roleEnum === UserRole.ADMIN) navigate({ to: '/admin' });
      else if(roleEnum === UserRole.MANAGER) navigate({ to: '/operations' }); // Le Manager va aux opérations pour superviser
      else if(roleEnum === UserRole.STAFF_CLEANING || roleEnum === UserRole.STAFF_MAINTENANCE) navigate({ to: '/operations' }); // Le Staff va aux opérations pour exécuter
      else if(roleEnum === UserRole.CLIENT) navigate({ to: '/portal' });
      else navigate({ to: '/' });
  };

  return (
    <div className={`min-h-screen flex flex-col bg-stone-50 font-sans ${isRTL ? 'font-arabic' : ''}`}>
      {/* Top Bar - DEMO CONTROLS STRICTS */}
      <div className="bg-slate-900 text-slate-400 text-xs py-2 px-4 flex justify-between items-center relative z-[60]">
        <span className="hidden md:inline font-mono">DEMO MODE v3</span>
        <div className="flex items-center space-x-4 ml-auto">
          <span className="text-[10px] uppercase font-bold text-amber-500">{t('quick_login', lang) || 'Connexion Rapide :'}</span>
          <select 
            value={userRole} 
            onChange={(e) => handleRoleSwitch(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded px-2 py-1 outline-none cursor-pointer hover:bg-slate-700 transition focus:border-amber-500"
          >
            <option value="GUEST">{t('role_guest', lang) || 'Visiteur (Site Public)'}</option>
            <option value="CLIENT">{t('role_client', lang) || 'Client (Espace Locataire)'}</option>
            <option disabled>──────────</option>
            <option value="STAFF_CLEANING">{t('role_staff_cleaning', lang) || 'Employé (Fatima - App Mobile)'}</option>
            <option value="MANAGER">{t('role_manager', lang) || 'Manager (Sarah - Supervision)'}</option>
            <option disabled>──────────</option>
            <option value="ADMIN">{t('role_admin', lang) || 'Admin (Propriétaire - Global)'}</option>
          </select>
          {userRole !== UserRole.GUEST && (
              <button onClick={logout} className="text-slate-400 hover:text-white"><LogOut size={14}/></button>
          )}
        </div>
      </div>

      <Navigation />

      <main className="flex-grow relative">
        {children}
      </main>

      {showCookieBanner && (
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md text-white p-4 shadow-2xl z-[100] animate-slide-up border-t border-slate-700">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center">
                      <Cookie size={24} className={`text-amber-600 shrink-0 ${isRTL ? 'ml-4' : 'mr-4'}`} />
                      <p className="text-xs text-slate-300 leading-relaxed">
                          {t('cookie_notice', lang) || 'Ce site utilise des cookies.'}
                      </p>
                  </div>
                  <div className="flex space-x-4 shrink-0">
                      <button onClick={() => setShowCookieBanner(false)} className="text-xs text-slate-400 hover:text-white font-bold uppercase px-4 py-2">{t('close', lang) || 'Fermer'}</button>
                  </div>
              </div>
          </div>
      )}

      <Footer />
    </div>
  );
};
