import { vi } from 'vitest'
import { ref, type Ref } from 'vue'

export class MockStorage implements Storage {
  private store: Record<string, string> = {}

  get length(): number {
    return Object.keys(this.store).length
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null
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
    return keys[index] ?? null
  }

  // Helper to get all stored items (for testing)
  getAll(): Record<string, string> {
    return { ...this.store }
  }
}

export function mockSessionStorage(): MockStorage {
  const storage = new MockStorage()
  Object.defineProperty(global, 'sessionStorage', {
    value: storage,
    writable: true,
    configurable: true,
  })
  return storage
}

export function mockLocalStorage(): MockStorage {
  const storage = new MockStorage()
  Object.defineProperty(global, 'localStorage', {
    value: storage,
    writable: true,
    configurable: true,
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
        cookieStore[key.trim()] = value
      }
    }),
    configurable: true,
  })

  return {
    get: () => ({ ...cookieStore }),
    set: (cookies: Record<string, string>) => {
      cookieStore = { ...cookies }
    },
    clear: () => {
      cookieStore = {}
    },
    remove: (key: string) => {
      delete cookieStore[key]
    },
  }
}

export function mockWindowScrollTo() {
  const scrollToFn = vi.fn()
  global.window.scrollTo = scrollToFn
  Object.defineProperty(global.window, 'scrollY', {
    value: 0,
    writable: true,
    configurable: true,
  })
  return scrollToFn
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
  const currentRoute = ref({
    query: {} as Record<string, string>,
    params: {} as Record<string, string>,
    path: '/milkbooru',
    fullPath: '/milkbooru',
    name: 'milkbooru',
    hash: '',
  })

  return {
    push: vi.fn((to: string | { query?: Record<string, string> }) => {
      if (typeof to === 'object' && to.query) {
        currentRoute.value.query = to.query
      }
      return Promise.resolve()
    }),
    replace: vi.fn((to: string | { query?: Record<string, string> }) => {
      if (typeof to === 'object' && to.query) {
        currentRoute.value.query = to.query
      }
      return Promise.resolve()
    }),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    currentRoute,
  }
}

export function createMockRoute(query: Record<string, string> = {}, path: string = '/milkbooru') {
  return {
    query,
    params: {},
    path,
    fullPath: path + (Object.keys(query).length > 0 ? '?' + new URLSearchParams(query).toString() : ''),
    name: path.replace('/', '') || 'index',
    hash: '',
  }
}

export function createMockToast() {
  const toasts: Array<{ title: string; description?: string; color?: string }> = []

  return {
    add: vi.fn((toast: { title: string; description?: string; color?: string }) => {
      toasts.push(toast)
    }),
    remove: vi.fn(),
    clear: vi.fn(() => {
      toasts.length = 0
    }),
    getToasts: () => [...toasts],
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

export async function flushPromises(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 0))
}

export function mockFetch<T>(response: T, options: { ok?: boolean; status?: number } = {}) {
  const { ok = true, status = 200 } = options

  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  })
}

export function mockFetchError(error: Error | string) {
  return vi.fn().mockRejectedValue(typeof error === 'string' ? new Error(error) : error)
}

// Helper to create a ref with initial value for testing
export function createTestRef<T>(initialValue: T): Ref<T> {
  return ref(initialValue) as Ref<T>
}

// Helper to mock Date.now() for timestamp testing
export function mockDateNow(timestamp: number) {
  const originalNow = Date.now
  vi.spyOn(Date, 'now').mockReturnValue(timestamp)

  return () => {
    Date.now = originalNow
  }
}

// Helper to advance time in tests
export async function advanceTimersByTime(ms: number) {
  vi.advanceTimersByTime(ms)
  await flushPromises()
}