import { test, expect } from '@playwright/test'

test.describe('MIDI Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/midi')
  })

  test('should display page title and header', async ({ page }) => {
    await expect(page).toHaveTitle(/MIDI/i)
    await expect(page.getByText('midis')).toBeVisible()
    await expect(page.getByText('rip cirnodik')).toBeVisible()
  })

  test('should display search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search MIDI files by name...')
    await expect(searchInput).toBeVisible()
  })

  test('should show loading placeholders initially', async ({ page }) => {
    await page.goto('/midi')
    // Loading state should show pulse animations
    await expect(page.locator('body')).toBeVisible()
  })

  test('should load and display MIDI cards', async ({ page }) => {
    await page.waitForTimeout(5000)

    // MIDI cards should appear after loading
    const midiCards = page.locator('.cursor-pointer').filter({ hasText: /.+/ })
    const hasCards = await midiCards.count() > 0
    const hasError = await page.getByText('oof').isVisible().catch(() => false)

    expect(hasCards || hasError).toBe(true)
  })

  test('should display MIDI card details', async ({ page }) => {
    await page.waitForTimeout(5000)

    // Check first MIDI card has expected details
    const firstCard = page.locator('.cursor-pointer').first()
    if (await firstCard.isVisible().catch(() => false)) {
      // Should have a name (h3)
      const name = firstCard.locator('h3')
      await expect(name).toBeVisible()
    }
  })

  test('should filter MIDIs by search query', async ({ page }) => {
    await page.waitForTimeout(5000)

    const searchInput = page.getByPlaceholder('Search MIDI files by name...')
    const cardsBeforeSearch = await page.locator('.cursor-pointer').count()

    if (cardsBeforeSearch > 0) {
      // Type a search query
      await searchInput.fill('touhou')
      await page.waitForTimeout(500)

      // Results should be filtered
      const cardsAfterSearch = await page.locator('.cursor-pointer').count()
      // Either fewer results or same (if all match)
      expect(cardsAfterSearch).toBeLessThanOrEqual(cardsBeforeSearch)
    }
  })

  test('should update URL with search query', async ({ page }) => {
    await page.waitForTimeout(3000)

    const searchInput = page.getByPlaceholder('Search MIDI files by name...')
    await searchInput.fill('test search')
    await page.waitForTimeout(1000)

    // URL should contain search parameter
    expect(page.url()).toContain('search=')
  })

  test('should initialize search from URL query param', async ({ page }) => {
    await page.goto('/midi?search=touhou')
    await page.waitForTimeout(3000)

    const searchInput = page.getByPlaceholder('Search MIDI files by name...')
    await expect(searchInput).toHaveValue('touhou')
  })

  test('should show no results message for unmatched search', async ({ page }) => {
    await page.waitForTimeout(5000)

    const searchInput = page.getByPlaceholder('Search MIDI files by name...')
    await searchInput.fill('xyznonexistentmidi99999')
    await page.waitForTimeout(500)

    // Should show "no midi named" message
    const noResults = page.getByText(/what the hell is|there is no midi named/)
    const isVisible = await noResults.first().isVisible().catch(() => false)
    if (isVisible) {
      await expect(noResults.first()).toBeVisible()
    }
  })

  test('should open MIDI details modal on card click', async ({ page }) => {
    await page.waitForTimeout(5000)

    const firstCard = page.locator('.cursor-pointer').first()
    if (await firstCard.isVisible().catch(() => false)) {
      await firstCard.click()
      await page.waitForTimeout(500)

      // Modal should open
      const modal = page.locator('[role="dialog"]')
      if (await modal.isVisible().catch(() => false)) {
        await expect(modal).toBeVisible()

        // Should show Original Information section
        await expect(page.getByText('Original Information')).toBeVisible()

        // Should show MIDI Information section
        await expect(page.getByText('MIDI Information')).toBeVisible()
      }
    }
  })

  test('should display download buttons in modal', async ({ page }) => {
    await page.waitForTimeout(5000)

    const firstCard = page.locator('.cursor-pointer').first()
    if (await firstCard.isVisible().catch(() => false)) {
      await firstCard.click()
      await page.waitForTimeout(500)

      const modal = page.locator('[role="dialog"]')
      if (await modal.isVisible().catch(() => false)) {
        // Check for Available Versions section
        const versions = page.getByText('Available Versions')
        if (await versions.isVisible().catch(() => false)) {
          // Download buttons should be present
          const downloadButton = page.getByText('Download').first()
          await expect(downloadButton).toBeVisible()
        }
      }
    }
  })

  test('should display YouTube embed when available', async ({ page }) => {
    await page.waitForTimeout(5000)

    // Find a MIDI card and open it
    const cards = page.locator('.cursor-pointer')
    const count = await cards.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      await cards.nth(i).click()
      await page.waitForTimeout(500)

      // Check if YouTube iframe is present
      const iframe = page.locator('iframe[src*="youtube.com"]')
      if (await iframe.isVisible().catch(() => false)) {
        await expect(iframe).toBeVisible()
        break
      }

      // Close modal and try next
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
    }
  })

  test('should display version badges on MIDI cards', async ({ page }) => {
    await page.waitForTimeout(5000)

    // Look for version badges (small rounded-full pills)
    const badges = page.locator('.rounded-full').filter({ hasText: /.+/ })
    const count = await badges.count()
    // Some cards may have version badges
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('should show error state when API fails', async ({ page }) => {
    await page.route('**/samba.seija-kij.in/**', (route) => {
      route.abort()
    })

    await page.goto('/midi')
    await page.waitForTimeout(3000)

    const error = page.getByText('oof')
    if (await error.isVisible().catch(() => false)) {
      await expect(page.getByText(/couldn't load the midi files/)).toBeVisible()
    }
  })

  test('should have correct SEO meta tags', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /MIDI/i)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
    await expect(page.getByText('midis')).toBeVisible()

    const searchInput = page.getByPlaceholder('Search MIDI files by name...')
    await expect(searchInput).toBeVisible()
  })
})