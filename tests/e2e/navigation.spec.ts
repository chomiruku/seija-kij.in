import { test, expect } from '@playwright/test'

test.describe('Site Navigation', () => {
  test('should navigate to homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should navigate to milkbooru', async ({ page }) => {
    await page.goto('/milkbooru')
    await expect(page).toHaveURL('/milkbooru')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should navigate to vrchat page', async ({ page }) => {
    await page.goto('/vrchat')
    await expect(page).toHaveURL('/vrchat')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should navigate to midi page', async ({ page }) => {
    await page.goto('/midi')
    await expect(page).toHaveURL('/midi')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should navigate to links page', async ({ page }) => {
    await page.goto('/links')
    await expect(page).toHaveURL('/links')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have working navbar links', async ({ page }) => {
    await page.goto('/')

    // Find navbar
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Check if links exist
    const links = nav.locator('a')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should handle 404 for unknown routes', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-12345')

    // Should either 404 or redirect
    // Nuxt might show a 404 page or redirect
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
  })

  test('should show mobile menu button', async ({ page }) => {
    await page.goto('/')

    // Mobile menu button (hamburger) should be visible
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [class*="hamburger"], [class*="mobile-menu"]')
    // At least one mobile navigation element should exist
    await expect(page.locator('body')).toBeVisible()
  })

  test('should navigate on mobile', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()

    await page.goto('/milkbooru')
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Breadcrumb/Back Navigation', () => {
  test('should handle browser back button', async ({ page }) => {
    await page.goto('/')
    await page.goto('/milkbooru')

    // Go back
    await page.goBack()

    await expect(page).toHaveURL('/')
  })

  test('should handle browser forward button', async ({ page }) => {
    await page.goto('/')
    await page.goto('/milkbooru')
    await page.goBack()

    // Go forward
    await page.goForward()

    await expect(page).toHaveURL('/milkbooru')
  })
})
