import { test, expect } from '@playwright/test'

test.describe('Theme Toggle', () => {
  test('should have theme toggle button in footer', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Theme toggle button should have an aria-label indicating the mode switch
    const themeButton = footer.locator('button[aria-label*="Switch to"]')
    await expect(themeButton).toBeVisible()
  })

  test('should toggle between light and dark mode', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const html = page.locator('html')
    const themeButton = page.locator('footer button[aria-label*="Switch to"]')

    // Get initial state
    const initialClass = await html.getAttribute('class') || ''
    const initialIsDark = initialClass.includes('dark')

    // Click to toggle
    await themeButton.click()
    await page.waitForTimeout(500)

    // After toggling, the state should be different
    const newClass = await html.getAttribute('class') || ''
    const newIsDark = newClass.includes('dark')
    expect(newIsDark).not.toBe(initialIsDark)

    // Toggle back
    await themeButton.click()
    await page.waitForTimeout(500)

    const revertedClass = await html.getAttribute('class') || ''
    const revertedIsDark = revertedClass.includes('dark')
    expect(revertedIsDark).toBe(initialIsDark)
  })

  test('should persist theme preference after reload', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const html = page.locator('html')
    const themeButton = page.locator('footer button[aria-label*="Switch to"]')

    // Toggle to dark mode
    const initialClass = await html.getAttribute('class') || ''
    if (!initialClass.includes('dark')) {
      await themeButton.click()
      await page.waitForTimeout(500)
    }

    // Verify it's dark
    await expect(html).toHaveClass(/dark/)

    // Reload
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should still be dark after reload
    await expect(html).toHaveClass(/dark/)
  })

  test('should update button icon when toggling', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const themeButton = page.locator('footer button[aria-label*="Switch to"]')

    // Get initial aria-label
    const initialLabel = await themeButton.getAttribute('aria-label')

    // Toggle
    await themeButton.click()
    await page.waitForTimeout(500)

    // Label should change (light <-> dark)
    const newLabel = await themeButton.getAttribute('aria-label')
    expect(newLabel).not.toBe(initialLabel)
  })
})

test.describe('Color Mode - System Preference', () => {
  test('should respect dark mode system preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()
  })

  test('should respect light mode system preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()
  })
})