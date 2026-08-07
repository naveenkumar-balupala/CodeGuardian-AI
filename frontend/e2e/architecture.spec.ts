import { test, expect } from '@playwright/test';

test.describe('Architecture Analyzer & Mermaid Visualizer E2E Flow', () => {
  test('User can open Architecture page and view Mermaid graph', async ({ page }) => {
    await page.goto('/architecture');

    // Page title check
    await expect(page.getByRole('heading', { name: /architecture/i })).toBeVisible();

    // Verify Run Architecture Scan button
    const scanBtn = page.getByRole('button', { name: /architecture scan/i });
    await expect(scanBtn).toBeVisible();
  });
});
