import { Locale } from '@/config/locales';

export interface CustomerDetails {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export interface OrderLineItem {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  sku: string;
  unitPriceMad: number;
  quantity: number;
  lineTotalMad: number;
}

export interface ResolvedOrder {
  reference: string;
  lines: OrderLineItem[];
  subtotalMad: number;
}

export type WhatsAppPrivacyMode = 'minimal' | 'full';

export interface WhatsAppMessageInput {
  locale: Locale;
  customer: CustomerDetails;
  lines: OrderLineItem[];
  subtotalMad: number;
  reference: string;
  privacyMode: WhatsAppPrivacyMode;
}
