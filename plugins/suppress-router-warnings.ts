export default defineNuxtPlugin(() => {
  // Production client only; SSR always (matches the old .client/.server pair)
  if (import.meta.client && !import.meta.prod) return

  const originalWarn = console.warn
  console.warn = (...args: unknown[]) => {
    if (String(args[0] ?? '').includes('No match found for location with path')) return
    originalWarn.apply(console, args)
  }
})
