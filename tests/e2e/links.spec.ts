import { test, expect } from '@playwright/test'

test.describe('Links Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/links')
  })

  test('should display page title and header', async ({ page }) => {
    await expect(page).toHaveTitle(/Links/i)
    await expect(page.getByRole('heading', { level: 1, name: 'links' })).toBeVisible()
    await expect(page.getByText("you're that guy?")).toBeVisible()
  })

  test('should display all link cards', async ({ page }) => {
    const links = [
      { name: 'Booth', description: 'chomilk store' },
      { name: 'Steam', description: 'steam profile' },
      { name: 'YouTube', description: 'youtube channel' },
      { name: 'Bandcamp', description: 'bandcamp profile' },
      { name: 'Twitter', description: 'twitter profile' },
      { name: 'Old Website', description: 'old website' },
    ]

    for (const link of links) {
      await expect(page.getByText(link.name, { exact: true })).toBeVisible()
      await expect(page.getByText(link.description)).toBeVisible()
    }
  })

  test('should have correct number of link cards', async ({ page }) => {
    const linkCards = page.locator('a[target="_blank"]')
    await expect(linkCards).toHaveCount(6)
  })

  test('all links should open in new tab', async ({ page }) => {
    const linkCards = page.locator('a[target="_blank"]')
    const count = await linkCards.count()

    for (let i = 0; i < count; i++) {
      await expect(linkCards.nth(i)).toHaveAttribute('target', '_blank')
      await expect(linkCards.nth(i)).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  test('should have correct link URLs', async ({ page }) => {
    const expectedLinks = [
      { name: 'Booth', url: 'https://chomilk.booth.pm/' },
      { name: 'Steam', url: 'https://steamcommunity.com/id/whyareyouaspy/' },
      { name: 'YouTube', url: 'https://www.youtube.com/@chomiruku' },
      { name: 'Bandcamp', url: 'https://bandcamp.com/chomilk' },
      { name: 'Twitter', url: 'https://x.com/MintBIRDIE69' },
      { name: 'Old Website', url: 'http://cirnodik.xara.hosting/' },
    ]

    for (const link of expectedLinks) {
      const anchor = page.locator(`a[href="${link.url}"]`)
      await expect(anchor).toBeVisible()
    }
  })

  test('should display icons for each link', async ({ page }) => {
    const linkCards = page.locator('a[target="_blank"]')
    const count = await linkCards.count()

    for (let i = 0; i < count; i++) {
      const icon = linkCards.nth(i).locator('img')
      await expect(icon).toBeVisible()
    }
  })

  test('should have correct SEO meta tags', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /Links/i)

    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', 'my links :)')
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: 'links' })).toBeVisible()

    // All links should still be visible
    const linkCards = page.locator('a[target="_blank"]')
    await expect(linkCards).toHaveCount(6)
  })
})