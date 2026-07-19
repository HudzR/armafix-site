const { test, expect } = require('@playwright/test');

/**
 * Runs under the es-ES locale projects (see playwright.config.js), where
 * a fresh visitor with no saved preference sees Spanish by default.
 * Browser-language auto-detection itself is covered separately in
 * browser-language-detection.spec.js.
 */
test.describe('Language toggle (ES/EN)', () => {
  test('a Spanish-locale visitor with no saved preference sees Spanish content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Montaje de muebles');
  });

  test('switching to EN updates the H1 and hero subtitle', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-lang-btn="en"]').first().click();

    await expect(page.locator('h1')).toContainText('Furniture assembly');
    await expect(page.locator('.hero-sub')).toContainText('Professional furniture assembler');
  });

  test('switching back to ES restores Spanish content', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-lang-btn="en"]').first().click();
    await page.locator('[data-lang-btn="es"]').first().click();

    await expect(page.locator('h1')).toContainText('Montaje de muebles');
  });

  test('active language button has the "active" class', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-lang-btn="en"]').first().click();

    await expect(page.locator('[data-lang-btn="en"]').first()).toHaveClass(/active/);
    await expect(page.locator('[data-lang-btn="es"]').first()).not.toHaveClass(/active/);
  });

  test('language preference persists after reload', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-lang-btn="en"]').first().click();
    await expect(page.locator('h1')).toContainText('Furniture assembly');

    await page.reload();
    await expect(page.locator('h1')).toContainText('Furniture assembly');
  });

  test('FAQ questions are translated after switching language', async ({ page }) => {
    await page.goto('/');
    const firstQuestionES = await page.locator('.faq-q span').first().textContent();
    expect(firstQuestionES).toContain('cuesta');

    await page.locator('[data-lang-btn="en"]').first().click();
    const firstQuestionEN = await page.locator('.faq-q span').first().textContent();
    expect(firstQuestionEN.toLowerCase()).toContain('cost');
  });
});
