import { vi } from 'vitest'

// Mock console.warn to avoid noise in tests
vi.spyOn(console, 'warn').mockImplementation(() => {})

// Mock console.error for expected errors
vi.spyOn(console, 'error').mockImplementation(() => {})

// Ensure window object is available
if (typeof window !== 'undefined') {
  // Mock scrollTo
  window.scrollTo = vi.fn()

  // Mock innerWidth/innerHeight for responsive tests
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  })
}
