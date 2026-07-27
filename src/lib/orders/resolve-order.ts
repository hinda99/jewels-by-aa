import { Locale } from '@/config/locales';
import { Product, ProductVariant } from '@/types/catalog';
import { CartItem } from '@/types/cart';
import { OrderLineItem, ResolvedOrder } from '@/types/order';

export function generateOrderReference(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');
  return `WA-${dateStr}-${randomHex}`;
}

export function resolveOrder(
  locale: Locale,
  items: CartItem[],
  products: Product[]
): ResolvedOrder {
  const productMap = new Map<string, Product>();
  const variantMap = new Map<string, { product: Product; variant: ProductVariant }>();

  products.forEach((product) => {
    if (product.active) {
      productMap.set(product.id, product);
      product.variants.forEach((variant) => {
        if (variant.active) {
          variantMap.set(variant.id, { product, variant });
        }
      });
    }
  });

  let subtotalMad = 0;

  const lines: OrderLineItem[] = items.map((item) => {
    const entry = variantMap.get(item.variantId);
    if (!entry) {
      throw new Error(`Invalid or inactive product variant: ${item.variantId}`);
    }

    const { product, variant } = entry;

    if (product.id !== item.productId) {
      throw new Error(`Variant ${item.variantId} does not belong to product ${item.productId}`);
    }

    if (product.stockStatus !== 'in_stock' || variant.stockStatus !== 'in_stock') {
      throw new Error(`Product ${product.names[locale]} is currently out of stock.`);
    }

    const unitPriceMad = product.basePriceMad + variant.priceAdjustmentMad;
    if (!Number.isFinite(unitPriceMad) || unitPriceMad < 0) {
      throw new Error(`Invalid price calculation for item ${item.productId}`);
    }

    const lineTotalMad = unitPriceMad * item.quantity;
    subtotalMad += lineTotalMad;

    const colorLabel = variant.color?.[locale];
    const materialLabel = variant.material?.[locale];
    const variantParts = [variant.size, colorLabel, materialLabel].filter(Boolean);
    const variantLabel = variantParts.length > 0 ? variantParts.join(' / ') : 'Standard';

    return {
      productId: product.id,
      variantId: variant.id,
      name: product.names[locale] || product.names.fr,
      variantLabel,
      sku: variant.sku,
      unitPriceMad,
      quantity: item.quantity,
      lineTotalMad,
    };
  });

  return {
    reference: generateOrderReference(),
    lines,
    subtotalMad,
  };
}
