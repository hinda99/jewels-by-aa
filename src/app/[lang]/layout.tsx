import React from 'react';
import type { Metadata } from 'next';
import { Locale, isSupportedLocale, defaultLocale, localeDirection } from '@/config/locales';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/cart-context';
import '@/app/globals.css';

async function getDictionary(locale: Locale) {
  switch (locale) {
    case 'ar':
      return (await import('@/dictionaries/ar.json')).default;
    case 'en':
      return (await import('@/dictionaries/en.json')).default;
    case 'fr':
    default:
      return (await import('@/dictionaries/fr.json')).default;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const currentLocale = isSupportedLocale(lang) ? lang : defaultLocale;
  return {
    title: 'Jewels by A&A | Elegance & Handcrafted Jewelry',
    description:
      'Découvrez notre collection raffinée de bijoux au Maroc. Commandez facilement via WhatsApp.',
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const currentLocale: Locale = isSupportedLocale(lang) ? lang : defaultLocale;
  const dir = localeDirection[currentLocale];
  const dictionary = await getDictionary(currentLocale);

  return (
    <html
      lang={currentLocale}
      dir={dir}
      className="h-full bg-slate-50 text-slate-900"
      suppressHydrationWarning
    >
      <body
        className="flex flex-col min-h-screen font-sans antialiased selection:bg-blue-500 selection:text-white"
        suppressHydrationWarning
      >
        <CartProvider>
          <Header locale={currentLocale} dictionary={dictionary} />
          <main className="flex-1">{children}</main>
          <Footer locale={currentLocale} dictionary={dictionary} />
        </CartProvider>
      </body>
    </html>
  );
}
