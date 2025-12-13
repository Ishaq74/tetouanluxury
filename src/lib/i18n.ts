export const languages = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ar: 'العربية',
};

export const defaultLang = 'en';

export type Language = keyof typeof languages;

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Language;
  return defaultLang;
}

export function useTranslations(lang: Language) {
  return function t(key: string) {
    // Import translations dynamically based on language
    // This is a placeholder - will be enhanced with actual translation files
    return key;
  }
}

export function getLocalizedContent<T extends Record<string, any>>(
  content: T,
  lang: Language,
  key: string
): string {
  const localizedKey = `${key}${lang.charAt(0).toUpperCase()}${lang.slice(1)}`;
  return content[localizedKey] || content[`${key}En`] || '';
}
