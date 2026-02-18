<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-white dark:from-blue-200/10 via-orange-200 dark:via-red-600/10 to-purple-400 dark:to-red-900/10 w-full">
    <!-- Mobile Navbar -->
    <nav class="navbar navbar-arrows fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-700 lg:hidden">
      <svg class="navbar-arrows-bg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <pattern id="arrows-mobile" x="0" y="0" width="600" height="200" patternTransform="rotate(-60) scale(0.25)" patternUnits="userSpaceOnUse">
            <animate attributeName="x" from="0" to="600" dur="30s" repeatCount="indefinite"/>
            <rect width="600" height="200" :fill="arrowColors.background"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" stroke-linejoin="miter" transform="translate(-150,-100)"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" transform="translate(450,-100)"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" transform="translate(-150,100)"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" transform="translate(450,100)"/>
            <polygon points="0,50 150,50 150,0 300,100 150,200 150,150 0,150" :fill="arrowColors.white" :stroke="arrowColors.white" stroke-width="1.5" stroke-linejoin="miter"/>
            <polygon points="0,50 150,50 150,0 300,100 150,200 150,150 0,150" :fill="arrowColors.red" :stroke="arrowColors.red" stroke-width="1.5" stroke-linejoin="miter" transform="translate(300,0)"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.black" :stroke="arrowColors.black" stroke-width="1.5" stroke-linejoin="miter" transform="translate(150,-100)"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.black" :stroke="arrowColors.black" stroke-width="1.5" stroke-linejoin="miter" transform="translate(150,100)"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arrows-mobile)"/>
      </svg>
      <div class="navbar-mobile-blur relative z-10 flex items-stretch justify-between h-14 w-full">
        <NuxtLink to="/" class="relative z-10 flex items-center space-x-2 text-lg navbar-brand px-3">
          <img src="/seijakijin.svg" alt="seija-kij.in" class="w-5 h-5" >
          <span>{{ brand.toUpperCase() }}</span>
        </NuxtLink>

        <div class="relative z-10 flex items-center px-2">
          <UTooltip text="Toggle menu">
            <UButton
                icon="i-lucide-menu"
                variant="ghost"
                color="neutral"
                aria-label="Toggle mobile navigation menu"
                @click="isMobileMenuOpen = !isMobileMenuOpen"
            />
          </UTooltip>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <div
          v-if="isMobileMenuOpen"
          class="fixed top-14 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50"
      >
        <div class="container mx-auto px-4 py-2">
          <NuxtLink
              v-for="item in routes"
              :key="item.route"
              :to="item.route"
              class="block py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              @click="isMobileMenuOpen = false"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Desktop Navbar -->
    <nav class="navbar navbar-arrows fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 dark:border-gray-700 hidden lg:block">
      <svg class="navbar-arrows-bg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <pattern id="arrows-desktop" x="0" y="0" width="600" height="200" patternTransform="rotate(-60) scale(0.25)" patternUnits="userSpaceOnUse">
            <animate attributeName="x" from="0" to="600" dur="30s" repeatCount="indefinite"/>
            <rect width="600" height="200" :fill="arrowColors.background"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" stroke-linejoin="miter" transform="translate(-150,-100)"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" transform="translate(450,-100)"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" transform="translate(-150,100)"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" transform="translate(450,100)"/>
            <polygon points="0,50 150,50 150,0 300,100 150,200 150,150 0,150" :fill="arrowColors.white" :stroke="arrowColors.white" stroke-width="1.5" stroke-linejoin="miter"/>
            <polygon points="0,50 150,50 150,0 300,100 150,200 150,150 0,150" :fill="arrowColors.red" :stroke="arrowColors.red" stroke-width="1.5" stroke-linejoin="miter" transform="translate(300,0)"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.black" :stroke="arrowColors.black" stroke-width="1.5" stroke-linejoin="miter" transform="translate(150,-100)"/>
            <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.black" :stroke="arrowColors.black" stroke-width="1.5" stroke-linejoin="miter" transform="translate(150,100)"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arrows-desktop)"/>
      </svg>
      <div class="relative z-10 flex items-stretch h-full w-full">
        <div class="navbar-blur-zone navbar-brand-fade">
          <NuxtLink to="/" class="relative z-10 flex items-center space-x-2 text-xl navbar-brand px-4">
            <img src="/seijakijin.svg" alt="seija-kij.in" class="w-6 h-6" >
            <span>{{ brand }}</span>
          </NuxtLink>
        </div>

        <div class="navbar-blur-zone navbar-links-fade flex items-stretch ml-auto">
          <NuxtLink
              v-for="item in routes"
              :key="item.route"
              :to="item.route"
              class="relative z-10 font-medium transition-colors px-3 flex items-center"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Spacer for fixed navbar -->
    <div class="h-14 lg:h-16"/>

    <!-- Time Banner -->
    <div class="bg-black text-white py-1 border-b border-red-500">
      <div class="container mx-auto px-4 text-center">
        <ClientOnly>
          <small class="time-banner-text hidden lg:inline">{{ time }}<span v-if="occasionName"> &mdash; {{ occasionName }}</span></small>
          <small class="time-banner-text lg:hidden">{{ timeMobile }}<span v-if="occasionName"> &mdash; {{ occasionName }}</span></small>
          <template #fallback>
            <small class="time-banner-text">Loading time...</small>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 mx-auto w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-red-500 bg-gray-50/80 dark:bg-gray-800/80">
      <div class="px-4 py-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <!-- Theme Toggle -->
          <div class="text-center md:text-left">
            <ClientOnly>
              <UTooltip :text="`Switch to ${isDark ? 'light' : 'dark'} mode`">
                <UButton
                  color="deeppink"
                  class="cursor-pointer text-white"
                  size="xl"
                  :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
                  variant="solid"
                  :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
                  @click="switchTheme"
                />
              </UTooltip>
            </ClientOnly>
          </div>

          <!-- Quote -->
          <div class="text-center">
            <figure
              class="cursor-pointer hover:opacity-80 transition-opacity"
              role="button"
              tabindex="0"
              aria-label="Play audio: We are japanese goblin"
              @click="playAudio"
              @keydown.enter="playAudio"
              @keydown.space.prevent="playAudio"
            >
              <blockquote class="text-sm italic">
                <p>"we are japanese goblin"</p>
                <audio ref="audioRef" preload="none" aria-label="Audio quote">
                  <source src="/liltihjapanesegoblin_01.ogg" type="audio/ogg">
                </audio>
              </blockquote>
              <figcaption class="text-xs text-gray-600 dark:text-gray-400">
                Lilith in the <cite>Home Depot</cite>
              </figcaption>
            </figure>
          </div>

          <!-- Disclaimer -->
          <div class="text-center md:text-right text-sm text-gray-500 dark:text-gray-400">
            For any complaints, we do not care.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const colorMode = useColorMode()
