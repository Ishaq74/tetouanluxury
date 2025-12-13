import React, { useState, useEffect, useRef } from 'react';
import { 
    Download, MessageCircle, Wifi, Map as MapIcon, Coffee, X, ChefHat, Car, 
    CheckCircle, Upload, ArrowRight, Check, User, Calendar, CreditCard, 
    FileText, Star, ShoppingBag, Key, BellRing, Eraser, Send, Phone, MapPin,
    ThermometerSun, Moon, Sun, Lock, BookOpen, Plus, Minus, ShoppingCart, Home
} from 'lucide-react';
import { PREMIUM_SERVICES, GROCERY_CATALOG, MOCK_CLIENT_INTERACTIONS, VILLAS } from '../constants';
import { BookingStatus, ClientInteraction, ServiceRequest, Booking } from '../types';
import { useLanguage } from '../LanguageContext';
import { useData } from '../DataContext';
import { useToast } from '../ToastContext';
import { useUser } from '../auth/UserContext';
import { PremiumImage } from '../design/components/Common';

// --- COMPONENTS ---

const QuickAction = ({ icon: Icon, label, onClick, highlight = false }: any) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 shadow-sm active:scale-95 ${highlight ? 'bg-amber-600 border-amber-600 text-white shadow-amber-200' : 'bg-white border-stone-100 text-slate-600 hover:border-amber-200 hover:shadow-md'}`}
    >
        <div className={`p-3 rounded-full mb-2 ${highlight ? 'bg-white/20' : 'bg-stone-50'}`}>
            <Icon size={24} className={highlight ? 'text-white' : 'text-amber-600'} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
    </button>
);

const ServiceCard = ({ service, onSelect }: any) => (
    <div onClick={onSelect} className="group bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between">
        <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition">
                {service.title.EN.includes('Chef') ? <ChefHat size={20} /> : <Car size={20} />}
            </div>
            <div className="ml-4">
                <h4 className="font-bold text-slate-800 text-sm">{service.title.EN}</h4>
                <p className="text-xs text-amber-600 font-bold">{service.price}</p>
            </div>
        </div>
        <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white transition">
            <Plus size={16} />
        </div>
    </div>
);

// --- MAIN PAGE ---

export const PortalPage: React.FC = () => {
    const { t } = useLanguage();
    const { bookings, serviceRequests, addServiceRequest } = useData(); 
    const { showToast } = useToast();
    const { user } = useUser();

    // State
    const [activeTab, setActiveTab] = useState<'HOME' | 'BOOKINGS' | 'CHAT' | 'SERVICES'>('HOME');
    const [showWifiModal, setShowWifiModal] = useState(false);
    const [showDoorCode, setShowDoorCode] = useState(false);
    const [showCheckIn, setShowCheckIn] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [localChat, setLocalChat] = useState<ClientInteraction[]>([]);
    
    // User Data Handling
    const currentUserName = user?.name || 'Invité';
    // Mock Logic: If logged in as specific demo user, show specific booking, else generic
    const myBookings = bookings.filter(b => b.clientName === currentUserName || b.clientEmail === user?.email);
    const displayBooking = myBookings.find(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.CHECKED_IN) || bookings[0];
    const villa = VILLAS.find(v => v.id === displayBooking?.villaId);

    // Chat Scroll
    const chatEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [localChat, activeTab]);
    useEffect(() => { setLocalChat(MOCK_CLIENT_INTERACTIONS.filter(i => i.clientId === 'CL-001')); }, []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if(!chatMessage.trim()) return;
        const newMsg: ClientInteraction = { id: Date.now().toString(), clientId: 'CL-001', type: 'WHATSAPP', direction: 'INBOUND', content: chatMessage, date: 'Now' };
        setLocalChat([...localChat, newMsg]);
        setChatMessage('');
        setTimeout(() => {
            setLocalChat(prev => [...prev, { id: (Date.now()+1).toString(), clientId: 'CL-001', type: 'WHATSAPP', direction: 'OUTBOUND', content: 'We received your message. Our concierge will reply shortly.', date: 'Now', agent: 'Concierge' }]);
        }, 1500);
    };

    // --- RENDERERS ---

    const renderHome = () => (
        <div className="space-y-6 animate-fade-in pb-24">
            {/* Immersive Header */}
            <div className="relative h-72 -mt-20">
                <div className="absolute inset-0">
                    <img src={villa?.images[0]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-stone-50"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">{t('portal_welcome')}</p>
                            <h1 className="text-3xl font-serif text-slate-900 font-bold leading-none">{currentUserName.split(' ')[0]}</h1>
                        </div>
                        <div className="text-right bg-white/20 backdrop-blur-md p-2 rounded-lg border border-white/30 text-slate-800">
                            <div className="flex items-center justify-end text-xs font-bold"><ThermometerSun size={14} className="mr-1"/> 24°C</div>
                            <p className="text-[10px] uppercase tracking-wide">Tétouan</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6">
                {/* Booking Status Card */}
                <div className="bg-white p-5 rounded-2xl shadow-lg border border-stone-100 relative overflow-hidden mb-8 transform -translate-y-8">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-slate-800">{villa?.name}</h3>
                            <p className="text-xs text-slate-500">{displayBooking?.startDate} — {displayBooking?.endDate}</p>
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center">
                            <CheckCircle size={10} className="mr-1"/> {t('portal_booking_confirmed')}
                        </span>
                    </div>
                    
                    {displayBooking.status === BookingStatus.CHECKED_IN ? (
                        <div className="bg-stone-900 rounded-xl p-4 text-center text-white relative overflow-hidden group cursor-pointer" onClick={() => setShowDoorCode(!showDoorCode)}>
                            <div className="relative z-10">
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">{t('portal_access_code')}</p>
                                <p className="text-3xl font-mono font-bold tracking-widest transition-all duration-300">
                                    {showDoorCode ? '8492' : '••••'}
                                </p>
                                <p className="text-[10px] text-stone-500 mt-1">{showDoorCode ? 'Appuyez pour masquer' : 'Appuyez pour révéler'}</p>
                            </div>
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-800 w-16 h-16 opacity-20" />
                        </div>
                    ) : (
                        <button onClick={() => setShowCheckIn(true)} className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold uppercase text-xs shadow-lg shadow-amber-200 hover:bg-amber-700 transition flex items-center justify-center">
                            <Key size={16} className="mr-2"/> {t('portal_start_checkin')}
                        </button>
                    )}
                </div>

                {/* Quick Actions Grid */}
                <h3 className="font-serif text-lg text-slate-900 mb-4">Accès Rapide</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <QuickAction icon={Wifi} label={t('portal_quick_wifi')} onClick={() => setShowWifiModal(true)} />
                    <QuickAction icon={MapIcon} label={t('portal_quick_map')} onClick={() => window.open(`https://maps.google.com/?q=${villa?.name} Tetouan`)} />
                    <QuickAction icon={BookOpen} label={t('portal_quick_guide')} onClick={() => {}} />
                    <QuickAction icon={MessageCircle} label={t('portal_quick_concierge')} onClick={() => setActiveTab('CHAT')} highlight />
                </div>

                {/* Upsell Carousel */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-lg text-slate-900">{t('portal_experiences')}</h3>
                    <button onClick={() => setActiveTab('SERVICES')} className="text-xs font-bold uppercase text-amber-600">Voir tout</button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4 snap-x">
                    {PREMIUM_SERVICES.map(srv => (
                        <div key={srv.id} className="min-w-[240px] bg-white p-4 rounded-xl border border-stone-200 snap-center">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-stone-50 rounded-lg text-amber-600">
                                    {srv.category === 'Dining' ? <ChefHat size={20}/> : <Car size={20}/>}
                                </div>
                                <span className="font-bold text-xs bg-stone-100 px-2 py-1 rounded">{srv.price}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 mb-1">{srv.title.EN}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2">{srv.desc.EN}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderChat = () => (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-stone-100">
            <div className="bg-white p-4 shadow-sm flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-serif mr-3">C</div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">Conciergerie</h3>
                        <p className="text-[10px] text-green-600 flex items-center font-bold"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span> {t('portal_chat_online')}</p>
                    </div>
                </div>
                <a href="tel:+212600000000" className="p-2 bg-stone-100 rounded-full text-slate-600"><Phone size={18}/></a>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest my-4">Aujourd'hui</div>
                {localChat.map(msg => (
                    <div key={msg.id} className={`flex ${msg.direction === 'OUTBOUND' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.direction === 'OUTBOUND' ? 'bg-white text-slate-700 rounded-tl-none' : 'bg-amber-600 text-white rounded-tr-none'}`}>
                            <p>{msg.content}</p>
                            <span className={`text-[9px] block text-right mt-1 opacity-70`}>{msg.date}</span>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-stone-200 shrink-0 flex items-center space-x-2">
                <input 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder={t('portal_chat_placeholder')}
                    className="flex-1 bg-stone-100 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <button type="submit" disabled={!chatMessage.trim()} className="p-3 bg-slate-900 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );

    // --- WIZARD MODAL (CHECK-IN) ---
    const CheckInModal = () => {
        const [step, setStep] = useState(1);
        const [signature, setSignature] = useState<string|null>(null);
        const sigRef = useRef<HTMLCanvasElement>(null);
        const [drawing, setDrawing] = useState(false);

        // Simple signature logic
        const startDraw = (e: any) => {
            const ctx = sigRef.current?.getContext('2d');
            if(ctx) { ctx.beginPath(); ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); setDrawing(true); }
        }
        const moveDraw = (e: any) => {
            if(!drawing) return;
            const ctx = sigRef.current?.getContext('2d');
            if(ctx) { ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.stroke(); }
        }
        const endDraw = () => { setDrawing(false); setSignature('signed'); } // Mock signature save

        return (
            <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col animate-slide-up">
                <div className="flex justify-between items-center p-6 text-white">
                    <h2 className="font-serif text-xl">{t('portal_start_checkin')}</h2>
                    <button onClick={() => setShowCheckIn(false)}><X/></button>
                </div>
                
                <div className="flex-1 bg-stone-50 rounded-t-3xl p-8 overflow-y-auto">
                    {/* Progress */}
                    <div className="flex justify-center mb-8 space-x-2">
                        {[1,2,3].map(i => <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-amber-600' : 'bg-stone-200'}`}></div>)}
                    </div>

                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="font-bold text-2xl text-slate-900">Documents d'identité</h3>
                            <p className="text-slate-500 text-sm">Pour se conformer à la loi marocaine, veuillez scanner votre passeport.</p>
                            <div className="border-2 border-dashed border-stone-300 rounded-xl h-48 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-amber-500 transition group">
                                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-amber-50">
                                    <Upload className="text-stone-400 group-hover:text-amber-600"/>
                                </div>
                                <span className="font-bold text-stone-600">Scanner Passeport</span>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full btn-primary py-4 text-sm mt-8">Continuer</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="font-bold text-2xl text-slate-900">Règlement Intérieur</h3>
                            <div className="bg-white p-4 rounded-xl shadow-sm h-48 overflow-y-auto text-xs text-slate-500 border border-stone-200">
                                <p className="mb-2 font-bold">1. RESPECT DES LIEUX</p>
                                <p className="mb-4">Les locataires s'engagent à respecter...</p>
                                <p className="mb-2 font-bold">2. BRUIT & VOISINAGE</p>
                                <p>Pas de fêtes après 22h...</p>
                            </div>
                            <label className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-stone-200">
                                <input type="checkbox" className="w-5 h-5 text-amber-600 rounded focus:ring-amber-600" />
                                <span className="text-sm font-bold text-slate-800">J'accepte le règlement</span>
                            </label>
                            <button onClick={() => setStep(3)} className="w-full btn-primary py-4 text-sm">Continuer</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="font-bold text-2xl text-slate-900">Signature</h3>
                            <div className="bg-white border border-stone-300 rounded-xl overflow-hidden h-48 relative">
                                <canvas 
                                    ref={sigRef} 
                                    onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw}
                                    className="w-full h-full cursor-crosshair"
                                    width={400} height={200}
                                />
                                {!signature && <span className="absolute inset-0 flex items-center justify-center text-stone-300 pointer-events-none">Signez ici</span>}
                            </div>
                            <button 
                                onClick={() => { setShowCheckIn(false); showToast('Check-in terminé !', 'SUCCESS'); }} 
                                disabled={!signature}
                                className={`w-full py-4 text-sm font-bold uppercase rounded-lg shadow-lg transition ${signature ? 'bg-amber-600 text-white' : 'bg-stone-300 text-stone-500 cursor-not-allowed'}`}
                            >
                                Terminer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- MAIN LAYOUT ---

    return (
        <div className="bg-stone-50 min-h-screen relative font-sans">
            {/* Conditional Views */}
            {activeTab === 'HOME' && renderHome()}
            {activeTab === 'CHAT' && renderChat()}
            {/* Placeholder for others */}
            {(activeTab === 'BOOKINGS' || activeTab === 'SERVICES') && (
                <div className="p-8 text-center pt-24 text-slate-400">
                    <ConstructionIcon className="mx-auto mb-4 opacity-50"/>
                    <p>Module en cours de développement</p>
                </div>
            )}

            {/* Bottom Navigation (Mobile App Style) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 px-6 py-3 flex justify-between items-center z-40 pb-safe">
                {[
                    { id: 'HOME', icon: Home, label: t('portal_tab_home') },
                    { id: 'BOOKINGS', icon: Calendar, label: t('portal_tab_bookings') },
                    { id: 'CHAT', icon: MessageCircle, label: t('portal_tab_chat'), badge: 1 },
                    { id: 'SERVICES', icon: ShoppingBag, label: t('portal_tab_services') },
                ].map(tab => (
                    <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex flex-col items-center space-y-1 transition ${activeTab === tab.id ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                        <div className="relative">
                            <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                            {tab.badge && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wide">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Modals */}
            {showCheckIn && <CheckInModal />}
            
            {showWifiModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl relative">
                        <button onClick={() => setShowWifiModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"><X size={20}/></button>
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
                            <Wifi size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('portal_quick_wifi')}</h3>
                        <p className="text-slate-500 text-sm mb-6">Connectez-vous au réseau haut débit de la villa.</p>
                        
                        <div className="bg-stone-50 p-4 rounded-xl mb-3 border border-stone-100">
                            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Réseau</p>
                            <p className="font-mono text-lg font-bold text-slate-800">Villa_Guest_5G</p>
                        </div>
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Mot de passe</p>
                            <p className="font-mono text-lg font-bold text-slate-800">Welcome2024!</p>
                        </div>
                        
                        <button 
                            onClick={() => { navigator.clipboard.writeText('Welcome2024!'); showToast('Mot de passe copié', 'SUCCESS'); }}
                            className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase hover:bg-slate-800 transition"
                        >
                            Copier le mot de passe
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple Icon component for placeholder
const ConstructionIcon = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>;
