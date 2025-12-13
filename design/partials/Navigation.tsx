
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, User, ShieldCheck, Bell, CloudSun, LogOut, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { UserRole } from '../../types';
import { MOCK_NOTIFICATIONS } from '../../constants';
import { useLanguage } from '../../LanguageContext';
import { useUser } from '../../auth/UserContext';

const WeatherWidget: React.FC = () => {
    return (
        <div className="flex items-center space-x-2 text-xs font-medium px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-slate-500 md:text-inherit">
            <CloudSun size={16} className="text-amber-500" />
            <span className="hidden lg:inline">Tétouan</span>
            <span className="font-bold">24°C</span>
        </div>
    )
}

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { role: userRole, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      const handleScroll = () => {
          setScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notifications = MOCK_NOTIFICATIONS.filter(n => 
    n.role === userRole || n.role === 'ALL' || 
    (userRole === UserRole.MANAGER && (n.role === UserRole.STAFF_MAINTENANCE || n.role === UserRole.STAFF_CLEANING))
  );
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { path: '/', label: t('nav_home') },
    { path: '/villas', label: t('nav_villas') },
    { path: '/services', label: t('nav_services') },
    { path: '/reviews', label: t('nav_reviews') },
    { path: '/journal', label: t('nav_journal') },
    { path: '/contact', label: t('nav_contact') },
  ];

  const currentPath = location.pathname;
  const isHomePage = currentPath === '/';
  const headerBg = isHomePage && !scrolled ? 'bg-transparent border-transparent' : 'bg-white/95 backdrop-blur-md border-stone-200 shadow-sm';
  const textColor = isHomePage && !scrolled ? 'text-white' : 'text-slate-800';
  const logoBg = isHomePage && !scrolled ? 'bg-white text-amber-600' : 'bg-amber-600 text-white';
  const subTextColor = isHomePage && !scrolled ? 'text-white/80' : 'text-amber-600';
  const iconColor = isHomePage && !scrolled ? 'text-white hover:text-amber-400' : 'text-slate-500 hover:text-amber-600';

  return (
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${headerBg} ${isHomePage && !scrolled ? 'pt-8' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/"
              className="flex-shrink-0 flex items-center cursor-pointer group" 
            >
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors duration-300 ${logoBg} ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <span className="font-serif font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className={`font-serif text-xl font-bold tracking-wide uppercase transition-colors duration-300 ${textColor}`}>Tétouan</h1>
                <p className={`text-xs tracking-widest uppercase transition-colors duration-300 ${subTextColor}`}>Luxury Villas</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-4 lg:space-x-6 items-center">
              {navItems.map((item) => {
                const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
                return (
                    <Link
                    key={item.path}
                    to={item.path}
                    className={`text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 ${
                        isActive
                        ? 'text-amber-500' 
                        : (isHomePage && !scrolled ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                    }`}
                    >
                    {item.label}
                    </Link>
                );
              })}

              {userRole !== UserRole.GUEST && (
                <Link
                  to={userRole === UserRole.MANAGER ? '/admin' : userRole === UserRole.CLIENT ? '/portal' : '/operations'}
                  className="text-xs font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700 ml-4"
                >
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className={`flex items-center space-x-2 lg:space-x-4 pl-4 md:pl-6 md:border-l ${isHomePage && !scrolled ? 'md:border-white/20' : 'md:border-stone-200'}`}>
                
                <div className={`hidden md:flex items-center space-x-2 lg:space-x-4 ${isHomePage && !scrolled ? 'text-white' : ''}`}>
                    <WeatherWidget />
                    
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
                    <div className="relative group">
                        <button className={`flex items-center transition text-xs font-bold uppercase ${iconColor}`}>
                            <Globe size={18} className={isRTL ? 'ml-1' : 'mr-1'} /> 
                            <span className="hidden lg:inline">{language}</span>
                        </button>
                        <div className={`absolute top-full mt-2 bg-white border border-stone-100 shadow-xl rounded hidden group-hover:block w-32 p-2 z-50 ${isRTL ? 'left-0' : 'right-0'}`}>
                            {['EN - English', 'FR - Français', 'AR - العربية', 'ES - Español'].map(l => (
                                <button key={l} onClick={() => setLanguage(l.split(' ')[0] as any)} className="block w-full text-left text-xs p-2 hover:bg-stone-50 text-slate-600">
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {userRole === UserRole.GUEST ? (
                        <Link to="/login" className={`transition ${iconColor}`} title="Login">
                            <LogIn size={20} />
                        </Link>
                    ) : (
                        <button onClick={logout} className={`transition ${iconColor}`} title="Logout">
                            <LogOut size={20} />
                        </button>
                    )}
                </div>
                
                <div className="hidden md:block">
                    {userRole === UserRole.GUEST && (
                      <Link 
                        to="/booking"
                        className={`inline-block px-4 lg:px-6 py-2 lg:py-3 rounded-sm text-[10px] lg:text-xs font-bold uppercase tracking-widest transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                            isHomePage && !scrolled ? 'bg-white text-slate-900 hover:bg-amber-50' : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        Book Now
                      </Link>
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
                <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-4 py-4 text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-amber-600 hover:bg-stone-50 border-b border-stone-50">
                  {item.label}
                </Link>
              ))}
              <div className="pt-6 space-y-4">
                 {userRole === UserRole.GUEST ? (
                     <>
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center border border-slate-900 text-slate-900 py-3 font-bold uppercase tracking-widest rounded-sm">
                            Connexion
                        </Link>
                        <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-amber-600 text-white py-4 font-bold uppercase tracking-widest shadow-lg rounded-sm">
                            Book Your Stay
                        </Link>
                     </>
                 ) : (
                     <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-center border border-red-200 text-red-600 py-3 font-bold uppercase tracking-widest rounded-sm">
                         Déconnexion
                     </button>
                 )}
              </div>
            </div>
          </div>
        )}
      </header>
  );
};
