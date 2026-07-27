import { z } from 'zod';
import { Product, ProductVariant, Category, StockStatus } from '@/types/catalog';
import { isValidImageUrl, formatImageUrl } from '@/lib/utils';

export const StockStatusSchema = z.enum(['in_stock', 'out_of_stock']);

export function parseProductRow(row: Record<string, string>): Product | null {
  try {
    const id = row['id']?.trim();
    if (!id) return null;

    const basePrice = parseFloat(row['base_price_mad'] || '0');
    const comparePriceRaw = parseFloat(row['compare_price_mad'] || '');
    const comparePriceMad = isNaN(comparePriceRaw) ? undefined : comparePriceRaw;

    const imageUrlsRaw = row['image_urls'] || '';
    const imageUrls = imageUrlsRaw
      .split('|')
      .map((url) => formatImageUrl(url))
      .filter((url) => isValidImageUrl(url));

    const stockStatus: StockStatus =
      row['stock_status'] === 'out_of_stock' ? 'out_of_stock' : 'in_stock';

    return {
      id,
      slug: row['slug']?.trim() || id.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      active: row['active']?.trim().toUpperCase() === 'TRUE',
      categoryId: row['category_id']?.trim() || '',
      subcategoryId: row['subcategory_id']?.trim() || undefined,
      names: {
        fr: row['name_fr']?.trim() || 'Produit Sans Nom',
        ar: row['name_ar']?.trim() || row['name_fr']?.trim() || 'منتج',
        en: row['name_en']?.trim() || row['name_fr']?.trim() || 'Product',
      },
      descriptions: {
        fr: row['description_fr']?.trim() || '',
        ar: row['description_ar']?.trim() || row['description_fr']?.trim() || '',
        en: row['description_en']?.trim() || row['description_fr']?.trim() || '',
      },
      basePriceMad: isNaN(basePrice) ? 0 : basePrice,
      comparePriceMad,
      imageUrls,
      stockStatus,
      featured: row['featured']?.trim().toUpperCase() === 'TRUE',
      sortOrder: parseInt(row['sort_order'] || '0', 10) || 0,
      variants: [],
    };
  } catch (err) {
    console.warn('[parseProductRow] Failed to parse product row:', err);
    return null;
  }
}

export function parseVariantRow(row: Record<string, string>): ProductVariant | null {
  try {
    const id = row['id']?.trim();
    const productId = row['product_id']?.trim();
    if (!id || !productId) return null;

    const priceAdjustment = parseFloat(row['price_adjustment_mad'] || '0');

    const stockStatus: StockStatus =
      row['stock_status'] === 'out_of_stock' ? 'out_of_stock' : 'in_stock';

    return {
      id,
      productId,
      sku: row['sku']?.trim() || id,
      size: row['size']?.trim() || undefined,
      color: {
        fr: row['color_fr']?.trim() || '',
        ar: row['color_ar']?.trim() || row['color_fr']?.trim() || '',
        en: row['color_en']?.trim() || row['color_fr']?.trim() || '',
      },
      material: {
        fr: row['material_fr']?.trim() || '',
        ar: row['material_ar']?.trim() || row['material_fr']?.trim() || '',
        en: row['material_en']?.trim() || row['material_fr']?.trim() || '',
      },
      priceAdjustmentMad: isNaN(priceAdjustment) ? 0 : priceAdjustment,
      active: row['active']?.trim().toUpperCase() === 'TRUE',
      stockStatus,
    };
  } catch (err) {
    console.warn('[parseVariantRow] Failed to parse variant row:', err);
    return null;
  }
}

export function parseCategoryRow(row: Record<string, string>): Category | null {
  try {
    const id = row['id']?.trim();
    if (!id) return null;

    const formattedUrl = formatImageUrl(row['image_url']?.trim());

    return {
      id,
      parentId: row['parent_id']?.trim() || undefined,
      slug: row['slug']?.trim() || id.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      names: {
        fr: row['name_fr']?.trim() || 'Catégorie',
        ar: row['name_ar']?.trim() || row['name_fr']?.trim() || 'تصنيف',
        en: row['name_en']?.trim() || row['name_fr']?.trim() || 'Category',
      },
      imageUrl: isValidImageUrl(formattedUrl) ? formattedUrl : undefined,
      active: row['active']?.trim().toUpperCase() === 'TRUE',
      sortOrder: parseInt(row['sort_order'] || '0', 10) || 0,
    };
  } catch (err) {
    console.warn('[parseCategoryRow] Failed to parse category row:', err);
    return null;
  }
}

export function convertMatrixToObjects(valueRange: { values?: string[][] }): Record<string, string>[] {
  const rows = valueRange.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const objects: Record<string, string>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] !== undefined ? row[index] : '';
    });
    objects.push(obj);
  }

  return objects;
}
