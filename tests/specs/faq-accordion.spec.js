const { test, expect } = require('@playwright/test');

test.describe('FAQ accordion', () => {
  test('answer is hidden by default', async ({ page }) => {
    await page.goto('/');
    const firstItem = page.locator('.faq-item').first();
    await expect(firstItem).not.toHaveClass(/open/);
  });

  test('clicking a question opens its answer', async ({ page }) => {
    await page.goto('/');
    const firstItem = page.locator('.faq-item').first();

    await firstItem.locator('.faq-q').click();

    await expect(firstItem).toHaveClass(/open/);
    await expect(firstItem.locator('.faq-q')).toHaveAttribute('aria-expanded', 'true');
  });

  test('opening a second question closes the first one', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('.faq-item');

    await items.nth(0).locator('.faq-q').click();
    await expect(items.nth(0)).toHaveClass(/open/);

    await items.nth(1).locator('.faq-q').click();
    await expect(items.nth(1)).toHaveClass(/open/);
    await expect(items.nth(0)).not.toHaveClass(/open/);
  });

  test('clicking an open question closes it again', async ({ page }) => {
    await page.goto('/');
    const firstItem = page.locator('.faq-item').first();

    await firstItem.locator('.faq-q').click();
    await expect(firstItem).toHaveClass(/open/);

    await firstItem.locator('.faq-q').click();
    await expect(firstItem).not.toHaveClass(/open/);
  });

  test('all FAQ questions are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    const firstButton = page.locator('.faq-q').first();
    await firstButton.focus();
    await expect(firstButton).toBeFocused();
  });
});
