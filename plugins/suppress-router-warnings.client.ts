export default defineNuxtPlugin(() => {
  // Only suppress in production
  if (process.env.NODE_ENV === 'production') {
    const originalWarn = console.warn
    console.warn = (...args: any[]) => {
      // Suppress Vue Router "No match found for location" warnings
      const message = args[0]?.toString() || ''
      if (message.includes('No match found for location with path')) {
        return // Suppress this warning
      }
      // Pass through all other warnings
      originalWarn.apply(console, args)
    }
  }
})