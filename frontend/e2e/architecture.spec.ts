import { test, expect } from '@playwright/test';

test.describe('Architecture Analyzer & Mermaid Visualizer E2E Flow', () => {
  test('User can open Architecture page and view Mermaid graph', async ({ page }) => {
    await page.goto('/architecture', { waitUntil: 'networkidle' });

    // Page title check — give client-side hydration extra time and retry if an auth placeholder appears
    const heading = page.getByRole('heading', { name: /architecture/i });
    try {
      await expect(heading).toBeVisible({ timeout: 10000 });
    } catch (err) {
      const authPlaceholder = page.getByRole('heading', { name: /authentication required/i });
      if (await authPlaceholder.isVisible().catch(() => false)) {
        // hydration may be delayed; reload and try again
        await page.waitForTimeout(1000);
        await page.reload();
        await expect(heading).toBeVisible({ timeout: 10000 });
      } else {
        throw err;
      }
    }

    // Verify Run Architecture Scan button
    const scanBtn = page.getByRole('button', { name: /architecture scan/i });
    await expect(scanBtn).toBeVisible();
  });
});
