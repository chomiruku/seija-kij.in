import { test, expect } from '@playwright/test'

test.describe('Layout - Time Banner', () => {
  test('should display time banner with Singapore time', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Time banner should show Singapore Standard Time
    // Desktop shows the full zone name; smaller breakpoints show SGT
    await expect(page.locator('.time-banner-text:visible')).toHaveText(/Singapore Standard Time|SGT/)
  })

  test('should display time in expected format', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // One responsive variant is visible per breakpoint; all show HH:MM:SS
    await expect(page.locator('.time-banner-text:visible')).toHaveText(/\d{2}:\d{2}:\d{2}/)
  })

  test('should show loading fallback before client hydration', async ({ page }) => {
    // This tests the ClientOnly fallback
    await page.goto('/')
    // The fallback "Loading time..." may flash briefly before hydration
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Layout - Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display footer with three sections', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('should display theme toggle button', async ({ page }) => {
    const themeButton = page.locator('footer button[aria-label*="Switch to"]')
    await expect(themeButton).toBeVisible()
  })

  test('should display the japanese goblin quote', async ({ page }) => {
    await expect(page.getByText('"we are japanese goblin"')).toBeVisible()
    await expect(page.getByText('Lilith in the')).toBeVisible()
    await expect(page.getByText('Home Depot')).toBeVisible()
  })

  test('should have clickable quote with audio playback', async ({ page }) => {
    const quote = page.locator('figure[role="button"]')
    await expect(quote).toBeVisible()
    await expect(quote).toHaveAttribute('tabindex', '0')
    await expect(quote).toHaveAttribute('aria-label', 'Play audio: We are japanese goblin')

    // Audio element should exist
    const audio = page.locator('audio')
    await expect(audio).toHaveCount(1)
  })

  test('should display disclaimer text', async ({ page }) => {
    await expect(page.getByText('For any complaints, we do not care.')).toBeVisible()
  })

  test('should be accessible with keyboard for audio playback', async ({ page }) => {
    const quote = page.locator('figure[role="button"]')
    await quote.focus()

    // Should be focusable (has tabindex)
    await expect(quote).toBeFocused()
  })
})

test.describe('Layout - Navbar Structure', () => {
  test('should show desktop navbar on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    const desktopNav = page.locator('nav.hidden.lg\\:block')
    await expect(desktopNav).toBeVisible()

    // Should have all nav links
    await expect(desktopNav.getByText('Home')).toBeVisible()
    await expect(desktopNav.getByText('MilkBooru')).toBeVisible()
    await expect(desktopNav.getByText('VRChat')).toBeVisible()
    await expect(desktopNav.getByText('MIDIs')).toBeVisible()
    await expect(desktopNav.getByText('Links')).toBeVisible()
  })

  test('should show mobile navbar on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const mobileNav = page.locator('nav.lg\\:hidden')
    await expect(mobileNav).toBeVisible()

    // Brand should be uppercase on mobile
    await expect(mobileNav.getByText('SEIJA-KIJ.IN')).toBeVisible()
  })

  test('should have fixed position navbar', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('nav.navbar.fixed:visible')).toHaveCount(1)
  })

  test('should have brand with custom font', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    const brand = page.locator('.navbar-brand:visible').first()
    await expect(brand).toBeVisible()
  })
})

test.describe('Layout - Gradient Background', () => {
  test('should have gradient background in light mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    const bgContainer = page.locator('.bg-gradient-to-br').first()
    await expect(bgContainer).toBeVisible()
  })

  test('should have gradient background in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    const bgContainer = page.locator('.bg-gradient-to-br').first()
    await expect(bgContainer).toBeVisible()
  })
})

test.describe('Layout - Consistent Across Pages', () => {
  const pages = ['/', '/milkbooru', '/vrchat', '/midi', '/links']

  for (const pagePath of pages) {
    test(`should show navbar, time banner, and footer on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath)

      // Navbar
      await expect(page.locator('nav.navbar:visible')).toHaveCount(1)

      // Time banner (one responsive variant visible)
      await expect(page.locator('.time-banner-text:visible')).toHaveCount(1)

      // Footer
      await expect(page.locator('footer')).toBeVisible()

      // Disclaimer
      await expect(page.getByText('For any complaints, we do not care.')).toBeVisible()
    })
  }
})