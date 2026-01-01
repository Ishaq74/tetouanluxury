
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, User, ShieldCheck, Bell, Cookie, CloudSun, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { UserRole } from '../../types';
import { MOCK_NOTIFICATIONS } from '../lib/constants';
import { useLanguage } from './LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const WeatherWidget: React.FC = () => {
    return (
        <div className="flex items-center space-x-2 text-xs font-medium px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-slate-500 md:text-inherit">
            <CloudSun size={16} className="text-amber-500" />
            <span className="hidden lg:inline">Tétouan</span>
            <span className="font-bold">24°C</span>
        </div>
    )
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onRoleChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t, isRTL } = useLanguage();
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRoleSwitch = (newRole: UserRole) => {
      onRoleChange(newRole);
      if(newRole === UserRole.MANAGER) navigate({ to: '/admin' } as any);
      else if(newRole === UserRole.STAFF_CLEANING) navigate({ to: '/operations' } as any);
      else if(newRole === UserRole.CLIENT) navigate({ to: '/portal' } as any);
      else navigate({ to: '/' } as any);
  };

  const currentPath = location.pathname;
  const isHomePage = currentPath === '/';
  
  // Clean header logic: Admin/Staff/Portal have different headers usually, but for this monolithic layout:
  // If in Admin/Portal/Ops, we might want a simpler header or sidebar (handled by those page components mostly).
  // This Layout header is primarily for the Public facing site.
  
  const isPublicPage = ['/', '/villas', '/services', '/journal', '/contact', '/booking'].some(p => currentPath.startsWith(p));
  
  if (!isPublicPage) {
      return <>{children}</>; // Don't render public header/footer for Admin/Portal/Ops (they have their own)
  }

  const headerBg = isHomePage && !scrolled ? 'bg-transparent border-transparent' : 'bg-white/95 backdrop-blur-md border-stone-200 shadow-sm';
  const textColor = isHomePage && !scrolled ? 'text-white' : 'text-slate-800';
  const logoBg = isHomePage && !scrolled ? 'bg-white text-amber-600' : 'bg-amber-600 text-white';
  const subTextColor = isHomePage && !scrolled ? 'text-white/80' : 'text-amber-600';
  const iconColor = isHomePage && !scrolled ? 'text-white hover:text-amber-400' : 'text-slate-500 hover:text-amber-600';

  const navItems = [
    { path: '/', label: t('nav_home') },
    { path: '/villas', label: t('nav_villas') },
    { path: '/services', label: t('nav_services') },
    { path: '/journal', label: t('nav_journal') },
    { path: '/contact', label: t('nav_contact') },
  ];

  return (
    <div className={`min-h-screen flex flex-col bg-stone-50 font-sans ${isRTL ? 'font-arabic' : ''}`}>
      {/* Demo Role Switcher (Hidden in prod) */}
      <div className="bg-slate-900 text-slate-400 text-[10px] py-1 px-4 flex justify-between items-center relative z-[60]">
        <span className="hidden md:inline font-bold uppercase tracking-widest">Demo Mode</span>
        <div className="flex items-center space-x-2 ml-auto">
          <span>Switch Role:</span>
          <select 
            value={userRole} 
            onChange={(e) => handleRoleSwitch(e.target.value as UserRole)}
            className="bg-slate-800 border-none text-white rounded px-2 py-0.5 outline-none cursor-pointer hover:bg-slate-700 transition"
          >
            <option value={UserRole.GUEST}>Guest</option>
            <option value={UserRole.CLIENT}>Client</option>
            <option value={UserRole.MANAGER}>Admin</option>
            <option value={UserRole.STAFF_CLEANING}>Staff</option>
          </select>
        </div>
      </div>

      <header className={`fixed top-6 w-full z-50 transition-all duration-500 border-b ${headerBg} ${isHomePage && !scrolled ? 'pt-4 border-b-0' : 'top-0 pt-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" search={{} as any} className="flex-shrink-0 flex items-center cursor-pointer group">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors duration-300 ${logoBg} ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <span className="font-serif font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className={`font-serif text-xl font-bold tracking-wide uppercase transition-colors duration-300 ${textColor}`}>Tétouan</h1>
                <p className={`text-xs tracking-widest uppercase transition-colors duration-300 ${subTextColor}`}>Luxury Villas</p>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex space-x-6 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 ${
                    (currentPath === item.path) ? 'text-amber-500' : (isHomePage && !scrolled ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
                <div className={`hidden md:flex items-center ${isHomePage && !scrolled ? 'text-white' : ''}`}>
                    <WeatherWidget />
                </div>
                <Link to="/login" search={{} as any} className={`hidden md:flex items-center space-x-2 text-xs font-bold uppercase transition ${iconColor}`}>
                    <User size={18} />
                    <span>Login</span>
                </Link>
                <Link 
                    to="/booking"
                    search={{} as any}
                    className={`hidden md:inline-block px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                        isHomePage && !scrolled ? 'bg-white text-slate-900 hover:bg-amber-50' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                >
                    Book Now
                </Link>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`md:hidden p-2 ${iconColor}`}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200 absolute w-full shadow-xl h-screen overflow-y-auto animate-fade-in">
            <div className="px-6 pt-4 pb-8 space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-4 py-4 text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-amber-600 hover:bg-stone-50 border-b border-stone-50">
                  {item.label}
                </Link>
              ))}
              <div className="pt-6">
                 <Link to="/booking" search={{} as any} onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-amber-600 text-white py-4 font-bold uppercase tracking-widest shadow-lg rounded-sm">
                    Book Your Stay
                  </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow relative">
        {children}
      </main>

      {showCookieBanner && (
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md text-white p-4 shadow-2xl z-[100] animate-slide-up border-t border-slate-700">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center text-xs text-slate-300">
                      <Cookie size={18} className="text-amber-600 mr-3" />
                      <p>We use cookies to ensure the best experience.</p>
                  </div>
                  <button onClick={() => setShowCookieBanner(false)} className="bg-amber-600 text-white px-6 py-2 rounded-sm text-xs font-bold uppercase hover:bg-amber-700 transition">Accept</button>
              </div>
          </div>
      )}

      <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center md:text-left">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div>
                    <h3 className="font-serif text-2xl mb-4">Tétouan Villas</h3>
                    <p className="text-slate-400 text-sm">Luxury rentals in Northern Morocco.</p>
                </div>
                {/* Footer links omitted for brevity */}
            </div>
            <p className="text-xs text-slate-500 text-center pt-8 border-t border-slate-800">&copy; 2023 Tétouan Luxury Villas.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
