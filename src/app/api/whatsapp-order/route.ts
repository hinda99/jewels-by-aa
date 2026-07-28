import { NextRequest, NextResponse } from 'next/server';
import { CheckoutRequestSchema } from '@/lib/security/schemas';
import { catalogRepository } from '@/lib/catalog/sheets-repository';
import { resolveOrder } from '@/lib/orders/resolve-order';
import { buildLocalizedWhatsAppMessage, buildWaMeUrl } from '@/lib/orders/whatsapp-message';
import { WhatsAppPrivacyMode } from '@/types/order';

function verifySameOrigin(request: NextRequest): void {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const secFetchSite = request.headers.get('sec-fetch-site');

  if (secFetchSite && !['same-origin', 'same-site', 'none'].includes(secFetchSite)) {
    throw new Error('Cross-site request blocked');
  }

  if (origin && host) {
    try {
      const parsedOrigin = new URL(origin);
      if (parsedOrigin.host !== host) {
        throw new Error('Origin host mismatch');
      }
    } catch {
      throw new Error('Invalid origin header');
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    verifySameOrigin(request);

    const body = await request.json();
    const parseResult = CheckoutRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid checkout request data.', details: parseResult.error.flatten() },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const { locale, customer, items } = parseResult.data;
    const products = await catalogRepository.getProducts();

    const resolved = resolveOrder(locale, items, products);

    const privacyMode: WhatsAppPrivacyMode =
      process.env.WHATSAPP_MESSAGE_MODE === 'minimal' ? 'minimal' : 'full';

    const messageText = buildLocalizedWhatsAppMessage({
      locale,
      customer,
      lines: resolved.lines,
      subtotalMad: resolved.subtotalMad,
      reference: resolved.reference,
      privacyMode,
    });

    const destinationPhone =
      process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ||
      process.env.WHATSAPP_PHONE_NUMBER ||
      '212698638275';

    const waUrl = buildWaMeUrl(destinationPhone, messageText);

    return NextResponse.json(
      { url: waUrl, reference: resolved.reference },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    console.error('[WhatsAppOrder API Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process order request.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
