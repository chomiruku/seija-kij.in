import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNsfwFilter } from '~/composables/useNsfwFilter'
import { mockCookies } from '../utils/testHelpers'

describe('useNsfwFilter', () => {
  let cookies: ReturnType<typeof mockCookies>

  beforeEach(() => {
    cookies = mockCookies()
    vi.clearAllMocks()
  })

  describe('isAgeVerified', () => {
    it('should return false when age verification cookie does not exist', () => {
      const { isAgeVerified } = useNsfwFilter()
      expect(isAgeVerified()).toBe(false)
    })

    it('should return true when age verification cookie is set to true', () => {
      cookies.set({ age_verified: 'true' })
      const { isAgeVerified } = useNsfwFilter()
      expect(isAgeVerified()).toBe(true)
    })

    it('should return false when age verification cookie is set to false', () => {
      cookies.set({ age_verified: 'false' })
      const { isAgeVerified } = useNsfwFilter()
      expect(isAgeVerified()).toBe(false)
    })
  })

  describe('initializeNsfwPreference', () => {
    it('should set allowNSFW to false when no cookies exist', () => {
      const { initializeNsfwPreference, allowNSFW } = useNsfwFilter()
      initializeNsfwPreference()
      expect(allowNSFW.value).toBe(false)
    })

    it('should set allowNSFW to true when both NSFW and age verification cookies are true', () => {
      cookies.set({ nsfw_enabled: 'true', age_verified: 'true' })
      const { initializeNsfwPreference, allowNSFW } = useNsfwFilter()
      initializeNsfwPreference()
      expect(allowNSFW.value).toBe(true)
    })

    it('should disable NSFW when enabled but age not verified', () => {
      cookies.set({ nsfw_enabled: 'true', age_verified: 'false' })
      const { initializeNsfwPreference, allowNSFW } = useNsfwFilter()
      initializeNsfwPreference()
      expect(allowNSFW.value).toBe(false)
    })

    it('should reset NSFW cookie when enabled but age not verified', () => {
      cookies.set({ nsfw_enabled: 'true', age_verified: 'false' })
      const { initializeNsfwPreference } = useNsfwFilter()
      initializeNsfwPreference()

      const cookieStore = cookies.get()
      expect(cookieStore.nsfw_enabled).toBe('false')
    })

    it('should keep NSFW disabled when cookie is false', () => {
      cookies.set({ nsfw_enabled: 'false', age_verified: 'true' })
      const { initializeNsfwPreference, allowNSFW } = useNsfwFilter()
      initializeNsfwPreference()
      expect(allowNSFW.value).toBe(false)
    })
  })

  describe('handleNsfwToggle', () => {
    it('should enable NSFW when user is age verified', () => {
      cookies.set({ age_verified: 'true' })
      const { handleNsfwToggle, allowNSFW } = useNsfwFilter()

      const result = handleNsfwToggle(true)

      expect(result).toBe(true)
      expect(allowNSFW.value).toBe(true)
    })

    it('should disable NSFW when toggled off', () => {
      cookies.set({ age_verified: 'true', nsfw_enabled: 'true' })
      const { initializeNsfwPreference, handleNsfwToggle, allowNSFW } = useNsfwFilter()
      initializeNsfwPreference()

      const result = handleNsfwToggle(false)

      expect(result).toBe(true)
      expect(allowNSFW.value).toBe(false)
    })

    it('should show age modal when trying to enable NSFW without age verification', () => {
      const { handleNsfwToggle, showAgeModal, allowNSFW } = useNsfwFilter()

      const result = handleNsfwToggle(true)

      expect(result).toBe(false)
      expect(showAgeModal.value).toBe(true)
      expect(allowNSFW.value).toBe(false)
    })

    it('should save preference to cookie', () => {
      cookies.set({ age_verified: 'true' })
      const { handleNsfwToggle } = useNsfwFilter()

      handleNsfwToggle(true)

      const cookieStore = cookies.get()
      expect(cookieStore.nsfw_enabled).toBe('true')
    })

    it('should not enable NSFW when age not verified', () => {
      const { handleNsfwToggle, allowNSFW } = useNsfwFilter()

      handleNsfwToggle(true)

      expect(allowNSFW.value).toBe(false)
    })
  })

  describe('confirmAge', () => {
    it('should enable NSFW when user confirms they are 18+', () => {
      const { confirmAge, allowNSFW } = useNsfwFilter()

      const result = confirmAge(true)

      expect(result.success).toBe(true)
      expect(allowNSFW.value).toBe(true)
      expect(result.message).toContain('NSFW Content Enabled')
    })

    it('should set age verification cookie when user confirms 18+', () => {
      const { confirmAge } = useNsfwFilter()

      confirmAge(true)

      const cookieStore = cookies.get()
      expect(cookieStore.age_verified).toBe('true')
    })

    it('should set NSFW cookie when user confirms 18+', () => {
      const { confirmAge } = useNsfwFilter()

      confirmAge(true)

      const cookieStore = cookies.get()
      expect(cookieStore.nsfw_enabled).toBe('true')
    })

    it('should disable NSFW when user says they are under 18', () => {
      const { confirmAge, allowNSFW } = useNsfwFilter()

      const result = confirmAge(false)

      expect(result.success).toBe(false)
      expect(allowNSFW.value).toBe(false)
      expect(result.message).toContain('NSFW Content Disabled')
    })

    it('should set NSFW cookie to false when user is under 18', () => {
      const { confirmAge } = useNsfwFilter()

      confirmAge(false)

      const cookieStore = cookies.get()
      expect(cookieStore.nsfw_enabled).toBe('false')
    })

    it('should close age modal after confirmation', () => {
      const { confirmAge, showAgeModal, _showAgeModalRef } = useNsfwFilter()
      _showAgeModalRef.value = true

      confirmAge(true)

      expect(showAgeModal.value).toBe(false)
    })
  })

  describe('validateNsfwSetting', () => {
    it('should disable NSFW if enabled without age verification', () => {
      const { validateNsfwSetting, allowNSFW, _allowNSFWRef } = useNsfwFilter()
      _allowNSFWRef.value = true // Manually set to enabled

      validateNsfwSetting()

      expect(allowNSFW.value).toBe(false)
    })

    it('should reset NSFW cookie if enabled without age verification', () => {
      const { validateNsfwSetting, _allowNSFWRef } = useNsfwFilter()
      _allowNSFWRef.value = true

      validateNsfwSetting()

      const cookieStore = cookies.get()
      expect(cookieStore.nsfw_enabled).toBe('false')
    })

    it('should not change NSFW if properly verified', () => {
      cookies.set({ age_verified: 'true', nsfw_enabled: 'true' })
      const { initializeNsfwPreference, validateNsfwSetting, allowNSFW } = useNsfwFilter()
      initializeNsfwPreference()

      validateNsfwSetting()

      expect(allowNSFW.value).toBe(true)
    })

    it('should not change disabled NSFW', () => {
      const { validateNsfwSetting, allowNSFW } = useNsfwFilter()

      validateNsfwSetting()

      expect(allowNSFW.value).toBe(false)
    })
  })

  describe('readonly properties', () => {
    it('should expose allowNSFW as readonly ref', () => {
      const { allowNSFW, _allowNSFWRef } = useNsfwFilter()
      expect(allowNSFW).toBeDefined()
      expect(allowNSFW.value).toBe(false)

      // Internal ref can be modified
      _allowNSFWRef.value = true
      // Readonly ref reflects the change
      expect(allowNSFW.value).toBe(true)
    })

    it('should expose showAgeModal as readonly ref', () => {
      const { showAgeModal, _showAgeModalRef } = useNsfwFilter()
      expect(showAgeModal).toBeDefined()
      expect(showAgeModal.value).toBe(false)

      // Internal ref can be modified
      _showAgeModalRef.value = true
      // Readonly ref reflects the change
      expect(showAgeModal.value).toBe(true)
    })
  })
})
