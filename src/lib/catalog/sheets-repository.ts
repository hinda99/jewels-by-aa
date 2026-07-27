import 'server-only';

import { unstable_cache } from 'next/cache';
import { CatalogBundle, Product, Category, ProductVariant } from '@/types/catalog';
import { CatalogRepository } from './repository';
import {
  convertMatrixToObjects,
  parseProductRow,
  parseVariantRow,
  parseCategoryRow,
} from './sheets-schemas';

export const MOCK_CATALOG: CatalogBundle = {
  settings: {
    storeName: process.env.NEXT_PUBLIC_STORE_NAME || 'Jewels by A&A',
    whatsappNumber: process.env.WHATSAPP_PHONE_NUMBER || '212698638275',
    defaultLocale: 'fr',
    currency: 'MAD',
    deliveryMessages: {
      fr: 'Frais de livraison à confirmer sur WhatsApp',
      ar: 'يتم تأكيد رسوم التوصيل عبر واتساب',
      en: 'Delivery fee to be confirmed on WhatsApp',
    },
  },
  categories: [
    {
      id: 'cat_necklaces',
      slug: 'necklaces',
      active: true,
      sortOrder: 1,
      names: {
        fr: 'Colliers & Pendentifs',
        ar: 'قلادات ودلايات',
        en: 'Necklaces & Pendants',
      },
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    },
    {
      id: 'cat_bracelets',
      slug: 'bracelets',
      active: true,
      sortOrder: 2,
      names: {
        fr: 'Bracelets & Gourmets',
        ar: 'أساور وأسورة',
        en: 'Bracelets & Bangles',
      },
      imageUrl: 'https://images.unsplash.com/photo-1611591475140-137da19c00b3?w=800&q=80',
    },
    {
      id: 'cat_rings',
      slug: 'rings',
      active: true,
      sortOrder: 3,
      names: {
        fr: 'Bagues & Solitaires',
        ar: 'خواتم وسوليتير',
        en: 'Rings & Bands',
      },
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    },
  ],
  products: [
    {
      id: 'prod_royal_necklace',
      slug: 'royal-emerald-pendant',
      active: true,
      categoryId: 'cat_necklaces',
      names: {
        fr: 'Pendentif Émeraude Royale',
        ar: 'قلادة الزمرد الملكي',
        en: 'Royal Emerald Pendant',
      },
      descriptions: {
        fr: 'Sublime pendentif serti d’une émeraude véritable et entouré de zirconiums étincelants.',
        ar: 'قلادة فاخرة مرصعة بحجر الزمرد الأصلي ومحاطة بأحجار الزركون البراقة.',
        en: 'Exquisite pendant set with a genuine emerald stone surrounded by sparkling zirconiums.',
      },
      basePriceMad: 490,
      comparePriceMad: 590,
      imageUrls: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      ],
      stockStatus: 'in_stock',
      featured: true,
      sortOrder: 1,
      variants: [
        {
          id: 'var_rn_gold_standard',
          productId: 'prod_royal_necklace',
          sku: 'JAA-NK-GLD-STD',
          priceAdjustmentMad: 0,
          active: true,
          stockStatus: 'in_stock',
          color: { fr: 'Doré', ar: 'ذهبي', en: 'Gold' },
          material: { fr: 'Plaqué Or 18k', ar: 'مطلي بالذهب 18', en: '18k Gold Plated' },
        },
        {
          id: 'var_rn_silver_standard',
          productId: 'prod_royal_necklace',
          sku: 'JAA-NK-SLV-STD',
          priceAdjustmentMad: -40,
          active: true,
          stockStatus: 'in_stock',
          color: { fr: 'Argenté', ar: 'فضيات', en: 'Silver' },
          material: { fr: 'Argent Massif 925', ar: 'فضة خالصة 925', en: '925 Sterling Silver' },
        },
      ],
    },
    {
      id: 'prod_diamond_bracelet',
      slug: 'diamond-eternity-bracelet',
      active: true,
      categoryId: 'cat_bracelets',
      names: {
        fr: 'Bracelet Éternité Pavé',
        ar: 'سوار الأبدية المرصع',
        en: 'Pavé Eternity Bracelet',
      },
      descriptions: {
        fr: 'Bracelet rigide d’une élégance intemporelle, serti de cristaux soigneusement taillés.',
        ar: 'سوار صلبي بتصميم كلاسيكي خالد، مرصع ببلورات بدقة عالية.',
        en: 'Timeless rigid cuff bracelet, delicately set with precision-cut crystals.',
      },
      basePriceMad: 350,
      comparePriceMad: 420,
      imageUrls: [
        'https://images.unsplash.com/photo-1611591475140-137da19c00b3?w=800&q=80',
      ],
      stockStatus: 'in_stock',
      featured: true,
      sortOrder: 2,
      variants: [
        {
          id: 'var_db_gold_m',
          productId: 'prod_diamond_bracelet',
          sku: 'JAA-BR-GLD-M',
          size: 'Medium (17cm)',
          priceAdjustmentMad: 0,
          active: true,
          stockStatus: 'in_stock',
          color: { fr: 'Or Rose', ar: 'ذهب وردي', en: 'Rose Gold' },
          material: { fr: 'Acier Inoxydable 316L', ar: 'صلب غير قابل للصدأ 316L', en: '316L Stainless Steel' },
        },
      ],
    },
    {
      id: 'prod_solitaire_ring',
      slug: 'crystal-solitaire-ring',
      active: true,
      categoryId: 'cat_rings',
      names: {
        fr: 'Bague Solitaire Éclat',
        ar: 'خاتم سوليتير الإشراق',
        en: 'Radiance Solitaire Ring',
      },
      descriptions: {
        fr: 'Bague solitaire raffinée mettant en valeur une pierre centrale lumineuse.',
        ar: 'خاتم سوليتير راقٍ يبرز حجراً مركزياً مضيئاً.',
        en: 'Refined solitaire ring featuring a luminous center gemstone.',
      },
      basePriceMad: 280,
      imageUrls: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      ],
      stockStatus: 'in_stock',
      featured: true,
      sortOrder: 3,
      variants: [
        {
          id: 'var_sr_52',
          productId: 'prod_solitaire_ring',
          sku: 'JAA-RG-52',
          size: 'Taille 54',
          priceAdjustmentMad: 0,
          active: true,
          stockStatus: 'in_stock',
          color: { fr: 'Argenté', ar: 'فضي', en: 'Silver' },
          material: { fr: 'Argent 925 & Zirconium', ar: 'فضة 925 وزركون', en: '925 Silver & Zircon' },
        },
      ],
    },
  ],
};

