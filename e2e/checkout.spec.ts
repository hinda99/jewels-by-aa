import { test, expect } from '@playwright/test';

test.describe('Checkout & WhatsApp Order Flow', () => {
  test('fills customer details and submits order to receive wa.me redirect URL', async ({ page }) => {
    await page.goto('/fr');

    // Populate localStorage cart directly
    await page.evaluate(() => {
      localStorage.setItem(
        'store-cart-v1',
        JSON.stringify([
          {
            productId: 'prod_royal_necklace',
            variantId: 'var_rn_gold_standard',
            quantity: 1,
          },
        ])
      );
    });

    await page.goto('/fr/checkout');

    // Fill delivery form inputs
    await page.locator('input[placeholder*="Benali"]').fill('Amine Benali');
    await page.locator('input[placeholder*="0612345678"]').fill('0612345678');
    await page.locator('input[placeholder*="Casablanca"]').fill('Casablanca');
    await page.locator('textarea[placeholder*="Adresse"]').fill('Boulevard Anfa');

    // Intercept POST request to /api/whatsapp-order
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/whatsapp-order') && res.request().method() === 'POST'
    );

    // Submit form
    await page.locator('button[type="submit"]').click();

    const response = await responsePromise;
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.url).toBeTruthy();
    expect(body.url).toContain('https://wa.me/');
    expect(body.reference).toMatch(/^WA-\d{8}-[0-9A-F]{4}$/);
  });

  test('server rejects cart payloads with mismatched variants', async ({ page }) => {
    await page.goto('/fr');

    // Inject tampered cart payload (variant from another product)
    await page.evaluate(() => {
      localStorage.setItem(
        'store-cart-v1',
        JSON.stringify([
          {
            productId: 'prod_royal_necklace',
            variantId: 'var_invalid_mismatched',
            quantity: 1,
          },
        ])
      );
    });

    await page.goto('/fr/checkout');

    await page.locator('input[placeholder*="Benali"]').fill('Test User');
    await page.locator('input[placeholder*="0612345678"]').fill('0612345678');
    await page.locator('input[placeholder*="Casablanca"]').fill('Rabat');
    await page.locator('textarea[placeholder*="Adresse"]').fill('Hay Riad');

    await page.locator('button[type="submit"]').click();

    // Verify error alert appears
    await expect(page.locator('text=Erreur')).toBeVisible();
  });
});
