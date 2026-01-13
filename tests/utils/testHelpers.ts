import { vi } from 'vitest'

export class MockStorage implements Storage {
  private store: Record<string, string> = {}

  get length(): number {
    return Object.keys(this.store).length
  }

  getItem(key: string): string | null {
    return this.store[key] || null
  }

  setItem(key: string, value: string): void {
    this.store[key] = value
  }

  removeItem(key: string): void {
    delete this.store[key]
  }

  clear(): void {
    this.store = {}
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store)
    return keys[index] || null
  }
}

export function mockSessionStorage(): MockStorage {
  const storage = new MockStorage()
  Object.defineProperty(global, 'sessionStorage', {
    value: storage,
    writable: true,
  })
  return storage
}

export function mockCookies(initialCookies: Record<string, string> = {}) {
  let cookieStore = { ...initialCookies }

  Object.defineProperty(document, 'cookie', {
    get: vi.fn(() => {
      return Object.entries(cookieStore)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
    }),
    set: vi.fn((cookie: string) => {
      const [pair] = cookie.split(';')
      const [key, value] = pair.split('=')
      if (key && value !== undefined) {
        cookieStore[key] = value
      }
    }),
    configurable: true,
  })

  return {
    get: () => cookieStore,
    set: (cookies: Record<string, string>) => {
      cookieStore = { ...cookies }
    },
    clear: () => {
      cookieStore = {}
    },
  }
}

export function mockWindowScrollTo() {
  global.window.scrollTo = vi.fn()
  global.window.scrollY = 0
}

export function mockWindowDimensions(width: number = 1024, height: number = 768) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
}

export function createMockRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    currentRoute: {
      value: {
        query: {},
        params: {},
        path: '/milkbooru',
      },
    },
  }
}

export function createMockRoute(query: Record<string, string> = {}) {
  return {
    query,
    params: {},
    path: '/milkbooru',
  }
}

export function waitFor(condition: () => boolean, timeout: number = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval)
        resolve()
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval)
        reject(new Error('waitFor timeout'))
      }
    }, 50)
  })
}