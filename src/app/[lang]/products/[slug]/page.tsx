import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Locale, isSupportedLocale, defaultLocale } from '@/config/locales';
import { catalogRepository } from '@/lib/catalog/sheets-repository';
import ProductDetailClient from './ProductDetailClient';

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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const currentLocale: Locale = isSupportedLocale(lang) ? lang : defaultLocale;
  const dictionary = await getDictionary(currentLocale);

  const product = await catalogRepository.getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const category = (await catalogRepository.getCategories()).find(
    (c) => c.id === product.categoryId
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-amber-300/70">
        <Link href={`/${currentLocale}`} className="hover:text-amber-200 transition-colors">
          {dictionary.nav.home}
        </Link>
        <span>/</span>
        <Link href={`/${currentLocale}/products`} className="hover:text-amber-200 transition-colors">
          {dictionary.nav.products}
        </Link>
        {category && (
          <>
            <span>/</span>
            <Link
              href={`/${currentLocale}/products?category=${category.slug}`}
              className="hover:text-amber-200 transition-colors"
            >
              {category.names[currentLocale] || category.names.fr}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-amber-100 font-medium truncate max-w-[150px] sm:max-w-none">
          {product.names[currentLocale] || product.names.fr}
        </span>
      </nav>

      {/* Interactive Client Component */}
      <ProductDetailClient
        product={product}
        category={category}
        locale={currentLocale}
        dictionary={dictionary}
      />
    </div>
  );
}
