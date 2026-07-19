const { test, expect } = require('@playwright/test');

/**
 * This spec runs ONLY under the "chromium-en-locale" project
 * (see playwright.config.js), which sets the browser locale to en-US
 * and clears storage before each test — simulating a first-time visitor
 * with an English browser.
 */
test.describe('Browser language auto-detection', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('an English-browser visitor with no saved preference sees English content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Furniture assembly');
  });

  test('the EN button is marked active for an English-browser visitor', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-lang-btn="en"]').first()).toHaveClass(/active/);
  });

  test('manually switching to ES overrides the browser-language default', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-lang-btn="es"]').first().click();
    await expect(page.locator('h1')).toContainText('Montaje de muebles');

    // and it should stick across a reload, overriding auto-detection again
    await page.reload();
    await expect(page.locator('h1')).toContainText('Montaje de muebles');
  });
});
