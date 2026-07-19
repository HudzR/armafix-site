/* ==========================================================
   Shared test constants — keep in sync with /script.js
   ========================================================== */

module.exports = {
  WHATSAPP_NUMBER: "34614191396",
  PHONE_DISPLAY: "+34 614 191 396",
  EMAIL: "info@armafix.es",
  FORM_ENDPOINT: "https://script.google.com/macros/s/AKfycbwqXarY1k3AaHqUcqzjjDa6nzULZ7sRN_sypJ7-zDGBC1vbxdsImixel6eqbadn2Zbs/exec",

  // Prefix used on all test-generated form submissions so they're easy
  // to find and delete from the Google Sheet / Telegram chat afterwards.
  TEST_DATA_PREFIX: "QA-TEST",

  /**
   * Builds a uniquely identifiable payload for a quote-form submission,
   * so every test run leaves a traceable, timestamped row instead of
   * generic "Test User" noise in the spreadsheet.
   */
  buildTestSubmission(tag) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    return {
      name: `${module.exports.TEST_DATA_PREFIX} ${tag} ${stamp}`,
      phone: "600000000",
      postal: "29001", // Málaga capital — realistic postal code
      promo: `${module.exports.TEST_DATA_PREFIX}-${tag}`,
    };
  },
};
