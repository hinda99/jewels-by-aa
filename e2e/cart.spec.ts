import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Flow', () => {
  test('adds product to cart and interacts with Cart Drawer', async ({ page }) => {
    await page.goto('/fr');

    // Verify Homepage title
    await expect(page.locator('h1')).toContainText('Bijoux');

    // Click on Add to Cart button on first product card
    const addToCartBtn = page.locator('button', { hasText: 'Ajouter au Panier' }).first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // Verify button state changes to 'Ajouté'
    await expect(page.locator('button', { hasText: 'Ajouté' })).toBeVisible();

    // Verify Header cart badge counter shows at least 1
    const cartBadge = page.locator('header span', { hasText: '1' });
    await expect(cartBadge).toBeVisible();

    // Click on Header cart icon to open slide-over Cart Drawer
    await page.locator('header button[aria-label="Panier"]').click();

    // Verify Cart Drawer is visible
    await expect(page.locator('h2', { hasText: 'Votre Panier' })).toBeVisible();

    // Click on Checkout link inside Cart Drawer
    const checkoutBtn = page.locator('a', { hasText: 'Passer la commande' });
    await expect(checkoutBtn).toBeVisible();
  });
});
