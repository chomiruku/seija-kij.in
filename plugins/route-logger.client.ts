export default defineNuxtPlugin((nuxtApp) => {
  // Log client-side navigations; initial load is already logged by server middleware
  nuxtApp.$router.afterEach((to, from) => {
    if (from.path === to.path) return

    $fetch('/api/track-page-view', {
      method: 'POST',
      body: { path: to.path, query: to.query, referrer: from.path },
    }).catch((error) => {
      console.warn('Failed to track page view:', error)
    })
  })
})
