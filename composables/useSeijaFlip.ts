import { onMounted } from 'vue'
import { useState } from '#app'
import { useCookies } from '~/composables/useCookies'

const COOKIE_NAME = 'seija_flipped'
const COOKIE_DAYS = 365
const CLASS_FLIPPED = 'seija-flipped'
const CLASS_TRANSITION = 'seija-flip-transition'

export function useSeijaFlip() {
  const isFlipped = useState<boolean>('seija-flipped', () => false)
  const initialized = useState<boolean>('seija-flipped-init', () => false)

  onMounted(() => {
    if (initialized.value) return
    initialized.value = true

    const { getCookie } = useCookies()
    const flipped = getCookie(COOKIE_NAME) === '1'
    isFlipped.value = flipped

    if (flipped) {
      document.documentElement.classList.add(CLASS_FLIPPED)
    }

    requestAnimationFrame(() => {
      document.documentElement.classList.add(CLASS_TRANSITION)
    })
  })

  function toggle() {
    const { setCookie, deleteCookie } = useCookies()
    isFlipped.value = !isFlipped.value

    if (isFlipped.value) {
      document.documentElement.classList.add(CLASS_FLIPPED)
      setCookie(COOKIE_NAME, '1', COOKIE_DAYS)
    }
    else {
      document.documentElement.classList.remove(CLASS_FLIPPED)
      deleteCookie(COOKIE_NAME)
    }
  }

  return { isFlipped, toggle }
}
