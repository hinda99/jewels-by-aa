'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Locale } from '@/config/locales';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  dictionary: any;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  locale,
  dictionary,
}) => {
  const { items, updateQuantity, removeItem, getItemCount } = useCart();
  const itemCount = getItemCount();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-slate-900 border-l border-slate-200 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-slate-900">
                  {dictionary.cart.title}
                </h2>
                <span className="text-xs text-slate-500">
                  {itemCount} {itemCount === 1 ? 'article' : 'articles'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm text-slate-500">{dictionary.cart.empty}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  {dictionary.cart.continueShopping}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 bg-slate-200 rounded-lg overflow-hidden shrink-0 border border-slate-300 flex items-center justify-center text-[10px] font-serif text-slate-600">
                    Jewels
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      Product #{item.productId}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mb-2">
                      Variant: {item.variantId}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-slate-300 rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-700 transition-colors text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-700 transition-colors text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        title={dictionary.cart.remove}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{dictionary.cart.deliveryNote}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-slate-600">{dictionary.cart.subtotal}</span>
                <span className="text-xs text-blue-600 font-medium">Calculé à la caisse</span>
              </div>

              <Link
                href={`/${locale}/checkout`}
                onClick={onClose}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-serif font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{dictionary.cart.checkout}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
