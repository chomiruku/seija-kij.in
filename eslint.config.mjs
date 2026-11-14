// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Local tool state (Remember plugin), not project code
  { ignores: ['.remember/**'] },
)
