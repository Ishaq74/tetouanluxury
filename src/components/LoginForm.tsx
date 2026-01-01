import React, { useState } from 'react';
import { UserRole } from '@/types';
// TODO: Remplacer par Astro.locals/actions ou props (login, isLoading)
import { ArrowRight, Lock, Mail, User, Key } from 'lucide-react';
// t doit être passé en props depuis la page Astro
import { useNavigate } from '@tanstack/react-router';

export default function LoginForm({ lang = 'fr', t, login, isLoading }: { lang?: string, t: (key: string, lang?: string) => string, login: Function, isLoading: { value: boolean } }) {
  const [activeTab, setActiveTab] = useState<'CLIENT' | 'STAFF'>('CLIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const navigate = useNavigate();
  const loading = isLoading?.value ?? false;

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    isLoading.value = true;
    setTimeout(() => {
      if (activeTab === 'CLIENT') {
        if (email.includes('karim')) {
          login(UserRole.CLIENT, { name: 'Karim Benjelloun', email });
          navigate({ to: '/portal' } as any);
        } else {
          login(UserRole.CLIENT, { name: 'Invité Demo', email });
          navigate({ to: '/portal' } as any);
        }
      } else {
        if (email.includes('admin')) {
          login(UserRole.MANAGER, { name: 'Administrateur', email });
          navigate({ to: '/admin' } as any);
        } else if (email.includes('clean')) {
          login(UserRole.STAFF_CLEANING, { name: 'Fatima (Ménage)', email });
          navigate({ to: '/operations' } as any);
        } else {
          login(UserRole.STAFF_MAINTENANCE, { name: 'Hassan (Tech)', email });
          navigate({ to: '/operations' } as any);
        }
      }
      isLoading.value = false;
    }, 800);
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        <div className="w-12 h-12 bg-amber-600 rounded flex items-center justify-center font-serif font-bold text-xl text-white mx-auto mb-4">T</div>
        <h1 className="font-serif text-3xl text-slate-900 mb-2">{t('login_title', lang)}</h1>
        <p className="text-slate-500 text-sm">{t('login_subtitle', lang)}</p>
      </div>
      <div className="bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden">
        <div className="flex border-b border-stone-100">
          <button 
            onClick={() => setActiveTab('CLIENT')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'CLIENT' ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {t('login_tab_client', lang)}
          </button>
          <button 
            onClick={() => setActiveTab('STAFF')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'STAFF' ? 'bg-slate-50 text-slate-800 border-b-2 border-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {t('login_tab_staff', lang)}
          </button>
        </div>
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {activeTab === 'CLIENT' ? (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">{t('login_label_email', lang)}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded outline-none focus:border-amber-600 transition" 
                      placeholder="client@exemple.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">{t('login_label_ref', lang)}</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded outline-none focus:border-amber-600 transition" 
                      placeholder="ex: BK-12345"
                      value={bookingRef}
                      onChange={e => setBookingRef(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Identifiant Staff</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded outline-none focus:border-slate-800 transition" 
                      placeholder="staff@tetouanvillas.ma"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">{t('login_label_password', lang)}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      required
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded outline-none focus:border-slate-800 transition" 
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            <button 
              disabled={loading}
              className={`w-full py-4 rounded font-bold uppercase tracking-widest text-sm text-white shadow-lg transition flex items-center justify-center ${activeTab === 'CLIENT' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-900 hover:bg-slate-800'}`}
            >
              {loading ? '...' : t('login_btn', lang)} <ArrowRight size={18} className="ml-2" />
            </button>
          </form>
          {activeTab === 'STAFF' && (
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">Demo: admin@villas.ma / clean@villas.ma</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 text-center">
        <button onClick={() => navigate({ to: '/' } as any)} className="text-slate-500 hover:text-slate-800 text-sm font-bold border-b border-transparent hover:border-slate-800 transition pb-1">
          {t('login_back', lang)}
        </button>
      </div>
    </div>
  );
}
