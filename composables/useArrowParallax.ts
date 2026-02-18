const offsetX = ref(0)
const offsetY = ref(0)
let targetX = 0
let targetY = 0
let consumers = 0
let rafId: number | null = null

const LERP_FACTOR = 0.08

function onMouseMove(event: MouseEvent) {
  targetX = (event.clientX / window.innerWidth - 0.5) * 12
  targetY = (event.clientY / window.innerHeight - 0.5) * 8
}

function tick() {
  offsetX.value += (targetX - offsetX.value) * LERP_FACTOR
  offsetY.value += (targetY - offsetY.value) * LERP_FACTOR
  rafId = requestAnimationFrame(tick)
}

export function useArrowParallax() {
  const style = computed(() => ({
    transform: `translate(${offsetX.value}px, ${offsetY.value}px)`,
  }))

  onMounted(() => {
    if (import.meta.client && consumers++ === 0) {
      document.addEventListener('mousemove', onMouseMove)
      rafId = requestAnimationFrame(tick)
    }
  })

  onUnmounted(() => {
    if (import.meta.client && --consumers === 0) {
      document.removeEventListener('mousemove', onMouseMove)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }
  })

  return { arrowParallaxStyle: style }
}
