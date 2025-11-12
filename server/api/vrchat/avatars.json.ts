export default defineEventHandler(async (_event) => {
  try {
    // In production, fetch from local copyparty instance to avoid Cloudflare blocking
    // In dev, use the public URL
    const url = process.env.NODE_ENV === 'production'
      ? 'http://127.0.0.1:3923/public/vrchat/avatars.json'
      : 'https://samba.seija-kij.in/public/vrchat/avatars.json'
    const response = await $fetch(url)
    return response
  } catch (error: unknown) {
    console.error('[VRChat API] Failed to fetch avatars:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch avatars data',
      message: error?.message || 'Unknown error'
    })
  }
})
