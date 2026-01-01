import enTranslations from '@i18n/en.json';
import frTranslations from '@i18n/fr.json';
import esTranslations from '@i18n/es.json';
import arTranslations from '@i18n/ar.json';

const translations: Record<string, Record<string, string>> = {
  en: enTranslations,
  fr: frTranslations,
  es: esTranslations,
  ar: arTranslations,
};

export function t(key: string, lang: string = 'en'): string {
  const langTranslations = translations[lang] || translations['en'];
  return langTranslations[key] || key;
}

export default t;
