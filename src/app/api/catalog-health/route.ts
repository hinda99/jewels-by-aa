import { NextResponse } from 'next/server';
import { catalogRepository } from '@/lib/catalog/sheets-repository';

export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const isLiveCredentialsConfigured = Boolean(
      spreadsheetId &&
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
        process.env.GOOGLE_PRIVATE_KEY
    );

    const bundle = await catalogRepository.getCatalogBundle();
    const activeProducts = bundle.products.filter((p) => p.active);
    const activeCategories = bundle.categories.filter((c) => c.active);

    return NextResponse.json(
      {
        status: 'ok',
        source: isLiveCredentialsConfigured ? 'google_sheets_live' : 'demo_fallback',
        spreadsheetIdConfigured: Boolean(spreadsheetId),
        activeProductCount: activeProducts.length,
        activeCategoryCount: activeCategories.length,
        storeName: bundle.settings.storeName,
        whatsappNumber: bundle.settings.whatsappNumber,
        timestamp: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Catalog health check failed' },
      { status: 500 }
    );
  }
}
