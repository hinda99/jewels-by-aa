'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check, MessageCircle, Truck, ShieldCheck, Plus, Minus } from 'lucide-react';
import { Product, Category } from '@/types/catalog';
import { Locale } from '@/config/locales';
import { useCart } from '@/context/cart-context';
import { isValidImageUrl } from '@/lib/utils';

interface ProductDetailClientProps {
  product: Product;
  category?: Category;
  locale: Locale;
  dictionary: any;
}

export default function ProductDetailClient({
  product,
  category,
  locale,
  dictionary,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const activeVariants = product.variants.filter((v) => v.active);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(activeVariants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const selectedVariant = activeVariants.find((v) => v.id === selectedVariantId) || activeVariants[0];
  const unitPriceMad = product.basePriceMad + (selectedVariant?.priceAdjustmentMad || 0);

  const validImageUrls = product.imageUrls.filter((url) => isValidImageUrl(url));
  const currentImageUrl = validImageUrls[selectedImageIndex] || validImageUrls[0];
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ||
    process.env.WHATSAPP_PHONE_NUMBER ||
    '212698638275';

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product.id, selectedVariant.id, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const getVariantLabel = (v: any) => {
    const parts = [
      v.size,
      v.color?.[locale] || v.color?.fr,
      v.material?.[locale] || v.material?.fr,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(' - ') : v.sku;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Multi-Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
          {isValidImageUrl(currentImageUrl) ? (
            <Image
              src={currentImageUrl}
              alt={product.names[locale] || product.names.fr}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-serif">
              Jewels by A&A
            </div>
          )}
        </div>

        {/* Thumbnail Selector */}
        {validImageUrls.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {validImageUrls.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  selectedImageIndex === idx
                    ? 'border-blue-600 scale-105 shadow-md'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={url} alt={`Preview ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details & Actions */}
      <div className="space-y-6">
        <div>
          {category && (
            <span className="text-xs uppercase tracking-widest text-blue-600 font-semibold">
              {category.names[locale] || category.names.fr}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-1">
            {product.names[locale] || product.names.fr}
          </h1>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-3xl font-bold text-slate-900 font-sans">
              {unitPriceMad} <span className="text-sm font-normal text-slate-500">MAD</span>
            </span>
            {product.comparePriceMad && product.comparePriceMad > unitPriceMad && (
              <span className="text-lg text-slate-400 line-through">
                {product.comparePriceMad} MAD
              </span>
            )}
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-medium">
              ✓ {dictionary.catalog.inStock}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed border-t border-b border-slate-100 py-4">
          {product.descriptions[locale] || product.descriptions.fr}
        </p>

        {/* Variant Selection Pills */}
        {activeVariants.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {dictionary.catalog.selectVariant}
            </label>
            <div className="flex flex-wrap gap-2.5">
              {activeVariants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    selectedVariantId === v.id
                      ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {getVariantLabel(v)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Modifier */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {dictionary.cart.quantity}
          </label>
          <div className="flex items-center w-36 border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-3 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-bold text-sm text-slate-900">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="p-3 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex-1 py-4 rounded-xl font-serif font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-emerald-500/20'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>Ajouté au Panier</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>{dictionary.catalog.addToCart}</span>
              </>
            )}
          </button>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `Bonjour Jewels by A&A, je souhaite me renseigner sur le produit : ${product.names[locale] || product.names.fr}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Poser une question</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Truck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Livraison partout au Maroc</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Qualité & Authenticité Garantie</span>
          </div>
        </div>
      </div>
    </div>
  );
}
