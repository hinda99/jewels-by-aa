import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';
import { Locale, isSupportedLocale, defaultLocale } from '@/config/locales';
import { catalogRepository } from '@/lib/catalog/sheets-repository';
import { ProductCard } from '@/components/catalog/ProductCard';
import { isValidImageUrl } from '@/lib/utils';

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

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const currentLocale: Locale = isSupportedLocale(lang) ? lang : defaultLocale;
  const dictionary = await getDictionary(currentLocale);

  const products = await catalogRepository.getProducts();
  const categories = await catalogRepository.getCategories();
  const featuredProducts = products.filter((p) => p.featured);
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ||
    process.env.WHATSAPP_PHONE_NUMBER ||
    '212698638275';

  return (
    <div className="space-y-16 pb-16 bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-800 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-blue-300 text-xs font-medium mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Nouveauté — Collection Artisanal 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            {dictionary.hero.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {dictionary.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${currentLocale}/products`}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-serif font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>{dictionary.hero.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{dictionary.hero.whatsappCta}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{dictionary.features.fastDelivery}</h4>
              <p className="text-xs text-slate-500">{dictionary.features.fastDeliveryDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{dictionary.features.whatsappOrder}</h4>
              <p className="text-xs text-slate-500">{dictionary.features.whatsappOrderDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{dictionary.features.authenticQuality}</h4>
              <p className="text-xs text-slate-500">{dictionary.features.authenticQualityDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {dictionary.catalog.featuredTitle}
            </h2>
            <div className="w-16 h-1 bg-blue-600 mt-2 rounded-full" />
          </div>

          <Link
            href={`/${currentLocale}/products`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>{dictionary.catalog.allProducts}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={currentLocale}
              dictionary={dictionary}
            />
          ))}
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            {dictionary.nav.categories}
          </h2>
          <div className="w-16 h-1 bg-blue-600 mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${currentLocale}/products?category=${category.slug}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all bg-slate-900"
            >
              {isValidImageUrl(category.imageUrl) ? (
                <Image
                  src={category.imageUrl!}
                  alt={category.names[currentLocale] || category.names.fr}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-serif">
                  Jewels by A&A
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent flex items-end p-6">
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-blue-300 transition-colors">
                  {category.names[currentLocale] || category.names.fr}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
