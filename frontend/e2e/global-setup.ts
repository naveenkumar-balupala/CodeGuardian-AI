import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const storage = config.projects?.[0]?.outputDir ? `${config.projects[0].outputDir}/.auth.json` : 'e2e/.auth.json';
  // fallback path
  const outPath = 'e2e/.auth.json';

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@codeguardian.ai');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  // wait for navigation to ensure login completed
  try {
    await page.waitForURL('**/dashboard', { timeout: 5000 });
  } catch (e) {
    // ignore — still save storage state
  }
  await page.context().storageState({ path: outPath });
  await browser.close();
}

export default globalSetup;
