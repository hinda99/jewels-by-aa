import React from 'react';
import { Locale, isSupportedLocale, defaultLocale } from '@/config/locales';
import { catalogRepository } from '@/lib/catalog/sheets-repository';
import { ProductCard } from '@/components/catalog/ProductCard';
import Link from 'next/link';

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

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { lang } = await params;
  const { category: selectedCategorySlug, search: searchQuery } = await searchParams;

  const currentLocale: Locale = isSupportedLocale(lang) ? lang : defaultLocale;
  const dictionary = await getDictionary(currentLocale);

  const allProducts = await catalogRepository.getProducts();
  const categories = await catalogRepository.getCategories();

  let selectedCategory = categories.find((c) => c.slug === selectedCategorySlug);
  let filteredProducts = selectedCategory
    ? allProducts.filter((p) => p.categoryId === selectedCategory?.id)
    : allProducts;

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter((p) => {
      const name = (p.names[currentLocale] || p.names.fr).toLowerCase();
      const desc = (p.descriptions[currentLocale] || p.descriptions.fr).toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          {searchQuery
            ? `Résultats pour "${searchQuery}"`
            : selectedCategory
            ? selectedCategory.names[currentLocale] || selectedCategory.names.fr
            : dictionary.catalog.allProducts}
        </h1>
        <div className="w-16 h-1 bg-blue-600 mt-2 rounded-full" />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2.5">
        <Link
          href={`/${currentLocale}/products`}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
            !selectedCategorySlug && !searchQuery
              ? 'bg-blue-600 text-white font-bold shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {dictionary.catalog.allProducts}
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${currentLocale}/products?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedCategorySlug === cat.slug
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.names[currentLocale] || cat.names.fr}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 text-slate-500">
          Aucun produit ne correspond à votre recherche.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={currentLocale}
              dictionary={dictionary}
            />
          ))}
        </div>
      )}
    </div>
  );
}
