const { test, expect, devices } = require('@playwright/test');

test.describe('Responsive layout', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test(`no horizontal overflow at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHorizontalScroll).toBe(false);
    });
  }

  test('floating WhatsApp button is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('#waFloatBtn')).toBeVisible();
  });
});

test.describe('External links', () => {
  test('Google Maps link opens in a new tab with correct target', async ({ page }) => {
    await page.goto('/');
    const mapLink = page.locator('.link-map');
    await expect(mapLink).toHaveAttribute('target', '_blank');
    await expect(mapLink).toHaveAttribute('href', /google\.com\/maps/);
  });

  test('Facebook and Instagram footer links point to the right profiles', async ({ page }) => {
    await page.goto('/');
    const fbLink = page.locator('.footer-social a[aria-label="Facebook"]');
    const igLink = page.locator('.footer-social a[aria-label="Instagram"]');

    await expect(fbLink).toHaveAttribute('href', /facebook\.com/);
    await expect(igLink).toHaveAttribute('href', /instagram\.com\/armafix\.es/);
  });

  test('footer legal links resolve without 404', async ({ page, request, baseURL }) => {
    await page.goto('/');
    const links = ['aviso-legal.html', 'privacidad.html', 'cookies.html'];

    for (const link of links) {
      const response = await request.get(new URL(link, baseURL).toString());
      expect(response.status(), `${link} should not 404`).toBeLessThan(400);
    }
  });
});
