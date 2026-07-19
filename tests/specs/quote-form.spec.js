const { test, expect } = require('@playwright/test');
const { buildTestSubmission } = require('../helpers/constants');

test.describe('Quote request form (UI)', () => {
  test('cannot submit with required fields empty', async ({ page }) => {
    await page.goto('/');
    await page.locator('#presupuesto').scrollIntoViewIfNeeded();

    await page.locator('#quoteForm button[type="submit"]').click();

    const isNameValid = await page.locator('#fname').evaluate((el) => el.checkValidity());
    expect(isNameValid).toBe(false);
  });

  test('cannot submit without accepting the privacy checkbox', async ({ page }) => {
    await page.goto('/');
    const data = buildTestSubmission('consent-check');

    await page.fill('#fname', data.name);
    await page.fill('#fphone', data.phone);
    await page.fill('#fpostal', data.postal);
    await page.locator('#quoteForm button[type="submit"]').click();

    const isConsentValid = await page.locator('#fconsent').evaluate((el) => el.checkValidity());
    expect(isConsentValid).toBe(false);
  });

  test('promo code field is optional', async ({ page }) => {
    await page.goto('/');
    const isRequired = await page.locator('#fpromo').evaluate((el) => el.hasAttribute('required'));
    expect(isRequired).toBe(false);
  });

  test('privacy policy link inside the form points to privacidad.html', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('.form-row-check a');
    await expect(link).toHaveAttribute('href', /privacidad\.html/);
  });

  test('a valid submission shows a success status message', async ({ page }) => {
    await page.goto('/');
    const data = buildTestSubmission('ui-valid-submit');

    await page.fill('#fname', data.name);
    await page.fill('#fphone', data.phone);
    await page.fill('#fpostal', data.postal);
    await page.fill('#fpromo', data.promo);
    await page.check('#fconsent');

    await page.locator('#quoteForm button[type="submit"]').click();

    // The UI request uses mode:"no-cors", so the browser can only ever
    // observe the *attempt*, not the real server-side result — that's
    // verified independently in api-form-submission.spec.js.
    const status = page.locator('#formStatus');
    await expect(status).not.toBeEmpty({ timeout: 10000 });
    await expect(status).toHaveClass(/success/);
  });

  test('the form resets after a successful submission', async ({ page }) => {
    await page.goto('/');
    const data = buildTestSubmission('ui-reset-check');

    await page.fill('#fname', data.name);
    await page.fill('#fphone', data.phone);
    await page.fill('#fpostal', data.postal);
    await page.check('#fconsent');
    await page.locator('#quoteForm button[type="submit"]').click();

    await expect(page.locator('#formStatus')).toHaveClass(/success/, { timeout: 10000 });
    await expect(page.locator('#fname')).toHaveValue('');
  });
});
