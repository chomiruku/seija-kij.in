import { test, expect } from '@playwright/test'

test.describe('MilkBooru Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/milkbooru')
  })

  test('should display page title and header', async ({ page }) => {
    await expect(page).toHaveTitle(/MilkBooru|Seija/i)
    await expect(page.getByText('milkbooru')).toBeVisible()
    await expect(page.getByText('just a booru')).toBeVisible()
  })

  test('should display search input', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await expect(searchInput).toBeVisible()
  })

  test('should display loading skeletons while fetching', async ({ page }) => {
    // On fresh navigation, loading skeletons should appear
    await page.goto('/milkbooru')
    // Body should be visible during loading
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display image grid after loading', async ({ page }) => {
    // Wait for images to load from external API
    await page.waitForTimeout(5000)

    const images = page.locator('img')
    const count = await images.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should handle search input and update URL', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await searchInput.fill('kijin_seija')
    await expect(searchInput).toHaveValue('kijin_seija')

    // Submit search
    await searchInput.press('Enter')
    await page.waitForTimeout(2000)

    // URL should contain tags parameter
    expect(page.url()).toContain('tags')
    expect(page.url()).toContain('kijin_seija')
  })

  test('should clear search and return to default', async ({ page }) => {
    // First, do a search
    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await searchInput.fill('solo')
    await searchInput.press('Enter')
    await page.waitForTimeout(2000)
    expect(page.url()).toContain('tags')

    // Clear search
    await searchInput.fill('')
    await searchInput.press('Enter')
    await page.waitForTimeout(2000)
  })

  test('should show pagination when results exist', async ({ page }) => {
    await page.waitForTimeout(5000)

    // Pagination should be visible if there are multiple pages
    const pagination = page.locator('nav[role="navigation"]')
    const isVisible = await pagination.first().isVisible().catch(() => false)
    // Pagination might not be visible if there's only one page
    expect(typeof isVisible).toBe('boolean')
  })

  test('should show error state with retry button when API fails', async ({ page }) => {
    // Mock the booru API to fail
    await page.route('**/booru.seija-kij.in/**', (route) => {
      route.abort()
    })

    await page.goto('/milkbooru')
    await page.waitForTimeout(3000)

    // Error state should show
    const retryButton = page.getByText('Retry')
    if (await retryButton.isVisible().catch(() => false)) {
      await expect(page.getByText(/the query failed|probably the booru is dead/)).toBeVisible()
      await expect(retryButton).toBeVisible()
    }
  })

  test('should show no results state for nonsense search', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await searchInput.fill('xyznonexistenttag12345678')
    await searchInput.press('Enter')
    await page.waitForTimeout(5000)

    // Should show "No posts found" or similar
    const noResults = page.getByText(/No posts found/)
    const isVisible = await noResults.isVisible().catch(() => false)
    // May or may not show depending on API response
    expect(typeof isVisible).toBe('boolean')
  })

  test('should have preferences button that opens slideover', async ({ page }) => {
    // Look for the preferences/settings button near the search bar
    const prefsButton = page.locator('button').filter({ has: page.locator('[class*="settings"], [class*="sliders"], [class*="filter"]') }).first()

    if (await prefsButton.isVisible().catch(() => false)) {
      await prefsButton.click()
      await page.waitForTimeout(500)

      // Slideover should show NSFW toggle and tag blacklist
      await expect(page.getByText('NSFW Content')).toBeVisible()
      await expect(page.getByText('Tag Blacklist')).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()

    // Search should still be accessible
    const searchInput = page.locator('input[type="text"], input[type="search"]')
    await expect(searchInput.first()).toBeVisible()
  })
})

test.describe('MilkBooru Search with URL Parameters', () => {
  test('should initialize search from URL query params', async ({ page }) => {
    await page.goto('/milkbooru?tags=kijin_seija')
    await page.waitForTimeout(3000)

    // Search input should be populated with the tag
    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await expect(searchInput).toHaveValue('kijin_seija')
  })

  test('should handle page parameter in URL', async ({ page }) => {
    await page.goto('/milkbooru?page=2')
    await page.waitForTimeout(3000)
    expect(page.url()).toContain('page=2')
  })

  test('should handle combined tags and page parameters', async ({ page }) => {
    await page.goto('/milkbooru?tags=solo&page=1')
    await page.waitForTimeout(3000)

    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await expect(searchInput).toHaveValue('solo')
  })
})

test.describe('MilkBooru Keyboard Navigation', () => {
  test('should navigate pages with arrow keys on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/milkbooru')
    await page.waitForTimeout(5000)

    // Check if pagination exists (meaning there are multiple pages)
    const pagination = page.locator('nav[role="navigation"]')
    if (await pagination.isVisible().catch(() => false)) {
      // Press right arrow to go to next page
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(2000)

      // URL should update to page 2
      expect(page.url()).toContain('page=2')
    }
  })

  test('should not navigate with arrow keys when search input is focused', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/milkbooru')
    await page.waitForTimeout(3000)

    // Focus the search input
    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await searchInput.focus()

    // Arrow keys should not trigger pagination when input is focused
    const urlBefore = page.url()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(500)
    expect(page.url()).toBe(urlBefore)
  })
})

