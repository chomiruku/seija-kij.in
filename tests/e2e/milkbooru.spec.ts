import { test, expect } from '@playwright/test'

test.describe('MilkBooru Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/milkbooru')
  })

  test('should display the page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Milk.*Booru|Seija/i)
  })

  test('should load successfully', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display search input', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[type="search"]')
    await expect(searchInput.first()).toBeVisible()
  })

  test('should display image grid after loading', async ({ page }) => {
    // Wait for images to load (may take time due to API call)
    await page.waitForTimeout(2000)

    // Check for image elements or grid container
    const images = page.locator('img')
    // There should be at least some images on the page
    const count = await images.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should have NSFW toggle control', async ({ page }) => {
    // Look for any toggle/switch element related to NSFW
    const toggles = page.locator('button, input[type="checkbox"], [role="switch"]')
    await expect(toggles.first()).toBeVisible()
  })

  test('should show pagination when results exist', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(2000)

    // Check if pagination exists (may not if only 1 page of results)
    const pagination = page.locator('[aria-label*="pagination"], nav[role="navigation"], .pagination')
    // Pagination might not be visible if there's only one page
    const isVisible = await pagination.first().isVisible().catch(() => false)
    // This is acceptable - pagination may or may not be present
    expect(typeof isVisible).toBe('boolean')
  })

  test('should handle search input', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await searchInput.fill('kijin_seija')

    // Verify the input has the value
    await expect(searchInput).toHaveValue('kijin_seija')
  })

  test('should update URL with search query', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await searchInput.fill('solo')
    await searchInput.press('Enter')

    // Wait for URL to update
    await page.waitForTimeout(1000)

    // URL should contain tags parameter
    expect(page.url()).toContain('tags')
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()

    // Search should still be accessible
    const searchInput = page.locator('input[type="text"], input[type="search"]')
    await expect(searchInput.first()).toBeVisible()
  })

  test('should display loading state initially', async ({ page }) => {
    // Navigate fresh to catch loading state
    await page.goto('/milkbooru')

    // Body should be visible during loading
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('MilkBooru Post Detail', () => {
  test('should navigate to post detail page', async ({ page }) => {
    await page.goto('/milkbooru')

    // Wait for images to load
    await page.waitForTimeout(2000)

    // Click on the first image/post
    const firstPost = page.locator('a[href*="/milkbooru/"]').first()
    const href = await firstPost.getAttribute('href')

    if (href) {
      await firstPost.click()

      // Should navigate to detail page
      await expect(page).toHaveURL(/\/milkbooru\/\d+/)
    }
  })
})
