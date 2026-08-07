const { chromium } = require('playwright');

(async () => {
  const outPath = 'e2e/.auth.json';
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  const email = process.env.E2E_EMAIL || 'admin@codeguardian.ai';
  const password = process.env.E2E_PASSWORD || 'admin123';

  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(`${baseURL}/login`);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    try {
      await page.waitForURL('**/dashboard', { timeout: 10000 });
    } catch (e) {
      // ignore — still save storage state
    }
    await page.context().storageState({ path: outPath });
    console.log('Saved', outPath);
  } catch (err) {
    console.error('Failed to create auth state:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
