import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /healthy choices made easy/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /shop healthier now/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /our standards/i })).toBeVisible();
  });

  test('should display featured products', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /featured products/i })).toBeVisible();
  });

  test('should navigate to shop page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /shop healthier now/i }).click();
    await expect(page).toHaveURL('/shop');
  });
});
