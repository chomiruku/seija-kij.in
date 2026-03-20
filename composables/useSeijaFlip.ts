import { onMounted } from 'vue'
import { useState, useRouter } from '#app'
import { useCookies } from '~/composables/useCookies'

const COOKIE_DAYS = 365

const FLIP_COOKIE = 'seija_flipped'
const MIRROR_COOKIE = 'seija_mirrored'
const INVERT_COOKIE = 'seija_inverted'

const CLASS_FLIPPED = 'seija-flipped'
const CLASS_MIRRORED = 'seija-mirrored'
const CLASS_INVERTED = 'seija-inverted'
const CLASS_TRANSITION = 'seija-flip-transition'

function scrollToBottom() {
  window.scrollTo(0, document.documentElement.scrollHeight)
  const observer = new ResizeObserver(() => {
    window.scrollTo(0, document.documentElement.scrollHeight)
  })
  observer.observe(document.body)
  setTimeout(() => observer.disconnect(), 2000)
}

function playSfx() {
  const audio = new Audio('/se_boon01.wav')
  audio.volume = 0.5
  audio.play().catch(() => {})
}

export function useSeijaFlip() {
  const isFlipped = useState<boolean>('seija-flipped', () => false)
  const isMirrored = useState<boolean>('seija-mirrored', () => false)
  const isInverted = useState<boolean>('seija-inverted', () => false)
  const initialized = useState<boolean>('seija-flip-init', () => false)

  onMounted(() => {
    if (initialized.value) return
    initialized.value = true

    const { getCookie } = useCookies()

    const flipped = getCookie(FLIP_COOKIE) === '1'
    const mirrored = getCookie(MIRROR_COOKIE) === '1'
    const inverted = getCookie(INVERT_COOKIE) === '1'

    isFlipped.value = flipped
    isMirrored.value = mirrored
    isInverted.value = inverted

    if (flipped) document.documentElement.classList.add(CLASS_FLIPPED)
    if (mirrored) document.documentElement.classList.add(CLASS_MIRRORED)
    if (inverted) document.documentElement.classList.add(CLASS_INVERTED)

    requestAnimationFrame(() => {
      document.documentElement.classList.add(CLASS_TRANSITION)
    })

    if (flipped) scrollToBottom()

    const router = useRouter()
    router.afterEach(() => {
      if (isFlipped.value) scrollToBottom()
    })
  })

  function toggle() {
    const { setCookie, deleteCookie } = useCookies()
    playSfx()
    isFlipped.value = !isFlipped.value

    if (isFlipped.value) {
      document.documentElement.classList.add(CLASS_FLIPPED)
      setCookie(FLIP_COOKIE, '1', COOKIE_DAYS)
      scrollToBottom()
    }
    else {
      document.documentElement.classList.remove(CLASS_FLIPPED)
      deleteCookie(FLIP_COOKIE)
      window.scrollTo(0, 0)
    }
  }

  function toggleMirror() {
    const { setCookie, deleteCookie } = useCookies()
    playSfx()
    isMirrored.value = !isMirrored.value

    if (isMirrored.value) {
      document.documentElement.classList.add(CLASS_MIRRORED)
      setCookie(MIRROR_COOKIE, '1', COOKIE_DAYS)
    }
    else {
      document.documentElement.classList.remove(CLASS_MIRRORED)
      deleteCookie(MIRROR_COOKIE)
    }
  }

  function toggleInvert() {
    const { setCookie, deleteCookie } = useCookies()
    playSfx()
    isInverted.value = !isInverted.value

    if (isInverted.value) {
      document.documentElement.classList.add(CLASS_INVERTED)
      setCookie(INVERT_COOKIE, '1', COOKIE_DAYS)
    }
    else {
      document.documentElement.classList.remove(CLASS_INVERTED)
      deleteCookie(INVERT_COOKIE)
    }
  }

  return { isFlipped, isMirrored, isInverted, toggle, toggleMirror, toggleInvert }
}
