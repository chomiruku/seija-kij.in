// Cached 5 min so page views and bot crawls don't each hit copyparty
export default defineCachedEventHandler(async () => {
  try {
    // Production reads local copyparty to avoid Cloudflare blocking; dev uses the public URL
    const url = process.env.NODE_ENV === 'production'
      ? 'http://127.0.0.1:3923/public/vrchat/avatars.json'
      : 'https://samba.seija-kij.in/public/vrchat/avatars.json'
    return await $fetch(url)
  } catch (error: unknown) {
    console.error('[VRChat API] Failed to fetch avatars:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch avatars data',
      message: (error as Error)?.message || 'Unknown error',
    })
  }
}, { maxAge: 300, name: 'vrchat-avatars' })