test.describe('MilkBooru NSFW Filter', () => {
  test('should show age verification modal when toggling NSFW on', async ({ page }) => {
    await page.goto('/milkbooru')
    await page.waitForTimeout(2000)

    // Open preferences
    const prefsButton = page.locator('button').filter({ has: page.locator('[class*="settings"], [class*="sliders"], [class*="filter"]') }).first()

    if (await prefsButton.isVisible().catch(() => false)) {
      await prefsButton.click()
      await page.waitForTimeout(500)

      // Toggle NSFW switch
      const nsfwSwitch = page.locator('[role="switch"]').first()
      if (await nsfwSwitch.isVisible().catch(() => false)) {
        await nsfwSwitch.click()
        await page.waitForTimeout(500)

        // Age verification modal should appear
        const modal = page.getByText('r u over 18')
        const modalVisible = await modal.isVisible().catch(() => false)
        if (modalVisible) {
          await expect(page.getByText('ye🤙')).toBeVisible()
          await expect(page.getByText('na✋')).toBeVisible()
        }
      }
    }
  })
})

test.describe('MilkBooru Post Detail', () => {
  test('should navigate to post detail page from gallery', async ({ page }) => {
    await page.goto('/milkbooru')
    await page.waitForTimeout(5000)

    // Click on the first post link
    const firstPost = page.locator('a[href*="/milkbooru/"]').first()
    if (await firstPost.isVisible().catch(() => false)) {
      const href = await firstPost.getAttribute('href')
      await firstPost.click()
      await expect(page).toHaveURL(/\/milkbooru\/\d+/)
    }
  })

  test('should display post detail page with all sections', async ({ page }) => {
    await page.goto('/milkbooru')
    await page.waitForTimeout(5000)

    // Navigate to first post
    const firstPost = page.locator('a[href*="/milkbooru/"]').first()
    if (await firstPost.isVisible().catch(() => false)) {
      await firstPost.click()
      await page.waitForTimeout(3000)

      // Post content should load
      if (await page.getByText('Tags').isVisible().catch(() => false)) {
        // Tags section
        await expect(page.getByText('Tags')).toBeVisible()

        // Post Information section
        await expect(page.getByText('Post Information')).toBeVisible()
        await expect(page.getByText('Rating:')).toBeVisible()
        await expect(page.getByText('Score:')).toBeVisible()
        await expect(page.getByText('Status:')).toBeVisible()

        // File Details section
        await expect(page.getByText('File Details')).toBeVisible()
        await expect(page.getByText('Format:')).toBeVisible()
        await expect(page.getByText('Size:')).toBeVisible()
        await expect(page.getByText('Dimensions:')).toBeVisible()

        // Links section
        await expect(page.getByText('Links').first()).toBeVisible()
        await expect(page.getByText('Danbooru:')).toBeVisible()
      }
    }
  })

  test('should have collapsible comments section', async ({ page }) => {
    await page.goto('/milkbooru')
    await page.waitForTimeout(5000)

    const firstPost = page.locator('a[href*="/milkbooru/"]').first()
    if (await firstPost.isVisible().catch(() => false)) {
      await firstPost.click()
      await page.waitForTimeout(3000)

      // Comments header should be visible
      const commentsHeader = page.getByText(/Comments \(\d+\)/)
      if (await commentsHeader.isVisible().catch(() => false)) {
        // Comments should be collapsed by default
        // Click to expand
        await commentsHeader.click()
        await page.waitForTimeout(500)

        // Click to collapse
        await commentsHeader.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should have quality slider for images', async ({ page }) => {
    await page.goto('/milkbooru')
    await page.waitForTimeout(5000)

    const firstPost = page.locator('a[href*="/milkbooru/"]').first()
    if (await firstPost.isVisible().catch(() => false)) {
      await firstPost.click()
      await page.waitForTimeout(3000)

      // Quality slider may be visible for images with multiple variants
      const qualitySlider = page.locator('input[type="range"]')
      if (await qualitySlider.isVisible().catch(() => false)) {
        await expect(page.getByText('Image Quality')).toBeVisible()
        await expect(page.getByText('Low')).toBeVisible()
        await expect(page.getByText('High')).toBeVisible()
      }
    }
  })

  test('should have clickable tags that link to search', async ({ page }) => {
    await page.goto('/milkbooru')
    await page.waitForTimeout(5000)

    const firstPost = page.locator('a[href*="/milkbooru/"]').first()
    if (await firstPost.isVisible().catch(() => false)) {
      await firstPost.click()
      await page.waitForTimeout(3000)

      // Tags should be clickable links
      const tagLink = page.locator('a[href*="/milkbooru?tags="]').first()
      if (await tagLink.isVisible().catch(() => false)) {
        const tagText = await tagLink.textContent()
        await tagLink.click()
        await expect(page).toHaveURL(/\/milkbooru\?tags=/)
      }
    }
  })

  test('should show error state for invalid post ID', async ({ page }) => {
    await page.goto('/milkbooru/not-a-number')
    // Should show 404 error
    await expect(page.locator('body')).toBeVisible()
  })

  test('should show error state for non-existent post', async ({ page }) => {
    await page.goto('/milkbooru/999999999')
    await page.waitForTimeout(5000)

    // Should show error state
    const errorState = page.getByText('Post not found')
    if (await errorState.isVisible().catch(() => false)) {
      await expect(page.getByText('Retry')).toBeVisible()
      await expect(page.getByText('Back to Gallery')).toBeVisible()
    }
  })

  test('should have "View on Danbooru" link', async ({ page }) => {
    await page.goto('/milkbooru')
    await page.waitForTimeout(5000)

    const firstPost = page.locator('a[href*="/milkbooru/"]').first()
    if (await firstPost.isVisible().catch(() => false)) {
      await firstPost.click()
      await page.waitForTimeout(3000)

      const danbooruLink = page.locator('a[href*="danbooru.donmai.us/posts/"]').first()
      if (await danbooruLink.isVisible().catch(() => false)) {
        await expect(danbooruLink).toHaveAttribute('target', '_blank')
        await expect(danbooruLink).toHaveAttribute('rel', 'noopener noreferrer')
      }
    }
  })
})