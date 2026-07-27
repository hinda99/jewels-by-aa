import { z } from 'zod';
import { Locale } from '@/config/locales';

const BIDI_UNSAFE_REGEX = /[\u202A-\u202E\u2066-\u2069]/g;

const safeText = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .transform((str) => str.normalize('NFKC').replace(BIDI_UNSAFE_REGEX, ''));

export const LocaleSchema = z.enum(['ar', 'fr', 'en'] as const);

export const CartItemSchema = z.object({
  productId: z.string().trim().regex(/^[a-zA-Z0-9_-]{1,64}$/),
  variantId: z.string().trim().regex(/^[a-zA-Z0-9_-]{1,64}$/),
  quantity: z.number().int().min(1).max(99),
});

export const CheckoutRequestSchema = z.object({
  locale: LocaleSchema,
  customer: z.object({
    name: safeText(100),
    phone: z.string().trim().min(6).max(30),
    city: safeText(100),
    address: safeText(250),
    notes: z
      .string()
      .trim()
      .max(500)
      .optional()
      .transform((val) => (val ? val.normalize('NFKC').replace(BIDI_UNSAFE_REGEX, '') : undefined)),
  }),
  items: z.array(CartItemSchema).min(1).max(100),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;
