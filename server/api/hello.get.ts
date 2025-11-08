// server/api/hello.get.ts
// Simple API endpoint example

export default defineEventHandler(async (event) => {
  return {
    message: 'Hello from Nuxt API!',
    timestamp: new Date().toISOString()
  }
})