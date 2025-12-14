
import React, { useState, useEffect } from 'react';
import { TETOUAN_GUIDE, PREMIUM_SERVICES, FAQ_ITEMS, MOCK_REVIEWS } from '../../constants';
import { ArrowRight, Star, MapPin, Wifi, Shield, ArrowLeft, Home, List, Map as MapIcon, CheckCircle, CreditCard, ChevronRight, Mail, Phone, Instagram, Facebook, Twitter, ChefHat, Car, Coffee, Info, Calendar as CalendarIcon, User, Search, Filter, Tag, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Villa, HomePageContent, Booking, BookingStatus } from '../../types';
import { useNavigate, useParams, Link } from '@tanstack/react-router';
import { SEO, PremiumImage } from './Common';
import { BookingCalendar } from './Calendar';
import { useData } from '../DataContext';
import { useToast } from '../ToastContext';

// --- Page Header Helper ---
const PageHeader: React.FC<{ title: string; subtitle?: string; bgImage?: string }> = ({ title, subtitle, bgImage }) => (
    <div className="relative bg-slate-900 text-white py-32 md:py-48 px-4 text-center overflow-hidden">
        {bgImage && (
            <>
                <img src={bgImage} className="absolute inset-0 w-full h-full object-cover opacity-30 animate-ken-burns" alt="Background" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            </>
        )}
        <div className="relative z-10">
            <h1 className="font-serif text-4xl md:text-6xl mb-6 animate-slide-up leading-tight">{title}</h1>
            {subtitle && <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto animate-slide-up delay-100 font-light tracking-wide">{subtitle}</p>}
        </div>
    </div>
);

// --- Component: Hero Slideshow ---
const HeroSlideshow: React.FC<{ title: string, subtitle: string, onBook: () => void }> = ({ title, subtitle, onBook }) => {
    const slides = ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1920", "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1920", "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1920"];
    const [currentSlide, setCurrentSlide] = useState(0);
    useEffect(() => { const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % slides.length), 6000); return () => clearInterval(timer); }, []);
    return (
        <div className="relative h-[100vh] bg-slate-900 overflow-hidden">
            {slides.map((s, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={s} className={`w-full h-full object-cover origin-center ${i === currentSlide ? 'animate-ken-burns' : ''}`} alt="Hero" />
                </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-slate-900/30"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                <p className="text-amber-400 uppercase tracking-[0.4em] text-xs md:text-sm font-bold mb-6 animate-slide-up">{subtitle}</p>
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-10 leading-tight max-w-5xl animate-slide-up delay-100 drop-shadow-2xl whitespace-pre-line">{title}</h1>
                <button onClick={onBook} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-slate-900 transition duration-500 transform hover:scale-105 animate-slide-up delay-200 shadow-2xl">Check Availability</button>
            </div>
        </div>
    );
};

export const HomePage: React.FC<{ homeContent?: HomePageContent }> = ({ homeContent }) => {
  const { t, resolveContent } = useLanguage();
  const navigate = useNavigate();
  return (
    <div className="animate-fade-in">
      <SEO title="Luxury Villas Tétouan" description="Experience the ultimate luxury in our private villas in Tétouan, Morocco." />
      <HeroSlideshow 
        title={resolveContent(homeContent?.heroTitle) || t('hero_title')} 
        subtitle={resolveContent(homeContent?.heroSubtitle) || t('hero_subtitle')} 
        onBook={() => navigate({ to: '/booking' })} 
      />
      
      <section className="py-24 px-4 max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-6">Modern Luxury Meets Moroccan Heritage</h2>
        <p className="text-slate-600 leading-relaxed text-lg mb-12">
            Nestled on the pristine coast of Cabo Negro, our collection of seven identical villas offers a sanctuary of privacy, elegance, and comfort. 
            Designed for families, couples, and discerning travelers, we provide a seamless blend of 5-star hotel services with the exclusivity of a private home.
        </p>
        <Link to="/villas" className="inline-block bg-slate-900 text-white px-8 py-3 font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition">View Collection</Link>
      </section>

      <section className="py-20 bg-stone-100">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                  { icon: Shield, title: 'Secure & Private', desc: '24/7 security in a gated community ensuring total peace of mind.' },
                  { icon: Star, title: 'Premium Service', desc: 'Concierge, daily housekeeping, and private chef options at your service.' },
                  { icon: Wifi, title: 'Modern Amenities', desc: 'Fiber optic WiFi, smart home features, and heated private pools.' }
              ].map((feat, i) => (
                  <div key={i} className="bg-white p-8 shadow-sm text-center hover:-translate-y-1 transition duration-300">
                      <feat.icon size={40} className="mx-auto text-amber-600 mb-4" />
                      <h3 className="font-serif text-xl mb-2">{feat.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
                  </div>
              ))}
          </div>
      </section>
    </div>
  );
};

export const VillasPage: React.FC = () => {
  const { t, resolveContent } = useLanguage();
  const { villas } = useData();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [guestCount, setGuestCount] = useState(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <SEO title="Our Collection" description="Discover our 7 identical luxury villas in Tétouan." />
      
      <div className="text-center mb-10 pt-10">
        <h1 className="font-serif text-4xl md:text-5xl text-slate-900 mb-6">{t('title_our_collection')}</h1>
        
        {/* Simulator / Quick Filter */}
        <div className="bg-white shadow-xl border border-stone-100 rounded-lg p-2 inline-flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto mb-10 transform -translate-y-4">
            <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-stone-100 w-full md:w-64">
                <CalendarIcon size={18} className="text-amber-600 mr-3" />
                <div className="text-left w-full">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Dates</p>
                    <input type="text" placeholder="Add dates" className="w-full text-sm font-bold text-slate-800 outline-none placeholder-slate-300"/>
                </div>
            </div>
            <div className="flex items-center px-4 py-3 w-full md:w-48">
                <User size={18} className="text-amber-600 mr-3" />
                <div className="text-left w-full">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Guests</p>
                    <select 
                        value={guestCount} 
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                    >
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guests</option>)}
                    </select>
                </div>
            </div>
            <div className="p-1 w-full md:w-auto">
                <button className="w-full bg-slate-900 text-white px-8 py-3 rounded-md text-xs font-bold uppercase hover:bg-slate-800 transition shadow-md">
                    Check Availability
                </button>
            </div>
        </div>

        <div className="flex justify-center space-x-2">
            <button onClick={() => setViewMode('LIST')} className={`flex items-center px-6 py-2 rounded-full text-xs font-bold uppercase transition ${viewMode === 'LIST' ? 'bg-slate-900 text-white shadow-md' : 'bg-stone-100 text-slate-500 hover:text-slate-900'}`}><List size={14} className="mr-2"/> List View</button>
            <button onClick={() => setViewMode('MAP')} className={`flex items-center px-6 py-2 rounded-full text-xs font-bold uppercase transition ${viewMode === 'MAP' ? 'bg-slate-900 text-white shadow-md' : 'bg-stone-100 text-slate-500 hover:text-slate-900'}`}><MapIcon size={14} className="mr-2"/> Map View</button>
        </div>
      </div>

      {viewMode === 'LIST' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {villas.map((villa) => (
              <div key={villa.id} className="bg-white group hover:shadow-2xl transition duration-500 border border-stone-200 flex flex-col h-full">
                <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => navigate({ to: `/villas/${villa.id}` })}>
                    <PremiumImage src={villa.images[0]} alt={villa.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                    {!villa.isAvailable && <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm"><span className="bg-slate-900 text-white px-4 py-2 text-xs uppercase tracking-widest font-bold shadow-lg">{t('msg_booked')}</span></div>}
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm">{villa.pricePerNight}€</div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                    <h3 className="font-serif text-2xl text-slate-900 group-hover:text-amber-600 transition mb-4">{villa.name}</h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{resolveContent(villa.shortDescription)}</p>
                    <div className="flex justify-between text-xs text-slate-500 mb-6 border-t border-stone-100 pt-4">
                        <span>{villa.bedrooms} Bedrooms</span>
                        <span>{villa.bathrooms} Bathrooms</span>
                        <span>{villa.pool ? 'Private Pool' : ''}</span>
                    </div>
                    <div className="mt-auto flex space-x-2">
                        <Link to={`/villas/${villa.id}`} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest border border-slate-900 text-slate-900 hover:bg-slate-50 transition text-center">{t('cta_view_details')}</Link>
                        <Link to={`/booking`} search={{ villa: villa.id }} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition text-center ${villa.isAvailable ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg' : 'bg-stone-200 text-slate-400 cursor-not-allowed'}`}>{t('cta_book_now')}</Link>
                    </div>
                </div>
              </div>
            ))}
          </div>
      ) : (
          <div className="bg-stone-100 rounded-lg overflow-hidden h-[600px] relative border border-stone-200 shadow-inner">
              <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center opacity-30">
                  <div className="w-full h-full" style={{ 
                      backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                      backgroundSize: '20px 20px' 
                  }}></div>
              </div>
              <img src="https://images.unsplash.com/photo-1574958269340-fa927503f3dd?q=80&w=1920" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" alt="Map Base" />
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96">
                  {villas.map((villa, index) => {
                      const top = 20 + (index * 10) + (index % 2 * 10);
                      const left = 10 + (index * 12);
                      return (
                          <div 
                            key={villa.id}
                            className="absolute group cursor-pointer"
                            style={{ top: `${top}%`, left: `${left}%` }}
                            onClick={() => navigate({ to: `/villas/${villa.id}` })}
                          >
                              <div className="relative">
                                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white transform transition hover:scale-125 hover:bg-amber-600 z-10 relative">
                                      <Home size={14} />
                                  </div>
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20 pointer-events-none">
                                      <p className="font-bold text-xs text-slate-900">{villa.name}</p>
                                      <p className="text-[10px] text-amber-600 font-bold">{villa.pricePerNight}€ / night</p>
                                      <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      )}
    </div>
  );
};

export const VillaDetailsPage: React.FC = () => {
    const { villas } = useData();
    const { resolveContent } = useLanguage();
    const params = useParams({ strict: false });
    const id = (params as any).id;
    
    const villa = villas.find(v => v.id === id);
    if (!villa) return <div className="p-20 text-center">Villa not found</div>;
    return (
      <div className="animate-fade-in pb-20 relative">
         <SEO title={villa.name} description={resolveContent(villa.shortDescription)} image={villa.images[0]} />
         <div className="relative h-[70vh]">
            <PremiumImage src={villa.images[0]} alt={villa.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white w-full">
                <Link to="/villas" className="flex items-center text-xs font-bold uppercase tracking-widest mb-4 hover:text-amber-400 transition"><ArrowLeft size={16} className="mr-2" /> Back to Collection</Link>
                <h1 className="font-serif text-4xl md:text-7xl mb-2">{villa.name}</h1>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 space-y-12">
                 <div>
                    <h2 className="font-serif text-2xl text-slate-900 mb-4">About the Villa</h2>
                    <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{resolveContent(villa.description)}</p>
                 </div>
                 
                 <div>
                    <h2 className="font-serif text-2xl text-slate-900 mb-4">Features & Amenities</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {villa.features.map((f, i) => (
                            <div key={i} className="flex items-center text-slate-600">
                                <CheckCircle size={16} className="text-amber-600 mr-2" />
                                <span>{resolveContent(f)}</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">{villa.images.map((img, i) => <PremiumImage key={i} src={img} alt="Gallery" className="h-64 rounded" />)}</div>
             </div>
             <div className="lg:col-span-1">
                 <div className="sticky top-24 bg-white border border-stone-200 p-8 shadow-xl rounded-sm">
                     <div className="flex justify-between items-center mb-6"><span className="text-slate-500">Starting from</span><span className="text-3xl font-serif text-slate-900">{villa.pricePerNight}€</span></div>
                     <div className="space-y-4 mb-6">
                         <div className="flex justify-between text-sm text-slate-600 border-b border-stone-100 pb-2"><span>Bedrooms</span><span className="font-bold">{villa.bedrooms}</span></div>
                         <div className="flex justify-between text-sm text-slate-600 border-b border-stone-100 pb-2"><span>Bathrooms</span><span className="font-bold">{villa.bathrooms}</span></div>
                         <div className="flex justify-between text-sm text-slate-600 border-b border-stone-100 pb-2"><span>Pool</span><span className="font-bold">{villa.pool ? 'Yes' : 'No'}</span></div>
                     </div>
                     <Link to="/booking" search={{ villa: villa.id }} className="block w-full text-center py-4 bg-amber-600 text-white font-bold uppercase tracking-widest hover:bg-amber-700 transition">Book Now</Link>
                 </div>
             </div>
         </div>
      </div>
    );
};

export const BookingPage: React.FC = () => {
    // ... (Booking logic remains mostly functional, just ensure villa.name is displayed correctly)
    const { t } = useLanguage();
    const { villas, bookings, addBooking } = useData();
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    const [searchParams] = useState(new URLSearchParams(window.location.search));
    const [step, setStep] = useState(1);
    
    // Basket State
    const [selectedVillaId, setSelectedVillaId] = useState(searchParams.get('villa') || '');
    const [basket, setBasket] = useState<{villa: Villa, dates: {start: Date, end: Date}}[]>([]);
    
    // Form States
    const [currentDateRange, setCurrentDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
    const [guestInfo, setGuestInfo] = useState({ firstName: '', lastName: '', email: '', phone: '', guests: 2, requests: '' });
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'TRANSFER'>('CARD');
    const [promoCode, setPromoCode] = useState('');
    const [manualDiscount, setManualDiscount] = useState(0);

    const activeVilla = villas.find(v => v.id === selectedVillaId);

    // --- Dynamic Pricing Logic ---
    const getSeasonalPrice = (basePrice: number, date: Date) => {
        const month = date.getMonth(); // 0-11
        // Summer High Season (July, August)
        if (month === 6 || month === 7) return basePrice * 1.4; // +40%
        // Shoulder Season (June, Sept)
        if (month === 5 || month === 8) return basePrice * 1.2; // +20%
        // Low Season
        return basePrice;
    };

    const calculateItemPrice = (villa: Villa, start: Date, end: Date) => {
        let total = 0;
        let nights = 0;
        let curr = new Date(start);
        
        while (curr < end) {
            total += getSeasonalPrice(villa.pricePerNight, curr);
            curr.setDate(curr.getDate() + 1);
            nights++;
        }

        // Long Stay Discount (>7 nights)
        if (nights >= 7) {
            total = total * 0.90; // 10% discount
        }

        return { total, nights };
    };

    const addToBasket = () => {
        if (!activeVilla || !currentDateRange.start || !currentDateRange.end) return;
        setBasket([...basket, { villa: activeVilla, dates: { start: currentDateRange.start, end: currentDateRange.end } }]);
        setSelectedVillaId('');
        setCurrentDateRange({ start: null, end: null });
    };

    const removeFromBasket = (index: number) => {
        const newBasket = [...basket];
        newBasket.splice(index, 1);
        setBasket(newBasket);
    };

    // Total Calculation
    const calculateTotals = () => {
        let subtotal = 0;
        let totalNights = 0;
        let isLongStay = false;

        // Basket Items
        basket.forEach(item => {
            const { total, nights } = calculateItemPrice(item.villa, item.dates.start, item.dates.end);
            subtotal += total;
            totalNights += nights;
        });
        
        // Active Selection
        if (activeVilla && currentDateRange.start && currentDateRange.end) {
             const { total, nights } = calculateItemPrice(activeVilla, currentDateRange.start, currentDateRange.end);
             subtotal += total;
             totalNights += nights;
        }

        if (totalNights >= 7) isLongStay = true;

        const cleaningFee = basket.length * 80 + (activeVilla ? 80 : 0);
        const taxes = subtotal * 0.10;
        const finalTotal = Math.max(0, subtotal + cleaningFee + taxes - manualDiscount);

        return { subtotal, cleaningFee, taxes, finalTotal, isLongStay };
    };

    const totals = calculateTotals();

    const handleApplyPromo = () => {
        if (promoCode === 'WELCOME20') {
            setManualDiscount(totals.subtotal * 0.20);
            showToast("Promo Code Applied: 20% Off Base Rate", "SUCCESS");
        } else if (promoCode === 'SUMMER50') {
            setManualDiscount(50);
            showToast("Promo Code Applied: 50€ Off", "SUCCESS");
        } else {
            setManualDiscount(0);
            showToast("Invalid Promo Code", "ERROR");
        }
    };

    const handleNext = () => {
        if (activeVilla && currentDateRange.start && currentDateRange.end) {
            addToBasket();
        }
        const effectiveBasketSize = basket.length + (activeVilla && currentDateRange.start && currentDateRange.end ? 1 : 0);

        if (step === 1 && effectiveBasketSize === 0) return alert('Please select at least one villa and dates');
        if (step === 2 && (!guestInfo.firstName || !guestInfo.email)) return alert('Please fill in required fields');
        setStep(step + 1);
    };

    const handleConfirmBooking = () => {
        // Create booking object
        basket.forEach(item => {
            const newBooking: Booking = {
                id: `BK-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                villaId: item.villa.id,
                clientName: `${guestInfo.firstName} ${guestInfo.lastName}`,
                clientEmail: guestInfo.email,
                startDate: item.dates.start.toISOString().split('T')[0],
                endDate: item.dates.end.toISOString().split('T')[0],
                totalPrice: calculateItemPrice(item.villa, item.dates.start, item.dates.end).total,
                status: BookingStatus.PENDING,
                guests: guestInfo.guests,
                specialRequests: guestInfo.requests
            };
            addBooking(newBooking);
        });

        showToast('Réservation confirmée ! Vous recevrez un email.', 'SUCCESS');
        setTimeout(() => navigate({ to: '/portal' }), 1500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in pt-32">
            <SEO title="Book Your Stay" description="Secure your reservation." />
            
            <div className="flex justify-center mb-16">
                {[1, 2, 3].map(s => (
                    <div key={s} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-lg transition-all duration-300 ${s === step ? 'bg-amber-600 text-white shadow-lg scale-110' : s < step ? 'bg-green-600 text-white' : 'bg-stone-200 text-slate-400'}`}>
                            {s < step ? <CheckCircle size={20} /> : s}
                        </div>
                        <span className={`ml-3 text-xs font-bold uppercase tracking-widest hidden md:block ${s === step ? 'text-slate-900' : 'text-slate-400'}`}>
                            {s === 1 ? t('step_dates') : s === 2 ? t('step_details') : t('step_confirm')}
                        </span>
                        {s < 3 && <div className={`w-16 h-px mx-4 ${s < step ? 'bg-green-600' : 'bg-stone-200'}`}></div>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    
                    {/* STEP 1: Villa & Dates */}
                    {step === 1 && (
                        <div className="space-y-12 animate-slide-up">
                            
                            {/* Villa Selection */}
                            <section>
                                <h2 className="font-serif text-2xl text-slate-900 mb-6 flex items-center">
                                    <Home size={24} className="mr-3 text-amber-600"/> {t('label_select_villa')}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {villas.map(v => (
                                        <div 
                                            key={v.id} 
                                            onClick={() => { setSelectedVillaId(v.id); setCurrentDateRange({start: null, end: null}); }}
                                            className={`relative group cursor-pointer rounded-sm overflow-hidden border-2 transition-all duration-300 ${selectedVillaId === v.id ? 'border-amber-600 ring-2 ring-amber-100' : 'border-transparent hover:border-stone-300'}`}
                                        >
                                            <div className="h-32 relative">
                                                <img src={v.images[0]} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt={v.name} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                {selectedVillaId === v.id && (
                                                    <div className="absolute top-2 right-2 bg-amber-600 text-white p-1 rounded-full"><CheckCircle size={14}/></div>
                                                )}
                                                <div className="absolute bottom-2 left-2 text-white">
                                                    <p className="font-serif font-bold text-sm">{v.name}</p>
                                                    <p className="text-[10px] opacity-90">{v.pricePerNight}€ {t('label_night')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Calendar */}
                            <section>
                                <h2 className="font-serif text-2xl text-slate-900 mb-6 flex items-center">
                                    <CalendarIcon size={24} className="mr-3 text-amber-600"/> {t('step_dates')}
                                </h2>
                                <div className="bg-amber-50 p-4 rounded border border-amber-200 mb-4 text-xs text-amber-900 flex items-start">
                                    <Info size={16} className="mr-2 mt-0.5 shrink-0"/>
                                    <div>
                                        <p className="font-bold mb-1">Dynamic Pricing Active</p>
                                        <p>Rates vary by season. Stays longer than 7 nights automatically receive a 10% discount.</p>
                                    </div>
                                </div>
                                <BookingCalendar 
                                    bookings={bookings} 
                                    villaId={selectedVillaId} 
                                    onRangeSelect={(start, end) => setCurrentDateRange({ start, end })}
                                    selectedStart={currentDateRange.start}
                                    selectedEnd={currentDateRange.end}
                                />
                            </section>

                            {/* Add to Basket Action */}
                            {selectedVillaId && currentDateRange.start && currentDateRange.end && (
                                <div className="bg-stone-50 p-4 border border-stone-200 rounded flex justify-between items-center animate-fade-in">
                                    <div>
                                        <p className="font-bold text-slate-900">{activeVilla?.name}</p>
                                        <p className="text-xs text-slate-500">{currentDateRange.start.toLocaleDateString()} - {currentDateRange.end.toLocaleDateString()}</p>
                                    </div>
                                    <button 
                                        onClick={addToBasket}
                                        className="bg-white border border-slate-300 text-slate-700 px-4 py-2 text-xs font-bold uppercase hover:bg-slate-50 transition"
                                    >
                                        <Plus size={14} className="inline mr-1"/> Add Another Villa
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: Details */}
                    {step === 2 && (
                        <div className="space-y-8 animate-slide-up">
                            <h2 className="font-serif text-2xl text-slate-900 mb-6 flex items-center">
                                <User size={24} className="mr-3 text-amber-600"/> {t('title_guest_info')}
                            </h2>
                            
                            <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">First Name</label>
                                        <input className="w-full bg-stone-50 border border-stone-200 p-3 rounded-sm focus:border-amber-600 outline-none transition" value={guestInfo.firstName} onChange={e => setGuestInfo({...guestInfo, firstName: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Last Name</label>
                                        <input className="w-full bg-stone-50 border border-stone-200 p-3 rounded-sm focus:border-amber-600 outline-none transition" value={guestInfo.lastName} onChange={e => setGuestInfo({...guestInfo, lastName: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Email Address</label>
                                        <input type="email" className="w-full bg-stone-50 border border-stone-200 p-3 rounded-sm focus:border-amber-600 outline-none transition" value={guestInfo.email} onChange={e => setGuestInfo({...guestInfo, email: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Phone Number</label>
                                        <input type="tel" className="w-full bg-stone-50 border border-stone-200 p-3 rounded-sm focus:border-amber-600 outline-none transition" value={guestInfo.phone} onChange={e => setGuestInfo({...guestInfo, phone: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Guests</label>
                                        <select className="w-full bg-stone-50 border border-stone-200 p-3 rounded-sm focus:border-amber-600 outline-none transition" value={guestInfo.guests} onChange={e => setGuestInfo({...guestInfo, guests: parseInt(e.target.value)})}>
                                            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guests</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Special Requests</label>
                                    <textarea className="w-full bg-stone-50 border border-stone-200 p-3 rounded-sm h-32 focus:border-amber-600 outline-none transition" placeholder="Allergies, arrival time, crib needed..." value={guestInfo.requests} onChange={e => setGuestInfo({...guestInfo, requests: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Payment */}
                    {step === 3 && (
                        <div className="space-y-8 animate-slide-up">
                            <h2 className="font-serif text-2xl text-slate-900 mb-6 flex items-center">
                                <CreditCard size={24} className="mr-3 text-amber-600"/> {t('title_payment')}
                            </h2>
                            
                            <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-200 space-y-6">
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-sm text-amber-900 text-sm">
                                    <p className="font-bold mb-1">Security Deposit</p>
                                    A pre-authorization of 500€ will be held on your card upon check-in for security purposes.
                                </div>

                                {/* Promo Code Section */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Promo Code</label>
                                    <div className="flex space-x-2">
                                        <input 
                                            type="text" 
                                            placeholder="Enter Code (e.g. WELCOME20)" 
                                            className="flex-1 bg-stone-50 border border-stone-200 p-3 rounded-sm focus:border-amber-600 outline-none transition"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                        />
                                        <button 
                                            onClick={handleApplyPromo}
                                            className="bg-slate-900 text-white px-6 font-bold uppercase text-xs rounded-sm hover:bg-slate-800"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {manualDiscount > 0 && <p className="text-green-600 text-xs font-bold mt-2">Discount Applied!</p>}
                                </div>

                                <div className="space-y-4">
                                    <label className={`flex items-center p-4 border rounded-sm cursor-pointer transition ${paymentMethod === 'CARD' ? 'border-amber-600 bg-amber-50/50' : 'border-stone-200 hover:bg-stone-50'}`}>
                                        <input type="radio" name="pay" className="w-5 h-5 text-amber-600 focus:ring-amber-600" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} />
                                        <div className="ml-4">
                                            <span className="block font-bold text-slate-900">Credit Card (Stripe)</span>
                                            <span className="block text-xs text-slate-500">Secure encrypted payment. Visa, Mastercard, Amex.</span>
                                        </div>
                                    </label>
                                    
                                    <label className={`flex items-center p-4 border rounded-sm cursor-pointer transition ${paymentMethod === 'TRANSFER' ? 'border-amber-600 bg-amber-50/50' : 'border-stone-200 hover:bg-stone-50'}`}>
                                        <input type="radio" name="pay" className="w-5 h-5 text-amber-600 focus:ring-amber-600" checked={paymentMethod === 'TRANSFER'} onChange={() => setPaymentMethod('TRANSFER')} />
                                        <div className="ml-4">
                                            <span className="block font-bold text-slate-900">Bank Transfer</span>
                                            <span className="block text-xs text-slate-500">Manual verification required (24-48h).</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="pt-6 border-t border-stone-100">
                                    <label className="flex items-start space-x-3 text-sm text-slate-600 cursor-pointer">
                                        <input type="checkbox" className="mt-1 w-5 h-5 text-amber-600 rounded focus:ring-amber-600" />
                                        <span>I agree to the <span className="underline font-bold text-slate-900">Rental Agreement</span>, House Rules, and Cancellation Policy (Free cancellation up to 14 days before check-in).</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-stone-200">
                        {step > 1 ? (
                            <button onClick={() => setStep(step - 1)} className="px-8 py-4 text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-slate-900 transition">
                                Back
                            </button>
                        ) : (
                            <div></div>
                        )}
                        <button 
                            onClick={step === 3 ? handleConfirmBooking : handleNext} 
                            disabled={step === 1 && basket.length === 0 && (!currentDateRange.start || !currentDateRange.end)}
                            className={`px-10 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs shadow-xl hover:bg-slate-800 hover:shadow-2xl transition transform hover:-translate-y-1 ${step === 1 && basket.length === 0 && (!currentDateRange.start || !currentDateRange.end) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {step === 3 ? t('btn_confirm') : t('btn_next')}
                        </button>
                    </div>
                </div>

                {/* Sticky Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 shadow-xl border border-stone-100 sticky top-32 rounded-sm animate-fade-in">
                        <h3 className="font-serif text-xl mb-6 pb-4 border-b border-stone-100 text-slate-900">{t('title_summary')}</h3>
                        
                        {/* Current Active Selection (Not yet in basket) */}
                        {activeVilla && currentDateRange.start && currentDateRange.end && (
                            <div className="mb-6 pb-6 border-b border-stone-100 relative">
                                <div className="flex items-start space-x-4">
                                    <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0">
                                        <img src={activeVilla.images[0]} className="w-full h-full object-cover" alt="Villa" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight mb-1">{activeVilla.name}</p>
                                        <p className="text-xs text-slate-500 mb-2">{activeVilla.bedrooms} Bedrooms</p>
                                        <p className="text-xs text-amber-600 font-bold">
                                            {currentDateRange.start.toLocaleDateString()} - {currentDateRange.end.toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 text-xs font-bold text-slate-400 uppercase tracking-widest">Current</div>
                            </div>
                        )}

                        {/* Basket Items */}
                        {basket.map((item, index) => (
                            <div key={index} className="mb-6 pb-6 border-b border-stone-100 relative group">
                                <button onClick={() => removeFromBasket(index)} className="absolute top-0 right-0 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                                <div className="flex items-start space-x-4">
                                    <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition">
                                        <img src={item.villa.images[0]} className="w-full h-full object-cover" alt="Villa" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight mb-1">{item.villa.name}</p>
                                        <p className="text-xs text-slate-500 mb-2">{item.villa.bedrooms} Bedrooms</p>
                                        <p className="text-xs text-slate-600">
                                            {item.dates.start.toLocaleDateString()} - {item.dates.end.toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Financials */}
                        {(totals.subtotal > 0) ? (
                            <div className="space-y-3 text-sm pt-2">
                                <div className="flex justify-between text-slate-600">
                                    <span>Accommodation Total</span>
                                    <span>{totals.subtotal.toFixed(0)}€</span>
                                </div>
                                {totals.isLongStay && (
                                    <div className="flex justify-between text-green-600 text-xs">
                                        <span>Long Stay Discount Applied</span>
                                        <span>-10%</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-600">
                                    <span>Cleaning Fees</span>
                                    <span>{totals.cleaningFee}€</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Taxes (10%)</span>
                                    <span>{totals.taxes.toFixed(0)}€</span>
                                </div>
                                {manualDiscount > 0 && (
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span>Promo Discount</span>
                                        <span>-{manualDiscount.toFixed(0)}€</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-end pt-4 border-t border-stone-200">
                                    <span className="font-bold text-lg text-slate-900">{t('total_amount')}</span>
                                    <span className="font-serif text-2xl text-amber-600">{totals.finalTotal.toFixed(0)}€</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <Home size={32} className="mx-auto mb-3 opacity-20"/>
                                <p className="text-sm">Please select a villa to view pricing.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const GuidePage: React.FC = () => {
    const { t, resolveContent } = useLanguage();
    const { guideItems } = useData();
    const categories = ['All', ...Array.from(new Set(guideItems.map(item => item.category)))];
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredGuide = activeCategory === 'All' 
        ? guideItems 
        : guideItems.filter(item => item.category === activeCategory);

    return (
    <div className="animate-fade-in">
        <SEO title="Discover Tétouan" description="Curated guide to the white dove of Morocco." />
        <PageHeader title="Discover Tétouan" subtitle="A curated guide to the UNESCO World Heritage city." />
        
        {/* Category Filters */}
        <div className="max-w-7xl mx-auto px-4 mt-8">
            <div className="flex justify-center space-x-2 overflow-x-auto pb-4">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat as any)}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition whitespace-nowrap ${activeCategory === cat ? 'bg-amber-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-stone-50 border border-stone-200'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {filteredGuide.map((item, i) => (
                    <div key={item.id} className={`flex flex-col md:flex-row gap-6 animate-slide-up`}>
                         <div className="w-full md:w-1/2 h-64 rounded-lg overflow-hidden shrink-0">
                             <PremiumImage src={item.image || ''} alt={resolveContent(item.title)} className="w-full h-full object-cover transition duration-500 hover:scale-110" />
                         </div>
                         <div className="w-full md:w-1/2 flex flex-col justify-center">
                             <span className="text-amber-600 font-bold uppercase text-xs mb-2">{item.category}</span>
                             <h3 className="font-serif text-2xl text-slate-900 mb-3">{resolveContent(item.title)}</h3>
                             <div className="flex items-center text-xs text-slate-500 mb-4"><MapPin size={14} className="mr-1"/> {item.location}</div>
                             <p className="text-slate-600 text-sm leading-relaxed mb-4">{resolveContent(item.desc)}</p>
                             <button className="text-xs font-bold uppercase text-slate-900 hover:text-amber-600 transition flex items-center self-start">
                                 Read More <ArrowRight size={14} className="ml-2"/>
                             </button>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)};

export const ServicesPage: React.FC = () => {
    const { resolveContent } = useLanguage();
    const { premiumServices } = useData();
    
    return (
    <div className="animate-fade-in">
        <SEO title="Services" description="Premium services to enhance your stay." />
        <PageHeader title="Premium Services" subtitle="Curated experiences to elevate your stay." />
        <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {premiumServices.map(service => (
                <div key={service.id} className="bg-white p-8 rounded shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-lg transition">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-amber-600 mb-6">
                        {resolveContent(service.title).includes('Chef') ? <ChefHat size={32} /> : 
                         resolveContent(service.title).includes('Chauffeur') ? <Car size={32} /> :
                         resolveContent(service.title).includes('Concierge') ? <Info size={32} /> :
                         <Coffee size={32} />}
                    </div>
                    <h3 className="font-serif text-2xl text-slate-900 mb-2">{resolveContent(service.title)}</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-sm">{resolveContent(service.desc)}</p>
                    <div className="mt-auto">
                        <span className="block text-lg font-bold text-slate-900 mb-4">{service.price}</span>
                        <Link to="/contact" className="inline-block border border-slate-900 text-slate-900 px-6 py-2 text-xs font-bold uppercase hover:bg-slate-900 hover:text-white transition">Inquire Now</Link>
                    </div>
                </div>
            ))}
        </div>
    </div>
)};

export const ReviewsPage: React.FC = () => {
    const { reviews } = useData();
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'FAMILY' | 'COUPLE' | 'BUSINESS'>('ALL');
    const filters = ['ALL', 'FAMILY', 'COUPLE', 'BUSINESS'];

    const filteredReviews = activeFilter === 'ALL' 
        ? reviews 
        : reviews.filter(r => r.category === activeFilter);

    return (
    <div className="animate-fade-in">
        <SEO title="Guest Reviews" description="See what our guests say." />
        <PageHeader title="Guest Experiences" subtitle="Stories from those who have stayed with us." />
        
        <div className="max-w-7xl mx-auto px-4 mt-8 mb-12 flex justify-center space-x-4">
            {filters.map(f => (
                <button 
                    key={f}
                    onClick={() => setActiveFilter(f as any)}
                    className={`px-4 py-2 text-xs font-bold uppercase rounded-full transition ${activeFilter === f ? 'bg-slate-900 text-white' : 'bg-white border border-stone-200 text-slate-500 hover:text-slate-900'}`}
                >
                    {f}
                </button>
            ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredReviews.map(review => (
                    <div key={review.id} className="bg-white p-8 rounded shadow-sm border border-stone-100 flex flex-col h-full animate-slide-up">
                        <div className="flex text-amber-500 mb-4">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-slate-600 italic mb-6 leading-relaxed flex-1">"{review.comment}"</p>
                        <div className="flex items-center border-t border-stone-50 pt-4">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 mr-3">
                                {review.guestName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">{review.guestName}</p>
                                <p className="text-xs text-slate-400 flex items-center">
                                    {review.date} &bull; <span className="ml-1 bg-stone-100 px-1 rounded text-[10px] uppercase font-bold">{review.category}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)};

export const ContactPage: React.FC = () => (
    <div className="animate-fade-in">
        <SEO title="Contact" description="Get in touch with us." />
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            <div className="bg-slate-900 text-white p-12 lg:p-24 flex flex-col justify-center">
                <h1 className="font-serif text-4xl lg:text-5xl mb-8">Get in Touch</h1>
                <p className="text-slate-400 text-lg mb-12">Our concierge team is available 24/7 to assist with your reservation and any special requests.</p>
                
                <div className="space-y-6 text-sm">
                    <div className="flex items-center"><Phone className="mr-4 text-amber-600" /> +212 539 000 000</div>
                    <div className="flex items-center"><Mail className="mr-4 text-amber-600" /> concierge@tetouanvillas.ma</div>
                    <div className="flex items-center"><MapPin className="mr-4 text-amber-600" /> Route de Sebta, Cabo Negro, Tétouan</div>
                </div>

                <div className="flex space-x-6 mt-12">
                    <Instagram className="cursor-pointer hover:text-amber-600 transition" />
                    <Facebook className="cursor-pointer hover:text-amber-600 transition" />
                    <Twitter className="cursor-pointer hover:text-amber-600 transition" />
                </div>
            </div>
            <div className="bg-stone-50 p-12 lg:p-24 flex flex-col justify-center">
                <form className="max-w-md w-full space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Full Name</label>
                        <input type="text" className="w-full bg-white border border-stone-200 p-4 rounded outline-none focus:border-amber-600 transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Email Address</label>
                        <input type="email" className="w-full bg-white border border-stone-200 p-4 rounded outline-none focus:border-amber-600 transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Message</label>
                        <textarea className="w-full bg-white border border-stone-200 p-4 rounded h-32 outline-none focus:border-amber-600 transition"></textarea>
                    </div>
                    <button className="bg-amber-600 text-white px-8 py-4 font-bold uppercase tracking-widest w-full hover:bg-amber-700 transition">Send Message</button>
                </form>
            </div>
        </div>
    </div>
);

export const FAQPage: React.FC = () => {
    const { resolveContent } = useLanguage();
    const { faqs } = useData();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    return (
        <div className="animate-fade-in max-w-3xl mx-auto px-4 py-24">
            <SEO title="FAQ" description="Frequently Asked Questions." />
            <h1 className="font-serif text-4xl text-center mb-16">Frequently Asked Questions</h1>
            <div className="space-y-4">
                {faqs.map((item, i) => (
                    <div key={i} className="border border-stone-200 rounded overflow-hidden">
                        <button 
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex justify-between items-center p-6 bg-white hover:bg-stone-50 transition text-left"
                        >
                            <span className="font-bold text-slate-800">{resolveContent(item.q)}</span>
                            {openIndex === i ? <ChevronRight className="rotate-90 transition transform"/> : <ChevronRight className="transition transform"/>}
                        </button>
                        {openIndex === i && (
                            <div className="p-6 bg-stone-50 text-slate-600 text-sm leading-relaxed border-t border-stone-200 animate-slide-up">
                                {resolveContent(item.a)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
