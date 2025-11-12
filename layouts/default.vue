<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-white dark:from-blue-200/10 via-orange-200 dark:via-red-600/10 to-purple-400 dark:to-red-900/10 w-full">
    <!-- Mobile Navbar -->
    <nav class="navbar fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 lg:hidden">
      <div class="px-4 flex items-center justify-between h-14">
        <NuxtLink to="/" class="flex items-center space-x-2 text-lg navbar-brand">
          <img src="/seijakijin.svg" alt="seija-kij.in" class="w-5 h-5" >
          <span>{{ brand.toUpperCase() }}</span>
        </NuxtLink>

        <UTooltip text="Toggle menu">
          <UButton
              icon="i-lucide-menu"
              variant="ghost"
              color="neutral"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
          />
        </UTooltip>
      </div>

      <!-- Mobile Menu Overlay -->
      <div
          v-if="isMobileMenuOpen"
          class="absolute top-14 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
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
    <nav class="navbar fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 hidden lg:block">
      <div class="px-4 flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center space-x-2 text-xl navbar-brand pb-4 pt-4">
          <img src="/seijakijin.svg" alt="seija-kij.in" class="w-6 h-6" >
          <span>{{ brand }}</span>
        </NuxtLink>

        <div class="flex items-center space-x-5">
          <NuxtLink
              v-for="item in routes"
              :key="item.route"
              :to="item.route"
              class="font-medium transition-colors pb-4 pt-4"
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
          <small class="time-banner-text">{{ time }}</small>
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
                <UButton color="deeppink" class="cursor-pointer text-white" size="xl" :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" variant="solid" @click="switchTheme"/>
              </UTooltip>
            </ClientOnly>
          </div>

          <!-- Quote -->
          <div class="text-center">
            <figure class="cursor-pointer hover:opacity-80 transition-opacity" @click="playAudio">
              <blockquote class="text-sm italic">
                <p>"we are japanese goblin"</p>
                <audio ref="audioRef" preload="none">
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

const brand = 'seija-kij.in'
const isMobileMenuOpen = ref(false)
const audioRef = ref(null)
const time = ref('')
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

  const gmt8 = '+0800'
  time.value = `${timeString} GMT${gmt8} (Singapore Standard Time)`
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

  // Update time every second
  timer.value = setInterval(updateTime, 1000)

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
  font-family: "Y1Cybassassin";
  src: url('/assets/fonts/Y1Cybassassin-DoubleLine.otf') format('opentype');
}

@font-face {
  font-family: "Y1CosmicIndustry";
  src: url('/assets/fonts/Y1CosmicIndustry.otf') format('opentype');
}

@font-face {
  font-family: "Y1Rivetron";
  src: url('/assets/fonts/Y1Rivetron.otf') format('opentype');
}

@font-face {
  font-family: "Y1Vectura";
  src: url('/assets/fonts/Y1Vectura.otf') format('opentype');
}

@font-face {
  font-family: "Y1SweetPixel";
  src: url('/assets/fonts/Y1SweetPixel.otf') format('opentype');
}

@font-face {
  font-family: "Azonix-1VB0";
  src: url('/assets/fonts/Azonix-1VB0.otf') format('opentype');
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
</style>