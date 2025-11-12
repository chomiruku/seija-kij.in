export default defineEventHandler(async (_event) => {
  try {
    const response = await $fetch('https://samba.seija-kij.in/public/vrchat/avatars.json')
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