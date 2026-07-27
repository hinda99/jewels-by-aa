'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check, Eye } from 'lucide-react';
import { Product } from '@/types/catalog';
import { Locale } from '@/config/locales';
import { useCart } from '@/context/cart-context';
import { isValidImageUrl } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  locale: Locale;
  dictionary: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, locale, dictionary }) => {
  const { addItem } = useCart();
  const activeVariants = product.variants.filter((v) => v.active);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    activeVariants[0]?.id || ''
  );
  const [isAdded, setIsAdded] = useState(false);

  const selectedVariant = activeVariants.find((v) => v.id === selectedVariantId) || activeVariants[0];
  const unitPriceMad = product.basePriceMad + (selectedVariant?.priceAdjustmentMad || 0);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product.id, selectedVariant.id, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const getVariantLabel = (v: any) => {
    const parts = [
      v.size,
      v.color?.[locale] || v.color?.fr,
      v.material?.[locale] || v.material?.fr,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(' - ') : v.sku;
  };

  const firstImageUrl = product.imageUrls.find((url) => isValidImageUrl(url));

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col glass-card-hover">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <Link href={`/${locale}/products/${product.slug}`}>
          {firstImageUrl ? (
            <Image
              src={firstImageUrl}
              alt={product.names[locale] || product.names.fr}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-serif">
              Jewels by A&A
            </div>
          )}
        </Link>

        {/* Quick View Link Button */}
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none group-hover:pointer-events-auto"
        >
          <span className="px-4 py-2 bg-slate-900/90 text-white font-serif text-xs rounded-full border border-blue-400/50 shadow-xl flex items-center gap-1.5 hover:bg-slate-800">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>{dictionary.catalog.viewDetails}</span>
          </span>
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {product.featured && (
            <span className="bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
              ★ {dictionary.catalog.featuredTitle}
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/${locale}/products/${product.slug}`}>
            <h3 className="text-base font-serif font-semibold text-slate-900 mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.names[locale] || product.names.fr}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {product.descriptions[locale] || product.descriptions.fr}
          </p>
        </div>

        <div>
          {/* Variant Selector */}
          {activeVariants.length > 1 && (
            <div className="mb-4">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                {dictionary.catalog.selectVariant}
              </label>
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {activeVariants.map((v) => (
                  <option key={v.id} value={v.id} className="bg-white text-slate-900">
                    {getVariantLabel(v)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pricing & Add to Cart */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="text-lg font-bold text-slate-900">
                {unitPriceMad} <span className="text-xs font-normal text-slate-500">MAD</span>
              </span>
              {product.comparePriceMad && product.comparePriceMad > unitPriceMad && (
                <span className="block text-xs text-slate-400 line-through">
                  {product.comparePriceMad} MAD
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs shadow-md transition-all cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold hover:shadow-emerald-500/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ajouté</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{dictionary.catalog.addToCart}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
