import { describe, it, expect } from 'vitest';
import {
  convertMatrixToObjects,
  parseProductRow,
  parseVariantRow,
  parseCategoryRow,
} from '@/lib/catalog/sheets-schemas';

describe('Google Sheets Row Parser & Validation', () => {
  it('converts 2D header & row arrays into key-value objects', () => {
    const valueRange = {
      values: [
        ['ID', 'Name_FR', 'Base_Price_MAD', 'Active'],
        ['prod_1', 'Bague Solitaire', '290', 'TRUE'],
      ],
    };

    const objects = convertMatrixToObjects(valueRange);
    expect(objects).toHaveLength(1);
    expect(objects[0]['id']).toBe('prod_1');
    expect(objects[0]['name_fr']).toBe('Bague Solitaire');
    expect(objects[0]['base_price_mad']).toBe('290');
    expect(objects[0]['active']).toBe('TRUE');
  });

  it('parses valid product rows correctly', () => {
    const rawRow = {
      id: 'prod_test',
      slug: 'test-product',
      active: 'TRUE',
      category_id: 'cat_rings',
      name_fr: 'Bague Test',
      name_ar: 'خاتم تجربة',
      name_en: 'Test Ring',
      base_price_mad: '350',
      compare_price_mad: '450',
      image_urls: 'https://example.com/img1.jpg|https://example.com/img2.jpg',
      stock_status: 'in_stock',
      featured: 'TRUE',
      sort_order: '5',
    };

    const product = parseProductRow(rawRow);
    expect(product).not.toBeNull();
    expect(product?.id).toBe('prod_test');
    expect(product?.basePriceMad).toBe(350);
    expect(product?.comparePriceMad).toBe(450);
    expect(product?.imageUrls).toHaveLength(2);
    expect(product?.featured).toBe(true);
  });

  it('safely handles missing or malformed numeric fields', () => {
    const rawRow = {
      id: 'prod_malformed',
      name_fr: 'Product Malformed',
      base_price_mad: 'invalid_price',
    };

    const product = parseProductRow(rawRow);
    expect(product).not.toBeNull();
    expect(product?.basePriceMad).toBe(0);
  });

  it('parses product variants accurately', () => {
    const rawVariant = {
      id: 'var_gold_m',
      product_id: 'prod_test',
      sku: 'SKU-TEST-GLD',
      size: 'M',
      color_fr: 'Doré',
      material_fr: 'Plaqué Or',
      price_adjustment_mad: '20',
      active: 'TRUE',
      stock_status: 'in_stock',
    };

    const variant = parseVariantRow(rawVariant);
    expect(variant).not.toBeNull();
    expect(variant?.sku).toBe('SKU-TEST-GLD');
    expect(variant?.priceAdjustmentMad).toBe(20);
    expect(variant?.color?.fr).toBe('Doré');
  });

  it('parses categories accurately', () => {
    const rawCategory = {
      id: 'cat_necklaces',
      slug: 'necklaces',
      name_fr: 'Colliers',
      active: 'TRUE',
      sort_order: '1',
    };

    const category = parseCategoryRow(rawCategory);
    expect(category).not.toBeNull();
    expect(category?.id).toBe('cat_necklaces');
    expect(category?.names.fr).toBe('Colliers');
  });
});
