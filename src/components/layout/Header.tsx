'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Sparkles, Globe, Search } from 'lucide-react';
import { Locale, locales, localeNames } from '@/config/locales';
import { useCart } from '@/context/cart-context';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchBar } from '@/components/catalog/SearchBar';

interface HeaderProps {
  locale: Locale;
  dictionary: any;
}

export const Header: React.FC<HeaderProps> = ({ locale, dictionary }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    const pathParts = pathname.split('/');
    pathParts[1] = newLocale;
    const newPath = pathParts.join('/');
    router.push(newPath);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-slate-100 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 via-emerald-400 to-blue-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-serif font-bold tracking-wider text-white group-hover:text-blue-400 transition-colors">
                JEWELS
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-emerald-400 font-sans font-medium">
                by A&A
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <Link
              href={`/${locale}`}
              className="hover:text-blue-400 transition-colors py-1 border-b-2 border-transparent hover:border-blue-400"
            >
              {dictionary.nav.home}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="hover:text-blue-400 transition-colors py-1 border-b-2 border-transparent hover:border-blue-400"
            >
              {dictionary.nav.products}
            </Link>
          </nav>

          {/* Center Search (Desktop) */}
          <div className="hidden lg:block flex-1 max-w-xs">
            <SearchBar locale={locale} />
          </div>

          {/* Right Actions: Search Toggle, Language Switcher & Cart */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-slate-800 text-blue-400"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 border border-slate-700 rounded-full px-3 py-1.5 text-slate-200">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <select
                value={locale}
                onChange={handleLocaleChange}
                className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer"
              >
                {locales.map((loc) => (
                  <option key={loc} value={loc} className="bg-slate-900 text-slate-100">
                    {localeNames[loc]}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700 shadow-sm cursor-pointer"
              aria-label={dictionary.nav.cart}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="lg:hidden p-4 border-t border-slate-800 bg-slate-900/95 flex justify-center">
            <SearchBar locale={locale} onClose={() => setIsSearchOpen(false)} />
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        locale={locale}
        dictionary={dictionary}
      />
    </>
  );
};
