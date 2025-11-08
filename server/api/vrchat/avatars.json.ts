export default defineEventHandler(async (_event) => {
  try {
    const response = await $fetch('https://samba.seija-kij.in/public/vrchat/avatars.json')
    return response
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch avatars data'
    })
  }
})