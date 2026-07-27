'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Locale, isSupportedLocale, defaultLocale } from '@/config/locales';
import { useCart } from '@/context/cart-context';

export default function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const [currentLocale, setCurrentLocale] = useState<Locale>('fr');
  const [dictionary, setDictionary] = useState<any>(null);

  const { items, updateQuantity, removeItem, clearCart } = useCart();

  useEffect(() => {
    params.then(({ lang }) => {
      const loc = isSupportedLocale(lang) ? lang : defaultLocale;
      setCurrentLocale(loc);
      import(`@/dictionaries/${loc}.json`).then((mod) => setDictionary(mod.default));
    });
  }, [params]);

  if (!dictionary) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Chargement du panier...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">{dictionary.cart.title}</h1>
        <p className="text-sm text-slate-500">{dictionary.cart.empty}</p>
        <Link
          href={`/${currentLocale}/products`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
        >
          <span>{dictionary.cart.continueShopping}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-900">{dictionary.cart.title}</h1>
        <div className="w-16 h-1 bg-blue-600 mt-2 rounded-full" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative flex items-center justify-center text-xs font-serif text-slate-500">
                Jewels
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Product #{item.productId}</h4>
                <p className="text-xs text-slate-500">Variant: {item.variantId}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              {/* Quantity Controls */}
              <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                  className="p-2 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                  className="p-2 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Remove Action */}
              <button
                onClick={() => removeItem(item.productId, item.variantId)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title={dictionary.cart.remove}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <button
          onClick={clearCart}
          className="text-xs text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
        >
          Vider le panier
        </button>

        <Link
          href={`/${currentLocale}/checkout`}
          className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-serif font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>{dictionary.cart.checkout}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
