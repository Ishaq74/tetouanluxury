
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TRANSLATIONS } from './constants';
import { useData } from './DataContext';
import { LocalizedString } from './types';

type Language = 'EN' | 'FR' | 'AR' | 'ES';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.EN) => string;
  resolveContent: (content: LocalizedString | string | undefined) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');
  
  // Try to get dynamic translations from DataContext, fallback to static if not ready
  let dynamicTranslations = TRANSLATIONS;
  try {
      const data = useData();
      dynamicTranslations = data.translations;
  } catch (e) {
      // DataProvider not yet ready or available
  }

  const t = (key: keyof typeof TRANSLATIONS.EN) => {
    return dynamicTranslations[language][key] || dynamicTranslations['EN'][key] || key;
  };

  // Helper to resolve localized content safely
  const resolveContent = (content: LocalizedString | string | undefined): string => {
      if (!content) return '';
      if (typeof content === 'string') return content; // Legacy/Fallback support
      return content[language] || content['EN'] || '';
  };

  const isRTL = language === 'AR';

  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language.toLowerCase();
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, resolveContent, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
