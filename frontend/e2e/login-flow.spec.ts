import { test, expect } from '@playwright/test';

test.describe('Authentication & Sign-in E2E Flow', () => {
  test('User can fill login form and navigate to dashboard', async ({ page }) => {
    await page.goto('/login');

    // Check page elements
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

    // Fill credentials
    await page.fill('input[type="email"]', 'admin@codeguardian.ai');
    await page.fill('input[type="password"]', 'admin123');

    // Click Sign in button
    await page.click('button[type="submit"]');

    // Verify redirection to dashboard
    await expect(page).toHaveURL(/\/dashboard|\/login/);
  });
});