const { colors: arrowColors, occasionName } = useSpecialOccasion()

const brand = 'seija-kij.in'
const isMobileMenuOpen = ref(false)
const audioRef = ref(null)
const time = ref('')
const timeMobile = ref('')
const timer = ref(null)

const routes = [
  { name: 'Home', route: '/' },
  { name: 'MilkBooru', route: '/milkbooru' },
  { name: 'VRChat', route: '/vrchat' },
  { name: 'MIDIs', route: '/midi' },
  { name: 'Links', route: '/links' },
]

const isDark = computed(() => colorMode.value === 'dark')

const switchTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const playAudio = () => {
  if (audioRef.value) {
    audioRef.value.currentTime = 0
    audioRef.value.play().catch(() => {
      // Handle audio play errors silently
    })
  }
}

const updateTime = () => {
  const date = new Date()

  const timeString = date.toLocaleString('en-SG', {
    timeZone: 'Asia/Singapore',
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const shortTimeString = date.toLocaleString('en-SG', {
    timeZone: 'Asia/Singapore',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }) + ' SGT'

  const gmt8 = '+0800'
  time.value = `${timeString} GMT${gmt8} (Singapore Standard Time)`
  timeMobile.value = shortTimeString
}

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

// Close mobile menu when clicking outside
let cleanupFunction = null

onMounted(() => {
  // Initialize time display
  updateTime()

  // Update time every 30 seconds
  timer.value = setInterval(updateTime, 30000)

  if (import.meta.client) {
    const handleClickOutside = (event) => {
      if (!event.target.closest('nav')) {
        isMobileMenuOpen.value = false
      }
    }

    nextTick(() => {
      if (typeof document !== 'undefined') {
        document.addEventListener('click', handleClickOutside)
        
        cleanupFunction = () => {
          document.removeEventListener('click', handleClickOutside)
        }
      }
    })
  }
})

onUnmounted(() => {
  if (cleanupFunction) {
    cleanupFunction()
  }

  // Clean up timer
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style>
@reference "tailwindcss";

@font-face {
  font-family: "Y1Vectura";
  src: url('/assets/fonts/Y1Vectura.otf') format('opentype');
  font-display: swap;
}

@font-face {
  font-family: "Azonix-1VB0";
  src: url('/assets/fonts/Azonix-1VB0.otf') format('opentype');
  font-display: swap;
}

.navbar a[class*="router-link-active"] {
  @apply text-red-500 dark:text-red-400;
}

.navbar a:hover {
  @apply text-red-600 dark:text-red-300;
}

.navbar-brand {
  font-family: "Y1Vectura", monospace;
  text-transform: lowercase;
}

.time-banner-text {
  font-family: "Azonix-1VB0", cursive;
}

.navbar-arrows {
  overflow: hidden;
}

.navbar-arrows-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

/* Navbar blur zones - single blur per group, no seams between links */
.navbar-blur-zone {
  position: relative;
  display: flex;
  align-items: stretch;
  overflow: visible;
}

.navbar-blur-zone::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  backdrop-filter: blur(4px);
  background: rgb(255 255 255 / 0.9);
  z-index: 0;
}

.dark .navbar-blur-zone::before {
  background: rgb(17 24 39 / 0.9);
}

/* Brand: opaque over text, fade out past the right edge */
.navbar-brand-fade::before {
  left: 0;
  right: -3rem;
  mask-image: linear-gradient(to right, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to right, black 70%, transparent);
}

/* Links: opaque over text, fade out past the left edge */
.navbar-links-fade::before {
  left: -3rem;
  right: 0;
  mask-image: linear-gradient(to left, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to left, black 85%, transparent);
}

/* Mobile: uniform blur across entire navbar */
.navbar-mobile-blur {
  backdrop-filter: blur(4px);
  background: rgb(255 255 255 / 0.9);
}

.dark .navbar-mobile-blur {
  background: rgb(17 24 39 / 0.9);
}
</style>