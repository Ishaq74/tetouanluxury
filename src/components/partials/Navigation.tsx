import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, User, ShieldCheck, Bell, CloudSun, LogOut, LogIn } from 'lucide-react';
import { UserRole } from '../../../types';
// Le composant Navigation attend maintenant une prop t (Astro.props.locals.t) et locale
export interface NavigationProps {
  userRole: UserRole;
  logout: () => void;
  lang?: string;
  t: (key: string) => string;
  locale?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ userRole, logout, t, locale }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rtlLangs = ['ar'];
  const isRTL = rtlLangs.includes(locale || 'fr');

  useEffect(() => {
      const handleScroll = () => {
          setScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // TODO: Remplacer par des notifications réelles (API ou store global)
  const notifications: any[] = [];
  const unreadCount = 0;

  // Correction de la navigation Astro/i18n
  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/villas', label: t('nav.villas') },
    { path: '/services', label: t('nav.services') },
    { path: '/reviews', label: t('nav_reviews') },
    { path: '/journal', label: t('nav_journal') },
    { path: '/contact', label: t('nav.contact') },
  ];
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isHomePage = currentPath === '/';
  const headerBg = isHomePage && !scrolled ? 'bg-transparent border-transparent' : 'bg-white/95 backdrop-blur-md border-stone-200 shadow-sm';
  const textColor = isHomePage && !scrolled ? 'text-white' : 'text-slate-800';
  const logoBg = isHomePage && !scrolled ? 'bg-white text-amber-600' : 'bg-amber-600 text-white';
  const subTextColor = isHomePage && !scrolled ? 'text-white/80' : 'text-amber-600';
  const iconColor = isHomePage && !scrolled ? 'text-white hover:text-amber-400' : 'text-slate-500 hover:text-amber-600';
  const lang = locale || 'fr';

  return (
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${headerBg} ${isHomePage && !scrolled ? 'pt-8' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <a href={`/${lang}`} className="flex-shrink-0 flex items-center cursor-pointer group">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors duration-300 ${logoBg} ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <span className="font-serif font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className={`font-serif text-xl font-bold tracking-wide uppercase transition-colors duration-300 ${textColor}`}>Tétouan</h1>
                <p className={`text-xs tracking-widest uppercase transition-colors duration-300 ${subTextColor}`}>Luxury Villas</p>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-4 lg:space-x-6 items-center">
              {navItems.map((item) => {
                const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
                return (
                  <a
                    key={item.path}
                    href={`/${lang}${item.path === '/' ? '' : item.path}`}
                    className={`text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 ${
                      isActive
                        ? 'text-amber-500'
                        : isHomePage && !scrolled
                        ? 'text-white/90 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              {userRole !== UserRole.GUEST && (
                <a
                  href={`/${lang}${userRole === UserRole.MANAGER ? '/admin' : userRole === UserRole.CLIENT ? '/portal' : '/operations'}`}
                  className="text-xs font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700 ml-4"
                >
                  {t('dashboard')}
                </a>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className={`flex items-center space-x-2 lg:space-x-4 pl-4 md:pl-6 md:border-l ${isHomePage && !scrolled ? 'md:border-white/20' : 'md:border-stone-200'}`}>
                
                <div className={`hidden md:flex items-center space-x-2 lg:space-x-4 ${isHomePage && !scrolled ? 'text-white' : ''}`}>
                  {/* WeatherWidget inline */}
                  <div className="flex items-center space-x-2 text-xs font-medium px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-slate-500 md:text-inherit">
                    <span className="text-amber-500">☀️</span>
                    <span className="hidden lg:inline">Tétouan</span>
                    <span className="font-bold">24°C</span>
                  </div>
                    
                    {/* Notification Bell */}
                    {userRole !== UserRole.GUEST && (
                        <div className="relative">
                            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className={`transition relative ${iconColor}`}>
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{unreadCount}</span>
                                )}
                            </button>
                            {isNotifOpen && (
                                <div className={`absolute top-full mt-4 w-80 bg-white border border-stone-200 shadow-xl rounded-sm z-50 animate-fade-in ${isRTL ? 'left-0' : 'right-0'}`}>
                                    {/* ... Notif Content ... */}
                                    <div className="p-4 border-b border-stone-100 font-bold text-xs uppercase text-slate-500 flex justify-between items-center">
                                        <span>Notifications</span>
                                        <button onClick={() => setIsNotifOpen(false)}><X size={14}/></button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? <div className="p-6 text-center text-xs text-slate-400">No new notifications</div> : 
                                            notifications.map(n => (
                                                <div key={n.id} className="p-4 border-b border-stone-50 hover:bg-stone-50">
                                                    <p className="text-sm font-bold text-slate-800">{n.title}</p>
                                                    <p className="text-xs text-slate-500">{n.message}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Account Actions */}
                <div className="flex items-center space-x-2 lg:space-x-3">
                    {userRole === UserRole.GUEST ? (
                        <a href={`/${lang}/login`} className={`transition ${iconColor}`} title={t('login')}>
                          <LogIn size={20} />
                        </a>
                    ) : (
                        <button onClick={logout} className={`transition ${iconColor}`} title={t('logout')}>
                            <LogOut size={20} />
                        </button>
                    )}
                </div>
                
                <div className="hidden md:block">
                  {userRole === UserRole.GUEST && (
                    <a 
                      href={`/${lang}/booking`}
                      className={`inline-block px-4 lg:px-6 py-2 lg:py-3 rounded-sm text-[10px] lg:text-xs font-bold uppercase tracking-widest transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                        isHomePage && !scrolled ? 'bg-white text-slate-900 hover:bg-amber-50' : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {t('book_now')}
                    </a>
                  )}
                </div>

                <div className="md:hidden">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 ${iconColor}`}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200 absolute w-full shadow-xl h-screen overflow-y-auto animate-fade-in">
            <div className="px-6 pt-4 pb-8 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={`/${lang}${item.path === '/' ? '' : item.path}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-4 py-4 text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-amber-600 hover:bg-stone-50 border-b border-stone-50"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-6 space-y-4">
                 {userRole === UserRole.GUEST ? (
                     <>
                        <a href={`/${lang}/login`} onClick={() => setIsMenuOpen(false)} className="block w-full text-center border border-slate-900 text-slate-900 py-3 font-bold uppercase tracking-widest rounded-sm">
                          {t('login')}
                        </a>
                        <a href={`/${lang}/booking`} onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-amber-600 text-white py-4 font-bold uppercase tracking-widest shadow-lg rounded-sm">
                          {t('book_now')}
                        </a>
                     </>
                 ) : (
                     <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-center border border-red-200 text-red-600 py-3 font-bold uppercase tracking-widest rounded-sm">
                         {t('logout')}
                     </button>
                 )}
              </div>
            </div>
          </div>
        )}
      </header>
  );
};
