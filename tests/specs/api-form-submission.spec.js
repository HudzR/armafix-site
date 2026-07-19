const { test, expect } = require('@playwright/test');
const { FORM_ENDPOINT, buildTestSubmission } = require('../helpers/constants');

/**
 * These tests call the Google Apps Script Web App directly over HTTP,
 * bypassing the browser entirely — so they are NOT subject to the
 * `mode: "no-cors"` restriction used in script.js (that restriction is a
 * browser/CORS concept and doesn't apply to server-to-server requests).
 *
 * This is what actually catches backend problems: a deployment pointing
 * at an old version of the code, a wrong sheet name, a broken Telegram
 * token, etc. The UI form test can only ever confirm "a request was
 * sent" — it can never see whether Google actually accepted it.
 *
 * Run these independently of the UI suite:
 *   npx playwright test api-form-submission
 */
test.describe('Apps Script backend — direct API verification', () => {
  test('accepts a valid submission and returns a success result', async ({ request }) => {
    const payload = {
      ...buildTestSubmission('api-valid'),
      lang: 'es',
      page: 'https://armafix.es/ (api-test)',
      date: new Date().toISOString(),
    };

    const response = await request.post(FORM_ENDPOINT, {
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    });

    expect(response.ok()).toBe(true);

    const body = await response.json();
    expect(body.result, JSON.stringify(body)).toBe('success');
  });

  test('response content-type is JSON', async ({ request }) => {
    const payload = buildTestSubmission('api-content-type');

    const response = await request.post(FORM_ENDPOINT, {
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    });

    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('json');
  });

  test('still responds successfully when the promo code is omitted', async ({ request }) => {
    const payload = buildTestSubmission('api-no-promo');
    delete payload.promo;

    const response = await request.post(FORM_ENDPOINT, {
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    });

    const body = await response.json();
    expect(body.result).toBe('success');
  });

  test('malformed JSON body is handled gracefully (no 500, no crash)', async ({ request }) => {
    const response = await request.post(FORM_ENDPOINT, {
      data: '{ this is not valid JSON',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    });

    // The Apps Script wraps everything in try/catch and always returns
    // 200 with a JSON body — we're asserting it reports the error
    // instead of silently pretending to succeed.
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.result).toBe('error');
    expect(body.message).toBeTruthy();
  });

  test('response time is reasonable (under 10s)', async ({ request }) => {
    const payload = buildTestSubmission('api-perf');
    const start = Date.now();

    await request.post(FORM_ENDPOINT, {
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    });

    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(10000);
  });
});
