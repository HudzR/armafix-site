const { test, expect } = require('@playwright/test');

test.describe('Page load & basic structure', () => {
  test('loads homepage with correct title and no console errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const response = await page.goto('/');
    expect(response.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/ArmaFix/);
    expect(consoleErrors).toEqual([]);
  });

  test('has exactly one H1 on the page', async ({ page }) => {
    await page.goto('/');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('meta description is present and non-empty', async ({ page }) => {
    await page.goto('/');
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description.length).toBeGreaterThan(20);
  });

  test('all images load successfully (no broken images)', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      // Most gallery images use loading="lazy" and only fetch once they
      // enter the viewport. Scrolling into view first prevents a flaky
      // false-negative where naturalWidth is still 0 simply because the
      // browser hasn't triggered the lazy load yet (seen intermittently
      // in CI, where viewport/timing differs from local runs).
      await img.scrollIntoViewIfNeeded();
      await expect(async () => {
        const naturalWidth = await img.evaluate((el) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }).toPass({ timeout: 5000 });
    }
  });

  test('every image has a non-empty alt attribute', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `Image ${i} is missing alt text`).toBeTruthy();
    }
  });

  test('footer year is populated (not empty)', async ({ page }) => {
    await page.goto('/');
    const year = await page.locator('#year').textContent();
    expect(year.trim()).toMatch(/^\d{4}$/);
  });

  test('logo click scrolls back to top', async ({ page }) => {
    await page.goto('/');
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await page.locator('a.logo').click();

    // Poll instead of a fixed wait — smooth-scroll duration can vary
    // depending on how far down the page we started from.
    await expect.poll(
      async () => page.evaluate(() => window.scrollY),
      { timeout: 3000, message: 'Page did not scroll back to top' }
    ).toBeLessThan(100);
  });
});