import { describe, it, expect } from 'vitest';
import { CheckoutRequestSchema } from '@/lib/security/schemas';
import { resolveOrder, generateOrderReference } from '@/lib/orders/resolve-order';
import { buildLocalizedWhatsAppMessage } from '@/lib/orders/whatsapp-message';
import { Product } from '@/types/catalog';

describe('Order Resolution & Security Verification', () => {
  const sampleProducts: Product[] = [
    {
      id: 'prod_1',
      slug: 'emerald-necklace',
      active: true,
      categoryId: 'cat_necklaces',
      names: { fr: 'Collier Émeraude', ar: 'قلادة الزمرد', en: 'Emerald Necklace' },
      descriptions: { fr: 'Description', ar: 'وصف', en: 'Description' },
      basePriceMad: 500,
      imageUrls: [],
      stockStatus: 'in_stock',
      featured: true,
      sortOrder: 1,
      variants: [
        {
          id: 'var_gold',
          productId: 'prod_1',
          sku: 'SKU-GOLD',
          priceAdjustmentMad: 50,
          active: true,
          stockStatus: 'in_stock',
        },
      ],
    },
  ];

  it('generates a valid order reference format', () => {
    const ref = generateOrderReference();
    expect(ref).toMatch(/^WA-\d{8}-[0-9A-F]{4}$/);
  });

  it('correctly validates valid checkout payloads with Zod', () => {
    const payload = {
      locale: 'fr',
      customer: {
        name: 'Amine Benali',
        phone: '0612345678',
        city: 'Casablanca',
        address: 'Boulevard Anfa',
      },
      items: [
        {
          productId: 'prod_1',
          variantId: 'var_gold',
          quantity: 2,
        },
      ],
    };

    const parsed = CheckoutRequestSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
  });

  it('authoritatively calculates unit prices and line totals on the server', () => {
    const items = [{ productId: 'prod_1', variantId: 'var_gold', quantity: 2 }];
    const resolved = resolveOrder('fr', items, sampleProducts);

    expect(resolved.lines).toHaveLength(1);
    expect(resolved.lines[0].unitPriceMad).toBe(550); // 500 base + 50 adjustment
    expect(resolved.lines[0].lineTotalMad).toBe(1100);
    expect(resolved.subtotalMad).toBe(1100);
  });

  it('rejects variants that do not belong to the product', () => {
    const items = [{ productId: 'prod_other', variantId: 'var_gold', quantity: 1 }];
    expect(() => resolveOrder('fr', items, sampleProducts)).toThrow();
  });

  it('formats localized WhatsApp prefilled order message', () => {
    const msg = buildLocalizedWhatsAppMessage({
      locale: 'fr',
      customer: { name: 'Amine', phone: '0600000000', city: 'Rabat', address: 'Riad' },
      lines: [
        {
          productId: 'prod_1',
          variantId: 'var_gold',
          name: 'Collier Émeraude',
          variantLabel: 'Standard',
          sku: 'SKU-GOLD',
          unitPriceMad: 550,
          quantity: 2,
          lineTotalMad: 1100,
        },
      ],
      subtotalMad: 1100,
      reference: 'WA-20260727-A8F2',
      privacyMode: 'full',
    });

    expect(msg).toContain('Nouvelle commande — #WA-20260727-A8F2');
    expect(msg).toContain('Collier Émeraude');
    expect(msg).toContain('1100 MAD');
  });
});
