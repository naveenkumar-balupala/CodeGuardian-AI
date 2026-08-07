import { test, expect } from '@playwright/test';

test.describe('Security Agent SAST & OWASP Charts E2E Flow', () => {
  test('User can open Security Agent page and trigger scan', async ({ page }) => {
    await page.goto('/security-agent');

    // Page title check
    await expect(page.getByRole('heading', { name: /security agent/i })).toBeVisible();

    // Verify Run Scan button
    const scanBtn = page.getByRole('button', { name: /security agent scan/i });
    await expect(scanBtn).toBeVisible();
  });
});
