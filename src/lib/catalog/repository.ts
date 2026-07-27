import { Product, Category, ProductVariant, CatalogBundle } from '@/types/catalog';

export interface CatalogRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getCategories(): Promise<Category[]>;
  getVariants(productId: string): Promise<ProductVariant[]>;
  getCatalogBundle(): Promise<CatalogBundle>;
}
