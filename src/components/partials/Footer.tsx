
import React from 'react';
// Footer Astro/React natif, sans TanStack ni useLanguage
// Le composant Footer attend maintenant une prop t (Astro.props.locals.t)
export const Footer: React.FC<{ t: (key: string) => string; locale?: string }> = ({ t, locale }) => {

  return (
      <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-amber-600 flex items-center justify-center mr-3 rounded-sm">
                      <span className="font-serif font-bold text-lg">T</span>
                  </div>
                  <h3 className="font-serif text-2xl">Tétouan Villas</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Experience the pinnacle of luxury in Northern Morocco. Secure, private, and meticulously serviced residences for the discerning traveler.
              </p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-amber-600 mb-6">Navigation</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><a href={`/${locale || 'fr'}/`} className="hover:text-white transition hover:translate-x-1 duration-200 inline-block">{t('nav.home')}</a></li>
                <li><a href={`/${locale || 'fr'}/villas`} className="hover:text-white transition hover:translate-x-1 duration-200 inline-block">{t('nav.villas')}</a></li>
                <li><a href={`/${locale || 'fr'}/reviews`} className="hover:text-white transition hover:translate-x-1 duration-200 inline-block">{t('nav.reviews')}</a></li>
                <li><a href={`/${locale || 'fr'}/portal`} className="hover:text-white transition hover:translate-x-1 duration-200 inline-block">{t('login.client')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-amber-600 mb-6">{t('nav.contact')}</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center"><span className="text-amber-600 mr-3">•</span> +212 539 000 000</li>
                <li className="flex items-center"><span className="text-amber-600 mr-3">•</span> concierge@tetouanvillas.ma</li>
                <li className="flex items-center"><span className="text-amber-600 mr-3">•</span> Route de Sebta, Tétouan</li>
              </ul>
            </div>
            <div>
               <h4 className="font-bold uppercase tracking-widest text-xs text-amber-600 mb-6">Newsletter</h4>
               <p className="text-xs text-slate-400 mb-4">Subscribe for exclusive offers and seasonal updates.</p>
               <div className="flex">
                 <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-slate-800 border-none text-white text-sm px-4 py-3 w-full focus:ring-1 focus:ring-amber-600 outline-none rounded-l-sm"
                />
                 <button className="bg-amber-600 px-4 py-3 text-white hover:bg-amber-700 transition font-bold uppercase text-xs rounded-r-sm">Join</button>
               </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; 2023 Tétouan Luxury Villas. {t('footer_rights')}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href={`/${locale || 'fr'}/privacy`} className="cursor-pointer hover:text-white transition">Privacy Policy</a>
              <a href={`/${locale || 'fr'}/terms`} className="cursor-pointer hover:text-white transition">Terms of Service</a>
              <a href={`/${locale || 'fr'}/faq`} className="cursor-pointer hover:text-white transition">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
  );
};
