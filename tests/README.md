# ArmaFix — Automated Test Suite

End-to-end and API tests for [armafix.es](https://armafix.es) built with
[Playwright](https://playwright.dev).

## What's covered

| Spec file | Covers |
|---|---|
| `page-load.spec.js` | Page load, console errors, SEO basics, broken images |
| `language-toggle.spec.js` | ES/EN switching, persistence, translated content (locale pinned to es-ES) |
| `browser-language-detection.spec.js` | Auto-detection of an English browser locale on first visit (runs under its own `chromium-en-locale` project with `locale: en-US`) |
| `whatsapp-links.spec.js` | All WhatsApp CTAs, tel: and mailto: links |
| `quote-form.spec.js` | UI form validation and submission flow (browser-level) |
| `api-form-submission.spec.js` | **Direct backend verification** — calls the Google Apps Script endpoint over HTTP and checks the real JSON response, bypassing the browser's `no-cors` blind spot |
| `faq-accordion.spec.js` | FAQ open/close behavior, keyboard accessibility |
| `responsive-and-links.spec.js` | Mobile/tablet/desktop layout, external links, legal pages |

## Why there's both a UI form test and an API test

The site submits the quote form using `fetch(..., { mode: "no-cors" })`.
This is a browser restriction: it lets the request go out, but makes the
response **unreadable** to the page's own JavaScript — so the UI always
shows "success", even if Google rejected the request or the deployment is
broken. `quote-form.spec.js` can only confirm the *attempt* happened.

`api-form-submission.spec.js` calls the same Apps Script URL directly
over HTTP (not through a browser page), which isn't subject to CORS at
all, and reads the real JSON response — this is what actually proves
data reached the sheet and Telegram.

## Test data

All form submissions from these tests are tagged with a `QA-TEST` prefix
and a timestamp (see `helpers/constants.js`), so they're easy to find and
delete from the Google Sheet afterwards, e.g.:

```
QA-TEST ui-valid-submit 2026-07-18T15-42-01-123Z
```

## Setup

```bash
cd tests
npm install
npx playwright install
```

## Running the tests

```bash
# Run everything headlessly (against the live site)
npm test

# Run with the interactive UI (great for debugging)
npm run test:ui

# Run with a visible browser window
npm run test:headed

# Run only the API tests (fast, no browser needed)
npx playwright test api-form-submission

# Run only the browser-language auto-detection test
npx playwright test browser-language-detection

# View the HTML report from the last run
npm run report
```

## Testing against a local copy instead of the live site

If you're working on changes locally with VS Code Live Server:

```bash
BASE_URL=http://127.0.0.1:5500 npx playwright test
```

Note: `api-form-submission.spec.js` always hits the real Apps Script URL
regardless of `BASE_URL`, since the Apps Script backend isn't part of the
static site.

## Cleaning up test data

After a full run, delete rows starting with `QA-TEST` from the Google
Sheet, and clear the matching Telegram notifications if desired. There's
no automated cleanup — this is a manual step by design, so nothing can
accidentally delete real customer leads.

## CI note

`page-load.spec.js` through `faq-accordion.spec.js` are safe to run on
every push. `quote-form.spec.js` and `api-form-submission.spec.js`
create real (clearly tagged) rows in the production Google Sheet and
send real Telegram messages on every run — keep that in mind before
wiring this into a CI pipeline that runs on every commit. Consider
running those two specs only on a daily schedule instead of every push.
