export default defineAppConfig({
  ui: {
    colors: {
      primary: 'violet',
      neutral: 'slate'
    }
  },
  colorMode: {
    preference: 'system', // Respect system preference by default
    fallback: 'light', // Fallback to light if system preference unavailable
    storageKey: 'nuxt-color-mode'
  }
})
