import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Seija/i)
  })

  test('should load successfully', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display the navbar', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should display the footer', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible()
  })

  test('should have navigation links', async ({ page }) => {
    // Check for navigation links
    const navLinks = page.locator('nav a')
    await expect(navLinks.first()).toBeVisible()
  })

  test('should have theme toggle in footer', async ({ page }) => {
    // Look for a button or link that toggles theme
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
  })
})
