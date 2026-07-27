'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Locale, isSupportedLocale, defaultLocale } from '@/config/locales';
import { useCart } from '@/context/cart-context';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const [currentLocale, setCurrentLocale] = useState<Locale>('fr');
  const [dictionary, setDictionary] = useState<any>(null);
  const { items } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ lang }) => {
      const loc = isSupportedLocale(lang) ? lang : defaultLocale;
      setCurrentLocale(loc);
      import(`@/dictionaries/${loc}.json`).then((mod) => setDictionary(mod.default));
    });
  }, [params]);

  if (!dictionary) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center text-slate-500">...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-slate-500">{dictionary.cart.empty}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const payload = {
        locale: currentLocale,
        customer: {
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          notes: formData.notes || undefined,
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/whatsapp-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la préparation de la commande.');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-900">{dictionary.checkout.title}</h1>
        <p className="text-xs text-slate-500 mt-1">{dictionary.checkout.subtitle}</p>
        <div className="w-16 h-1 bg-blue-600 mt-3 rounded-full" />
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {dictionary.checkout.name} *
          </label>
          <input
            type="text"
            required
            maxLength={100}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={dictionary.checkout.namePlaceholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {dictionary.checkout.phone} *
          </label>
          <input
            type="tel"
            required
            maxLength={30}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder={dictionary.checkout.phonePlaceholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {dictionary.checkout.city} *
          </label>
          <input
            type="text"
            required
            maxLength={100}
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder={dictionary.checkout.cityPlaceholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {dictionary.checkout.address} *
          </label>
          <textarea
            required
            rows={3}
            maxLength={250}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder={dictionary.checkout.addressPlaceholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {dictionary.checkout.notes}
          </label>
          <input
            type="text"
            maxLength={500}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder={dictionary.checkout.notesPlaceholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-serif font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{dictionary.checkout.processing}</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-5 h-5" />
              <span>{dictionary.checkout.submit}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
