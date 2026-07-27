'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle } from 'lucide-react';
import { Locale } from '@/config/locales';

interface FooterProps {
  locale: Locale;
  dictionary: any;
}

export const Footer: React.FC<FooterProps> = ({ locale, dictionary }) => {
  const currentYear = 2026;
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ||
    process.env.WHATSAPP_PHONE_NUMBER ||
    '212698638275';

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-serif font-bold text-white">JEWELS BY A&A</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {dictionary.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {dictionary.nav.products}
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href={`/${locale}/products`} className="hover:text-blue-400 transition-colors">
                  {dictionary.catalog.allProducts}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {dictionary.features.whatsappOrder}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {dictionary.features.whatsappOrderDesc}
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium text-xs shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Direct
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {currentYear} Jewels by A&A. {dictionary.footer.rights}
        </div>
      </div>
    </footer>
  );
};
