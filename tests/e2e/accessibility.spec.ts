import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('should have lang attribute on html element', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', 'en')
  })

  test('should have page title on all pages', async ({ page }) => {
    const pages = ['/', '/milkbooru', '/vrchat', '/midi', '/links']

    for (const path of pages) {
      await page.goto(path)
      const title = await page.title()
      expect(title.length).toBeGreaterThan(0)
    }
  })

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(3000)

    // Check that images have alt attributes
    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt).not.toBeNull()
    }
  })

  test('should have aria-label on interactive elements', async ({ page }) => {
    await page.goto('/')

    // Theme toggle should have aria-label
    const themeButton = page.locator('footer button[aria-label*="Switch to"]')
    await expect(themeButton).toBeVisible()

    // Audio easter egg should have aria-label
    const audioButton = page.locator('figure[aria-label]')
    await expect(audioButton).toBeVisible()
  })

  test('should have proper heading hierarchy on homepage', async ({ page }) => {
    await page.goto('/')

    // Should have h2 and h3 headings
    const h2 = page.locator('h2')
    const h3 = page.locator('h3')

    await expect(h2.first()).toBeVisible()
    expect(await h3.count()).toBeGreaterThan(0)
  })

  test('should have keyboard-accessible navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    // Tab through navigation links
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Some element should be focused
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should have proper link attributes for external links', async ({ page }) => {
    await page.goto('/links')

    const externalLinks = page.locator('a[target="_blank"]')
    const count = await externalLinks.count()

    for (let i = 0; i < count; i++) {
      // All external links should have noopener noreferrer
      await expect(externalLinks.nth(i)).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  test('should have focusable audio easter egg', async ({ page }) => {
    await page.goto('/')

    const audioButton = page.locator('figure[role="button"]')
    await expect(audioButton).toHaveAttribute('tabindex', '0')
    await expect(audioButton).toHaveAttribute('aria-label', 'Play audio: We are japanese goblin')

    // Focus it
    await audioButton.focus()
    await expect(audioButton).toBeFocused()
  })

  test('should have labeled form controls on milkbooru search', async ({ page }) => {
    await page.goto('/milkbooru')

    // Search input should be accessible
    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await expect(searchInput).toBeVisible()
  })

  test('should have labeled form controls on midi search', async ({ page }) => {
    await page.goto('/midi')

    const searchInput = page.getByPlaceholder('Search MIDI files by name...')
    await expect(searchInput).toBeVisible()
  })

  test('mobile menu button should have aria-label', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const menuButton = page.getByLabel('Toggle mobile navigation menu')
    await expect(menuButton).toBeVisible()
  })

  test('audio element should have aria-label', async ({ page }) => {
    await page.goto('/')

    const audio = page.locator('audio[aria-label="Audio quote"]')
    await expect(audio).toHaveCount(1)
  })
})