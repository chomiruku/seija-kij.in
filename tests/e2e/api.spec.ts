import { test, expect } from '@playwright/test'

test.describe('API Endpoints', () => {
  test('health check endpoint should return 200', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.status()).toBe(200)
  })

  test('hello endpoint should return 200', async ({ request }) => {
    const response = await request.get('/api/hello')
    expect(response.status()).toBe(200)
  })

  test('vrchat avatars endpoint should return data', async ({ request }) => {
    const response = await request.get('/api/vrchat/avatars.json')
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toBeDefined()
  })
})

test.describe('Page View Tracking', () => {
  test('track-page-view endpoint should accept POST requests', async ({ request }) => {
    const response = await request.post('/api/track-page-view', {
      data: {
        path: '/test',
        referrer: '',
      },
    })

    // Should return 200 or 204 (success)
    expect([200, 204]).toContain(response.status())
  })
})
