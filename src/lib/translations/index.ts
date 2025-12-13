/**
 * Fonction de traduction simple pour React et Astro
 * @param key La clé de traduction
 * @param lang La langue (fr, en, es, ar)
 */
export function t(key: string, lang: keyof typeof translations = 'fr'): string {
  return (translations[lang] && translations[lang][key]) || key;
}
import { en } from '@translations/en';
import { fr } from '@translations/fr';
import { es } from '@translations/es';
import { ar } from '@translations/ar';

export const translations = {
  en,
  fr,
  es,
  ar,
};

export type TranslationKey = keyof typeof en;
