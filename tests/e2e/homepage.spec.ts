import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Kijin Seija - 鬼人 正邪 | seija-kij.in')
  })

  test('should display navbar and footer', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('should display character info section', async ({ page }) => {
    await expect(page.getByText('鬼人 正邪')).toBeVisible()
    await expect(page.getByText('Species:')).toBeVisible()
    await expect(page.getByText('Amanojaku')).toBeVisible()
    await expect(page.getByText('Ability:')).toBeVisible()
    await expect(page.getByText('Turn over anything')).toBeVisible()
    await expect(page.getByText('First Appearance:')).toBeVisible()
    await expect(page.getByText('Double Dealing Character').first()).toBeVisible()
  })

  test('should display personality section', async ({ page }) => {
    await expect(page.getByText('Personality')).toBeVisible()
    await expect(page.getByText(/Seija always thinks and acts the opposite/)).toBeVisible()
  })

  test('should display abilities and spell cards section', async ({ page }) => {
    await expect(page.getByText('Abilities & Spell Cards')).toBeVisible()
    await expect(page.getByText('Turning Over')).toBeVisible()
    await expect(page.getByText('Physical objects')).toBeVisible()
    await expect(page.getByText('Spell Cards')).toBeVisible()
    await expect(page.getByText('欺符「逆さ撃ち」')).toBeVisible()
  })

  test('should show loading skeleton then quote from API', async ({ page }) => {
    // Quote section should either show a quote or a loading skeleton
    const quoteOrSkeleton = page.locator('blockquote, .animate-pulse').first()
    await expect(quoteOrSkeleton).toBeVisible()

    // Wait for quote to potentially load
    await page.waitForTimeout(3000)

    // After loading, check if a quote appeared (external API may fail)
    const blockquote = page.locator('blockquote')
    const skeletonStillVisible = await page.locator('.animate-pulse').first().isVisible().catch(() => false)

    // Either the quote loaded or the skeleton is still showing (API might be down)
    if (await blockquote.isVisible().catch(() => false)) {
      await expect(page.getByText('Kijin Seija in')).toBeVisible()
    } else {
      expect(skeletonStillVisible).toBe(true)
    }
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

  test('should have scrollable spell cards list', async ({ page }) => {
    const spellCardsList = page.locator('.max-h-64.overflow-y-auto')
    await expect(spellCardsList).toBeVisible()

    // Verify multiple spell cards exist
    const spellCards = spellCardsList.locator('div.flex.items-center')
    const count = await spellCards.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })
})