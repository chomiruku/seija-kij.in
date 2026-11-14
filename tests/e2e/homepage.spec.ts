import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Kijin Seija - 鬼人 正邪 | seija-kij.in')
  })

  test('should display navbar and footer', async ({ page }) => {
    // Separate mobile and desktop navs; exactly one is visible per viewport
    await expect(page.locator('nav.navbar:visible')).toHaveCount(1)
    await expect(page.locator('footer')).toBeVisible()
  })

  test('should display character info section', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: /鬼人 正邪/ })).toBeVisible()
    await expect(page.getByText('Amanojaku', { exact: true })).toBeVisible()
    await expect(page.getByText('Turn over anything', { exact: true })).toBeVisible()
    await expect(page.getByText('Double Dealing Character', { exact: true })).toBeVisible()
  })

  test('should display personality section', async ({ page }) => {
    await expect(page.getByText('Personality')).toBeVisible()
    await expect(page.getByText(/Seija always thinks and acts the opposite/)).toBeVisible()
  })

  test('should display abilities and spell cards section', async ({ page }) => {
    await expect(page.locator('.ability-name', { hasText: 'Physical Objects' })).toBeVisible()
    await expect(page.locator('.spell-text', { hasText: '欺符「逆さ撃ち」' })).toBeVisible()
  })

  test('should display mood section with image or skeleton', async ({ page }) => {
    await expect(page.getByText('Seija is feeling')).toBeVisible()
    await expect(page.getByText('today.')).toBeVisible()

    // Should show either mood image or loading skeleton
    const moodImage = page.locator('img[alt*="Kijin Seija feeling"]')
    const skeleton = page.locator('.bg-gray-300\\/20.animate-pulse')
    const hasImage = await moodImage.isVisible().catch(() => false)
    const hasSkeleton = await skeleton.first().isVisible().catch(() => false)
    expect(hasImage || hasSkeleton).toBe(true)
  })

  test('should have correct SEO meta tags', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', 'seija-kij.in')

    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', /Holy Damn I Love Kijin Seija/)

    const twitterCard = page.locator('meta[name="twitter:card"]')
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image')
  })

  test('should have responsive grid layout', async ({ page }) => {
    // Desktop: 2 columns
    await page.setViewportSize({ width: 1280, height: 720 })
    const grid = page.locator('.grid.grid-cols-1.lg\\:grid-cols-2').first()
    await expect(grid).toBeVisible()

    // Mobile: stack to 1 column
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(grid).toBeVisible()
  })

  test('should list the spell cards', async ({ page }) => {
    expect(await page.locator('.spell-list .spell-entry').count()).toBeGreaterThanOrEqual(5)
  })
})