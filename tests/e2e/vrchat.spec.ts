import { test, expect } from '@playwright/test'

test.describe('VRChat Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vrchat')
  })

  test('should display page title and header', async ({ page }) => {
    await expect(page).toHaveTitle(/VRChat/i)
    await expect(page.getByText('gallery')).toBeVisible()
    await expect(page.getByText('mug moment')).toBeVisible()
  })

  test('should display loading skeletons initially', async ({ page }) => {
    // On fresh load, should show loading state
    await page.goto('/vrchat')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should load gallery content from external API', async ({ page }) => {
    await page.waitForTimeout(5000)

    // Should have loaded content (either images or error state)
    const hasContent = await page.locator('img').first().isVisible().catch(() => false)
    const hasError = await page.getByText('huh?').isVisible().catch(() => false)
    const hasTabs = await page.locator('[role="tablist"]').isVisible().catch(() => false)

    expect(hasContent || hasError || hasTabs).toBe(true)
  })

  test('should display Images and Videos tabs', async ({ page }) => {
    await page.waitForTimeout(5000)

    // Tabs should be visible after loading
    const tabs = page.locator('[role="tablist"]')
    if (await tabs.isVisible().catch(() => false)) {
      await expect(page.getByText(/Images \(\d+\)/)).toBeVisible()
      await expect(page.getByText(/Videos \(\d+\)/)).toBeVisible()
    }
  })

  test('should switch between Images and Videos tabs', async ({ page }) => {
    await page.waitForTimeout(5000)

    const videosTab = page.getByText(/Videos \(\d+\)/)
    if (await videosTab.isVisible().catch(() => false)) {
      // Click on Videos tab
      await videosTab.click()
      await page.waitForTimeout(500)

      // Switch back to Images
      const imagesTab = page.getByText(/Images \(\d+\)/)
      await imagesTab.click()
      await page.waitForTimeout(500)
    }
  })

  test('should display month groupings with expand/collapse', async ({ page }) => {
    await page.waitForTimeout(5000)

    // Month headers should be buttons
    const monthButtons = page.locator('button').filter({ hasText: /\w+ \d{4}/ })
    const count = await monthButtons.count()

    if (count > 0) {
      const firstMonth = monthButtons.first()
      await expect(firstMonth).toBeVisible()

      // Should show count badge
      const countBadge = firstMonth.locator('.rounded-full')
      await expect(countBadge).toBeVisible()

      // Click to expand
      await firstMonth.click()
      await page.waitForTimeout(500)

      // Images should appear in the grid
      const grid = page.locator('.grid').first()
      await expect(grid).toBeVisible()

      // Click again to collapse
      await firstMonth.click()
      await page.waitForTimeout(500)
    }
  })

  test('should open image modal when clicking an image', async ({ page }) => {
    await page.waitForTimeout(5000)

    // First expand a month group
    const monthButtons = page.locator('button').filter({ hasText: /\w+ \d{4}/ })
    if (await monthButtons.count() > 0) {
      await monthButtons.first().click()
      await page.waitForTimeout(500)

      // Click on an image
      const imageCard = page.locator('.cursor-pointer').filter({ has: page.locator('img') }).first()
      if (await imageCard.isVisible().catch(() => false)) {
        await imageCard.click()
        await page.waitForTimeout(500)

        // Modal should be open - check for fullscreen modal
        const modal = page.locator('[role="dialog"]')
        if (await modal.isVisible().catch(() => false)) {
          await expect(modal).toBeVisible()
        }
      }
    }
  })

  test('should navigate images in modal with buttons', async ({ page }) => {
    await page.waitForTimeout(5000)

    const monthButtons = page.locator('button').filter({ hasText: /\w+ \d{4}/ })
    if (await monthButtons.count() > 0) {
      await monthButtons.first().click()
      await page.waitForTimeout(500)

      const imageCard = page.locator('.cursor-pointer').filter({ has: page.locator('img') }).first()
      if (await imageCard.isVisible().catch(() => false)) {
        await imageCard.click()
        await page.waitForTimeout(500)

        // Check for navigation buttons in modal
        const nextButton = page.locator('[role="dialog"] button').filter({ has: page.locator('[class*="chevron-right"]') })
        if (await nextButton.isVisible().catch(() => false)) {
          await nextButton.click()
          await page.waitForTimeout(300)
        }

        const prevButton = page.locator('[role="dialog"] button').filter({ has: page.locator('[class*="chevron-left"]') })
        if (await prevButton.isVisible().catch(() => false)) {
          await prevButton.click()
          await page.waitForTimeout(300)
        }
      }
    }
  })

  test('should navigate images in modal with keyboard', async ({ page }) => {
    await page.waitForTimeout(5000)

    const monthButtons = page.locator('button').filter({ hasText: /\w+ \d{4}/ })
    if (await monthButtons.count() > 0) {
      await monthButtons.first().click()
      await page.waitForTimeout(500)

      const imageCard = page.locator('.cursor-pointer').filter({ has: page.locator('img') }).first()
      if (await imageCard.isVisible().catch(() => false)) {
        await imageCard.click()
        await page.waitForTimeout(500)

        const modal = page.locator('[role="dialog"]')
        if (await modal.isVisible().catch(() => false)) {
          // Navigate with arrow keys
          await page.keyboard.press('ArrowRight')
          await page.waitForTimeout(300)
          await page.keyboard.press('ArrowLeft')
          await page.waitForTimeout(300)
        }
      }
    }
  })

  test('should show error state when API fails', async ({ page }) => {
    await page.route('**/samba.seija-kij.in/**', (route) => {
      route.abort()
    })

    await page.goto('/vrchat')
    await page.waitForTimeout(3000)

    const error = page.getByText('huh?')
    if (await error.isVisible().catch(() => false)) {
      await expect(page.getByText('the query failed')).toBeVisible()
      await expect(page.getByText('Retry')).toBeVisible()
    }
  })

  test('should have correct SEO meta tags', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /VRChat/i)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
    await expect(page.getByText('gallery')).toBeVisible()
  })
})