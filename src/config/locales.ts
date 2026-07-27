export type Locale = 'ar' | 'fr' | 'en';

export const locales: Locale[] = ['fr', 'ar', 'en'];

export const defaultLocale: Locale = 'fr';

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  ar: 'rtl',
  fr: 'ltr',
  en: 'ltr',
};

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  ar: 'العربية',
  en: 'English',
};

export function isSupportedLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
