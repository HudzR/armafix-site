const { test, expect } = require('@playwright/test');

const EXPECTED_NUMBER = '34614191396';
const WA_BUTTON_IDS = ['waHeaderBtn', 'waHeroBtn', 'waCtaBtn', 'waFloatBtn'];

test.describe('WhatsApp buttons', () => {
  for (const id of WA_BUTTON_IDS) {
    test(`#${id} points to the correct WhatsApp number`, async ({ page }) => {
      await page.goto('/');
      const href = await page.locator(`#${id}`).getAttribute('href');
      expect(href).toContain(`wa.me/${EXPECTED_NUMBER}`);
    });
  }

  test('WhatsApp message text is in Spanish by default', async ({ page }) => {
    await page.goto('/');
    const href = await page.locator('#waHeroBtn').getAttribute('href');
    const decoded = decodeURIComponent(href);
    expect(decoded).toContain('Hola');
  });

  test('WhatsApp message text switches to English', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-lang-btn="en"]').first().click();

    const href = await page.locator('#waHeroBtn').getAttribute('href');
    const decoded = decodeURIComponent(href);
    expect(decoded).toContain('Hi!');
  });

  test('tel: link uses the correct phone number', async ({ page }) => {
    await page.goto('/');
    const telLink = page.locator('a[href^="tel:"]').first();
    const href = await telLink.getAttribute('href');
    expect(href).toBe('tel:+34614191396');
  });

  test('mailto: link uses the correct email address', async ({ page }) => {
    await page.goto('/');
    const mailLink = page.locator('a[href^="mailto:"]').first();
    const href = await mailLink.getAttribute('href');
    expect(href).toBe('mailto:info@armafix.es');
  });
});
