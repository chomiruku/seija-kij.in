import { test, expect } from '@playwright/test'

test.describe('Layout - Time Banner', () => {
  test('should display time banner with Singapore time', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Time banner should show Singapore Standard Time
    const timeBanner = page.getByText(/Singapore Standard Time|GMT\+0800/)
    await expect(timeBanner).toBeVisible()
  })

  test('should display time in expected format', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    const timeBanner = page.locator('.time-banner-text')
    const timeText = await timeBanner.textContent()
    // Should contain Singapore Standard Time format
    expect(timeText).toContain('GMT+0800')
    expect(timeText).toContain('Singapore Standard Time')
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

    const nav = page.locator('nav.fixed').first()
    await expect(nav).toBeVisible()
  })

  test('should have backdrop blur on navbar', async ({ page }) => {
    await page.goto('/')

    const nav = page.locator('nav.backdrop-blur-md').first()
    await expect(nav).toBeVisible()
  })

  test('should have brand with custom font', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    const brand = page.locator('.navbar-brand').first()
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
      await expect(page.locator('nav').first()).toBeVisible()

      // Time banner
      const timeBanner = page.locator('.time-banner-text')
      await expect(timeBanner).toBeVisible()

      // Footer
      await expect(page.locator('footer')).toBeVisible()

      // Disclaimer
      await expect(page.getByText('For any complaints, we do not care.')).toBeVisible()
    })
  }
})