
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from '@tanstack/react-router';

// --- Premium Image Component ---
export const PremiumImage: React.FC<{ src: string; alt: string; className?: string; onClick?: () => void }> = ({ src, alt, className, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => { setIsLoaded(false); }, [src]);
    return (
        <div className={`relative overflow-hidden bg-stone-200 ${className}`} onClick={onClick}>
            <img src={src} alt={alt} className={`w-full h-full object-cover transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-md'}`} onLoad={() => setIsLoaded(true)} />
            {!isLoaded && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-2 border-stone-300 border-t-amber-600 rounded-full animate-spin"></div></div>}
        </div>
    );
};

// --- SEO Component ---
interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, image, type = 'website' }) => {
  const siteTitle = 'Tétouan Luxury Villas';
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultImage = 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1920';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

// --- Scroll To Top ---
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
