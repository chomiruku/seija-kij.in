import { test, expect } from '@playwright/test'

test.describe('Site Navigation', () => {
  test('should navigate to all routes via direct URL', async ({ page }) => {
    const routes = [
      { path: '/', titleMatch: /Kijin Seija/ },
      { path: '/milkbooru', titleMatch: /MilkBooru|Seija/i },
      { path: '/vrchat', titleMatch: /VRChat/i },
      { path: '/midi', titleMatch: /MIDI/i },
      { path: '/links', titleMatch: /Links/i },
    ]

    for (const route of routes) {
      await page.goto(route.path)
      await expect(page).toHaveURL(route.path)
      await expect(page).toHaveTitle(route.titleMatch)
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('should navigate via desktop navbar links', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    const nav = page.locator('nav').locator('visible=true')

    // Click through each nav link
    const navItems = [
      { text: 'MilkBooru', url: '/milkbooru' },
      { text: 'VRChat', url: '/vrchat' },
      { text: 'MIDIs', url: '/midi' },
      { text: 'Links', url: '/links' },
      { text: 'Home', url: '/' },
    ]

    for (const item of navItems) {
      await nav.getByText(item.text, { exact: true }).click()
      await expect(page).toHaveURL(item.url)
    }
  })

  test('should highlight active route in navbar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/milkbooru')

    // The active link should have router-link-active class
    const activeLink = page.locator('nav a.router-link-active')
    await expect(activeLink).toBeVisible()
    await expect(activeLink).toHaveText('MilkBooru')
  })

  test('should display brand logo link to home', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/milkbooru')

    // Click the brand/logo to go home
    const brand = page.locator('nav').getByText('seija-kij.in').first()
    await expect(brand).toBeVisible()
    await brand.click()
    await expect(page).toHaveURL('/')
  })

  test('should handle 404 for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page-12345')
    await expect(page.locator('body')).toBeVisible()
    // Nuxt shows an error page for 404
  })

  test('should handle browser back/forward navigation', async ({ page }) => {
    await page.goto('/')
    await page.goto('/milkbooru')
    await page.goto('/vrchat')

    await page.goBack()
    await expect(page).toHaveURL('/milkbooru')

    await page.goBack()
    await expect(page).toHaveURL('/')

    await page.goForward()
    await expect(page).toHaveURL('/milkbooru')

    await page.goForward()
    await expect(page).toHaveURL('/vrchat')
  })
})

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should show hamburger menu button', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.getByLabel('Toggle mobile navigation menu')
    await expect(menuButton).toBeVisible()
  })

  test('should open and close mobile menu', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.getByLabel('Toggle mobile navigation menu')

    // Open menu
    await menuButton.click()

    // Mobile menu should show route links
    const mobileMenu = page.locator('nav .absolute')
    await expect(mobileMenu).toBeVisible()
    await expect(mobileMenu.getByText('Home')).toBeVisible()
    await expect(mobileMenu.getByText('MilkBooru')).toBeVisible()
    await expect(mobileMenu.getByText('VRChat')).toBeVisible()
    await expect(mobileMenu.getByText('MIDIs')).toBeVisible()
    await expect(mobileMenu.getByText('Links')).toBeVisible()

    // Close by clicking the toggle again
    await menuButton.click()
    await expect(mobileMenu).not.toBeVisible()
  })

  test('should close mobile menu on navigation', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.getByLabel('Toggle mobile navigation menu')
    await menuButton.click()

    // Click a link to navigate
    const mobileMenu = page.locator('nav .absolute')
    await mobileMenu.getByText('MilkBooru').click()

    await expect(page).toHaveURL('/milkbooru')
    // Menu should be closed after navigation
    await expect(mobileMenu).not.toBeVisible()
  })

  test('should navigate to all pages from mobile menu', async ({ page }) => {
    const navItems = [
      { text: 'MilkBooru', url: '/milkbooru' },
      { text: 'VRChat', url: '/vrchat' },
      { text: 'MIDIs', url: '/midi' },
      { text: 'Links', url: '/links' },
    ]

    for (const item of navItems) {
      await page.goto('/')
      const menuButton = page.getByLabel('Toggle mobile navigation menu')
      await menuButton.click()
      await page.locator('nav .absolute').getByText(item.text).click()
      await expect(page).toHaveURL(item.url)
    }
  })

  test('should hide desktop navbar and show mobile navbar', async ({ page }) => {
    await page.goto('/')

    // Mobile nav should be visible (lg:hidden)
    const mobileNav = page.locator('nav.lg\\:hidden')
    await expect(mobileNav).toBeVisible()

    // Desktop nav should be hidden (hidden lg:block)
    const desktopNav = page.locator('nav.hidden.lg\\:block')
    await expect(desktopNav).not.toBeVisible()
  })
})
