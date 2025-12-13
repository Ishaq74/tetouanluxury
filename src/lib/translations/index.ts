import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { ar } from './ar';

export const translations = {
  en,
  fr,
  es,
  ar,
};

export type TranslationKey = keyof typeof en;
