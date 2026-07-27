import { test, expect } from '@playwright/test';

test.describe('Multilingual & RTL Layout Flow', () => {
  test('renders French locale with LTR direction', async ({ page }) => {
    await page.goto('/fr');
    const htmlDir = await page.getAttribute('html', 'dir');
    const htmlLang = await page.getAttribute('html', 'lang');

    expect(htmlDir).toBe('ltr');
    expect(htmlLang).toBe('fr');
    await expect(page.locator('h1')).toContainText('Bijoux');
  });

  test('renders Arabic locale with RTL direction and translated elements', async ({ page }) => {
    await page.goto('/ar');
    const htmlDir = await page.getAttribute('html', 'dir');
    const htmlLang = await page.getAttribute('html', 'lang');

    expect(htmlDir).toBe('rtl');
    expect(htmlLang).toBe('ar');
    await expect(page.locator('h1')).toContainText('مجوهرات');
  });

  test('renders English locale with LTR direction', async ({ page }) => {
    await page.goto('/en');
    const htmlDir = await page.getAttribute('html', 'dir');
    const htmlLang = await page.getAttribute('html', 'lang');

    expect(htmlDir).toBe('ltr');
    expect(htmlLang).toBe('en');
    await expect(page.locator('h1')).toContainText('Jewelry');
  });
});
