import { ref, readonly } from 'vue'
import { useCookies } from './useCookies'

const NSFW_COOKIE_NAME = 'nsfw_enabled'
const AGE_VERIFIED_COOKIE_NAME = 'age_verified'
const COOKIE_EXPIRY_DAYS = 30

export function useNsfwFilter() {
  const { getCookie, setCookie } = useCookies()
  const allowNSFW = ref<boolean>(false)
  const showAgeModal = ref<boolean>(false)

  /**
   * Checks if user has verified their age (18+)
   */
  const isAgeVerified = (): boolean => {
    return getCookie(AGE_VERIFIED_COOKIE_NAME) === 'true'
  }

  /**
   * Initializes NSFW preference from cookies with age verification check
   */
  const initializeNsfwPreference = (): void => {
    const nsfwCookie = getCookie(NSFW_COOKIE_NAME)
    const ageVerified = isAgeVerified()

    if (nsfwCookie === 'true' && ageVerified) {
      // Both cookies are valid - allow NSFW
      allowNSFW.value = true
    }
    else if (nsfwCookie === 'true' && !ageVerified) {
      // User has NSFW cookie but no age verification - disable NSFW and reset cookie
      allowNSFW.value = false
      setCookie(NSFW_COOKIE_NAME, 'false', COOKIE_EXPIRY_DAYS)
    }
    else {
      // NSFW is false or not set - keep it disabled
      allowNSFW.value = false
    }
  }

  /**
   * Handles NSFW toggle - shows age modal if needed
   * Returns true if toggle was successful, false if age verification is needed
   */
  const handleNsfwToggle = (newValue: boolean): boolean => {
    if (newValue && !isAgeVerified()) {
      // User is trying to enable NSFW but hasn't been age verified
      allowNSFW.value = false // Keep it disabled
      showAgeModal.value = true
      return false
    }

    // Save NSFW preference to cookie
    allowNSFW.value = newValue
    setCookie(NSFW_COOKIE_NAME, newValue ? 'true' : 'false', COOKIE_EXPIRY_DAYS)
    return true
  }

  /**
   * Handles age verification confirmation
   */
  const confirmAge = (isOver18: boolean): { success: boolean, message: string } => {
    showAgeModal.value = false

    if (isOver18) {
      // User confirmed they are 18+
      setCookie(AGE_VERIFIED_COOKIE_NAME, 'true', COOKIE_EXPIRY_DAYS)
      allowNSFW.value = true
      setCookie(NSFW_COOKIE_NAME, 'true', COOKIE_EXPIRY_DAYS)

      return {
        success: true,
        message: 'NSFW Content Enabled. You can now view all content types. This preference will be remembered for 30 days.',
      }
    }

    // User said they are under 18
    allowNSFW.value = false
    setCookie(NSFW_COOKIE_NAME, 'false', COOKIE_EXPIRY_DAYS)

    return {
      success: false,
      message: 'NSFW Content Disabled. Only safe content will be shown.',
    }
  }

  /**
   * Validates NSFW setting before critical operations
   * Used as a security check before searches
   */
  const validateNsfwSetting = (): void => {
    if (allowNSFW.value && !isAgeVerified()) {
      // User has NSFW enabled but no age verification - disable and reset
      allowNSFW.value = false
      setCookie(NSFW_COOKIE_NAME, 'false', COOKIE_EXPIRY_DAYS)
    }
  }

  return {
    allowNSFW: readonly(allowNSFW),
    showAgeModal: readonly(showAgeModal),
    isAgeVerified,
    initializeNsfwPreference,
    handleNsfwToggle,
    confirmAge,
    validateNsfwSetting,
    // Expose internal refs for binding to UI components
    _allowNSFWRef: allowNSFW,
    _showAgeModalRef: showAgeModal,
  }
}