function parseCsvToObjects(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const parseLine = (line: string) => {
    const values: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    values.push(cur.trim());
    return values;
  };

  const headers = parseLine(lines[0]).map((h) => h.replace(/^"|"$/g, '').toLowerCase());
  const objects: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawValues = parseLine(lines[i]).map((v) => v.replace(/^"|"$/g, ''));
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = rawValues[index] !== undefined ? rawValues[index] : '';
    });
    objects.push(obj);
  }

  return objects;
}

async function fetchPublicSheetCsv(spreadsheetId: string, tabName: string): Promise<Record<string, string>[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const csvText = await res.text();
    return parseCsvToObjects(csvText);
  } catch (err) {
    console.warn(`[SheetsRepository] Public CSV fetch failed for ${tabName}:`, err);
    return [];
  }
}

async function fetchRawCatalog(): Promise<CatalogBundle> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId) {
    return MOCK_CATALOG;
  }

  // Strategy A: If Service Account Credentials provided, fetch via Official API
  if (clientEmail && privateKey && !privateKey.includes('YOUR_PRIVATE_KEY_HERE')) {
    try {
      const { GoogleAuth } = await import('google-auth-library');
      const auth = new GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      const client = await auth.getClient();
      const token = await client.getAccessToken();

      const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet`);
      ['Products!A:Z', 'Variants!A:Z', 'Categories!A:Z', 'Settings!A:B'].forEach((r) =>
        url.searchParams.append('ranges', r)
      );

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token.token}` },
        signal: AbortSignal.timeout(5000),
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        const valueRanges = data.valueRanges || [];

        const productsRaw = convertMatrixToObjects(valueRanges[0] || {});
        const variantsRaw = convertMatrixToObjects(valueRanges[1] || {});
        const categoriesRaw = convertMatrixToObjects(valueRanges[2] || {});

        const parsedCategories = categoriesRaw.map(parseCategoryRow).filter((c): c is Category => c !== null);
        const parsedVariants = variantsRaw.map(parseVariantRow).filter((v): v is ProductVariant => v !== null);
        const parsedProducts = productsRaw
          .map(parseProductRow)
          .filter((p): p is Product => p !== null)
          .map((product) => {
            const productVariants = parsedVariants.filter((v) => v.productId === product.id);
            return {
              ...product,
              variants: productVariants.length > 0 ? productVariants : product.variants,
            };
          });

        if (parsedProducts.length > 0) {
          return {
            settings: MOCK_CATALOG.settings,
            categories: parsedCategories.length > 0 ? parsedCategories : MOCK_CATALOG.categories,
            products: parsedProducts,
          };
        }
      }
    } catch (err) {
      console.warn('[SheetsRepository] Official API fetch failed, falling back to public CSV endpoint:', err);
    }
  }

  // Strategy B: Public CSV Export endpoint for shared Google Sheets ("Anyone with the link can view")
  try {
    const [productsRaw, variantsRaw, categoriesRaw] = await Promise.all([
      fetchPublicSheetCsv(spreadsheetId, 'Products'),
      fetchPublicSheetCsv(spreadsheetId, 'Variants'),
      fetchPublicSheetCsv(spreadsheetId, 'Categories'),
    ]);

    const parsedCategories = categoriesRaw.map(parseCategoryRow).filter((c): c is Category => c !== null);
    const parsedVariants = variantsRaw.map(parseVariantRow).filter((v): v is ProductVariant => v !== null);
    const parsedProducts = productsRaw
      .map(parseProductRow)
      .filter((p): p is Product => p !== null)
      .map((product) => {
        const productVariants = parsedVariants.filter((v) => v.productId === product.id);
        return {
          ...product,
          variants: productVariants.length > 0 ? productVariants : product.variants,
        };
      });

    if (parsedProducts.length > 0) {
      return {
        settings: MOCK_CATALOG.settings,
        categories: parsedCategories.length > 0 ? parsedCategories : MOCK_CATALOG.categories,
        products: parsedProducts,
      };
    }
  } catch (err) {
    console.error('[SheetsRepository] Public CSV fetch error:', err);
  }

  return MOCK_CATALOG;
}

export const getCatalogBundleCached = unstable_cache(
  async () => fetchRawCatalog(),
  ['catalog-bundle-v1'],
  { revalidate: 60, tags: ['catalog'] }
);

export class GoogleSheetsCatalogRepository implements CatalogRepository {
  async getCatalogBundle(): Promise<CatalogBundle> {
    return getCatalogBundleCached();
  }

  async getProducts(): Promise<Product[]> {
    const bundle = await this.getCatalogBundle();
    return bundle.products.filter((p) => p.active);
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.slug === slug) || null;
  }

  async getCategories(): Promise<Category[]> {
    const bundle = await this.getCatalogBundle();
    return bundle.categories.filter((c) => c.active);
  }

  async getVariants(productId: string): Promise<ProductVariant[]> {
    const product = await this.getProductById(productId);
    return product ? product.variants.filter((v) => v.active) : [];
  }
}

export const catalogRepository = new GoogleSheetsCatalogRepository();
