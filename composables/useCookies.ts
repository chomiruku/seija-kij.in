/**
 * Composable for cookie management
 * Provides utilities for setting and getting cookies
 */
export function useCookies() {
  /**
   * Sets a cookie with the given name, value, and expiration days
   */
  const setCookie = (name: string, value: string, days?: number): void => {
    let cookieString = `${name}=${value};path=/`

    if (days !== undefined) {
      const expires = new Date()
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
      cookieString += `;expires=${expires.toUTCString()}`
    }

    document.cookie = cookieString
  }

  /**
   * Gets a cookie value by name
   * Returns null if cookie doesn't exist
   */
  const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`
    const ca = document.cookie.split(';')

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length)
      }
    }

    return null
  }

  /**
   * Deletes a cookie by name
   */
  const deleteCookie = (name: string): void => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
  }

  return {
    setCookie,
    getCookie,
    deleteCookie,
  }
}
