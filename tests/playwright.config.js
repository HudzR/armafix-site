// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * ArmaFix — Playwright configuration
 *
 * Run against the live site by default. Override with:
 *   BASE_URL=http://127.0.0.1:5500 npx playwright test
 * (useful when testing locally via VS Code Live Server)
 *
 * Locale is pinned to es-ES on all main projects because the site
 * auto-detects the browser language on first visit (see script.js).
 * Without pinning this, tests become flaky depending on the machine's
 * default locale. Browser auto-detection itself is verified separately
 * by the "chromium-en-locale" project below.
 */
module.exports = defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'https://armafix.es/',
    locale: 'es-ES',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], locale: 'es-ES' },
      testIgnore: /browser-language-detection\.spec\.js/,
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'], locale: 'es-ES' },
      testIgnore: [/browser-language-detection\.spec\.js/, /api-form-submission\.spec\.js/],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'], locale: 'es-ES' },
      testIgnore: [/browser-language-detection\.spec\.js/, /api-form-submission\.spec\.js/],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'], locale: 'es-ES' },
      testIgnore: [/browser-language-detection\.spec\.js/, /api-form-submission\.spec\.js/],
    },
    {
      // Dedicated project: verifies the site correctly auto-detects an
      // English browser locale on first visit (no saved preference).
      name: 'chromium-en-locale',
      use: { ...devices['Desktop Chrome'], locale: 'en-US' },
      testMatch: /browser-language-detection\.spec\.js/,
    },
  ],
});
