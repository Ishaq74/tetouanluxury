import { en } from './en';
import { fr } from './fr';

export const translations = {
  en,
  fr,
  es: en, // Fallback to English for Spanish (can be expanded later)
  ar: en, // Fallback to English for Arabic (can be expanded later)
};

export type TranslationKey = keyof typeof en;
