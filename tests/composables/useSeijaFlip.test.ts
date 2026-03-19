import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

// Mock Nuxt auto-imports — useState is imported from '#app' in the composable.
// The alias resolves to .nuxt/ which has no real exports, so we mock the whole module.
vi.mock('#app', () => ({
  useState: vi.fn((key: string, init: () => unknown) => ref(init())),
  useNuxtApp: vi.fn(),
}))

// Mock useCookies composable
const mockSetCookie = vi.fn()
const mockGetCookie = vi.fn(() => null)
const mockDeleteCookie = vi.fn()
vi.mock('~/composables/useCookies', () => ({
  useCookies: () => ({
    setCookie: mockSetCookie,
    getCookie: mockGetCookie,
    deleteCookie: mockDeleteCookie,
  }),
}))

import { useSeijaFlip } from '~/composables/useSeijaFlip'

// Helper: mount a dummy component to trigger onMounted lifecycle
function mountComposable() {
  let result: ReturnType<typeof useSeijaFlip>
  mount(defineComponent({
    setup() {
      result = useSeijaFlip()
      return {}
    },
    template: '<div/>',
  }))
  return result!
}

describe('useSeijaFlip', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.documentElement.className = ''
    // Reset getCookie to return null (no cookie) by default
    mockGetCookie.mockReturnValue(null)
  })

  describe('toggle()', () => {
    it('adds seija-flipped class to <html> when toggled on', () => {
      const { toggle } = useSeijaFlip()
      toggle()
      expect(document.documentElement.classList.contains('seija-flipped')).toBe(true)
    })

    it('removes seija-flipped class from <html> when toggled off', () => {
      const { toggle } = useSeijaFlip()
      toggle() // on
      toggle() // off
      expect(document.documentElement.classList.contains('seija-flipped')).toBe(false)
    })

    it('sets seija_flipped cookie with 365 day expiry when toggling on', () => {
      const { toggle } = useSeijaFlip()
      toggle()
      expect(mockSetCookie).toHaveBeenCalledWith('seija_flipped', '1', 365)
    })

    it('deletes seija_flipped cookie when toggling off', () => {
      const { toggle } = useSeijaFlip()
      toggle() // on
      toggle() // off
      expect(mockDeleteCookie).toHaveBeenCalledWith('seija_flipped')
    })

    it('updates isFlipped ref when toggled', () => {
      const { toggle, isFlipped } = useSeijaFlip()
      expect(isFlipped.value).toBe(false)
      toggle()
      expect(isFlipped.value).toBe(true)
      toggle()
      expect(isFlipped.value).toBe(false)
    })
  })

  describe('onMounted initialization', () => {
    it('applies seija-flipped class on mount when cookie is set', () => {
      mockGetCookie.mockReturnValue('1')
      mountComposable()
      expect(document.documentElement.classList.contains('seija-flipped')).toBe(true)
    })

    it('does not apply seija-flipped class on mount when cookie is absent', () => {
      mockGetCookie.mockReturnValue(null)
      mountComposable()
      expect(document.documentElement.classList.contains('seija-flipped')).toBe(false)
    })

    it('reads the seija_flipped cookie on mount', () => {
      mountComposable()
      expect(mockGetCookie).toHaveBeenCalledWith('seija_flipped')
    })
  })
})
