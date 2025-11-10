export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate',
      brand: 'brand',
      crimson: 'crimson',
      deeppink: 'deeppink',
      blueviolet: 'blueviolet',
      plum: 'plum',
      royalblue: 'royalblue'
    }
  },
  colorMode: {
    preference: 'system', // Respect system preference by default
    fallback: 'light', // Fallback to light if system preference unavailable
    storageKey: 'nuxt-color-mode'
  }
})
