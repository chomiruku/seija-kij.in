import { test, expect } from '@playwright/test'

test.describe('API Endpoints', () => {
  test('health check endpoint should return 200 with correct shape', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toHaveProperty('status', 'ok')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('uptime')
    expect(typeof data.timestamp).toBe('string')
    expect(typeof data.uptime).toBe('number')
    expect(data.uptime).toBeGreaterThan(0)
  })

  test('hello endpoint should return 200 with greeting', async ({ request }) => {
    const response = await request.get('/api/hello')
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toHaveProperty('message', 'Hello from Nuxt API!')
    expect(data).toHaveProperty('timestamp')
  })

  test('vrchat avatars endpoint should return data', async ({ request }) => {
    const response = await request.get('/api/vrchat/avatars.json')
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toBeDefined()
  })

  test('health check should have consistent uptime on repeated calls', async ({ request }) => {
    const response1 = await request.get('/api/health')
    const data1 = await response1.json()

    // Wait a second
    await new Promise(resolve => setTimeout(resolve, 1000))

    const response2 = await request.get('/api/health')
    const data2 = await response2.json()

    // Uptime should increase
    expect(data2.uptime).toBeGreaterThanOrEqual(data1.uptime)
  })
})

test.describe('Page View Tracking', () => {
  test('track-page-view should accept POST with path and referrer', async ({ request }) => {
    const response = await request.post('/api/track-page-view', {
      data: {
        path: '/test',
        referrer: '',
      },
    })

    expect([200, 204]).toContain(response.status())
  })

  test('track-page-view should accept POST with various paths', async ({ request }) => {
    const paths = ['/', '/milkbooru', '/vrchat', '/midi', '/links']

    for (const path of paths) {
      const response = await request.post('/api/track-page-view', {
        data: { path, referrer: '' },
      })
      expect([200, 204]).toContain(response.status())
    }
  })

  test('track-page-view should handle missing body gracefully', async ({ request }) => {
    const response = await request.post('/api/track-page-view', {
      data: {},
    })

    // Should not crash - either 200 or 400
    expect(response.status()).toBeLessThan(500)
  })
})

test.describe('API Error Handling', () => {
  test('should return 404 for non-existent API routes', async ({ request }) => {
    const response = await request.get('/api/nonexistent')
    // Nuxt should return 404 for undefined API routes
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('health endpoint should only accept GET', async ({ request }) => {
    const response = await request.post('/api/health')
    // Should fail since health is a GET-only endpoint
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('track-page-view should not accept GET', async ({ request }) => {
    const response = await request.get('/api/track-page-view')
    // Should fail since it's a POST-only endpoint
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })
})