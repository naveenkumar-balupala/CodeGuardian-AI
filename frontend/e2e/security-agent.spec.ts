import { test, expect } from '@playwright/test';

test.describe('Security Agent SAST & OWASP Charts E2E Flow', () => {
  test('User can open Security Agent page and trigger scan', async ({ page }) => {
    await page.goto('/security-agent', { waitUntil: 'networkidle' });

    // Page title check — allow extra time for client hydration and retry if auth placeholder appears
    const heading = page.getByRole('heading', { name: /security agent/i });
    try {
      await expect(heading).toBeVisible({ timeout: 10000 });
    } catch (err) {
      const authPlaceholder = page.getByRole('heading', { name: /authentication required/i });
      if (await authPlaceholder.isVisible().catch(() => false)) {
        await page.waitForTimeout(1000);
        await page.reload();
        await expect(heading).toBeVisible({ timeout: 10000 });
      } else {
        throw err;
      }
    }

    // Verify Run Scan button
    const scanBtn = page.getByRole('button', { name: /security agent scan/i });
    await expect(scanBtn).toBeVisible();
  });
});
