import { Locale } from '@/config/locales';

export type StockStatus = 'in_stock' | 'out_of_stock';

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size?: string;
  color?: Record<Locale, string>;
  material?: Record<Locale, string>;
  priceAdjustmentMad: number;
  active: boolean;
  stockStatus: StockStatus;
}

export interface Product {
  id: string;
  slug: string;
  active: boolean;
  categoryId: string;
  subcategoryId?: string;
  names: Record<Locale, string>;
  descriptions: Record<Locale, string>;
  basePriceMad: number;
  comparePriceMad?: number;
  imageUrls: string[];
  stockStatus: StockStatus;
  featured: boolean;
  sortOrder: number;
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  parentId?: string;
  slug: string;
  names: Record<Locale, string>;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  defaultLocale: Locale;
  currency: string;
  deliveryMessages: Record<Locale, string>;
}

export interface CatalogBundle {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
}
