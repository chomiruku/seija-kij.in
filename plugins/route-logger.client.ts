export default defineNuxtPlugin((nuxtApp) => {
  // Get client IP helper (best effort on client side)
  const getClientInfo = () => {
    const userAgent = navigator.userAgent || 'Unknown'
    // Note: Client-side can't reliably get real IP, but we can indicate it's a client-side navigation
    return {
      userAgent,
      timestamp: new Date().toISOString()
    }
  }

  // Log route changes (client-side navigation)
  nuxtApp.$router.afterEach((to, from) => {
    // Skip initial load (already logged by server middleware)
    if (from.path === to.path) return

    const { userAgent, timestamp } = getClientInfo()

    // Send page view to server for logging
    $fetch('/api/track-page-view', {
      method: 'POST',
      body: {
        path: to.path,
        query: to.query,
        referrer: from.path,
        userAgent,
        timestamp
      }
    }).catch((error) => {
      // Silently fail if tracking endpoint is unavailable
      console.warn('Failed to track page view:', error)
    })
  })
})