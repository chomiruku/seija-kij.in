<template>
  <!-- Mobile Navbar -->
  <nav
    class="navbar navbar-arrows fixed top-0 left-0 right-0 z-50 border-b-2 border-crimson-500 lg:hidden"
    :style="arrowColorVars"
  >
    <ArrowPattern pattern-id="arrows-mobile" :parallax-style="arrowParallaxStyle"/>
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
        class="fixed top-14 left-0 right-0 bg-white dark:bg-gray-900 border-b-2 border-crimson-500 z-50"
    >
      <div class="container mx-auto px-4 py-2">
        <NuxtLink
            v-for="item in routes"
            :key="item.route"
            :to="item.route"
            class="block py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-b border-crimson-500/20 last:border-b-0"
            @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
  </nav>

  <!-- Desktop Navbar -->
  <nav
    class="navbar navbar-arrows fixed top-0 left-0 right-0 z-50 h-16 border-b-2 border-crimson-500 hidden lg:block"
    :style="arrowColorVars"
  >
    <ArrowPattern pattern-id="arrows-desktop" :parallax-style="arrowParallaxStyle"/>
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
            class="relative z-10 font-medium transition-colors px-4 flex items-center clip-chevron text-xs tracking-widest uppercase"
        >
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
  </nav>

  <!-- Spacer for fixed navbar -->
  <div class="h-14 lg:h-16"/>
</template>

<script setup>
const { colorVars: arrowColorVars } = useSpecialOccasion()
const { arrowParallaxStyle } = useArrowParallax()

const brand = 'seija-kij.in'
const isMobileMenuOpen = ref(false)

const routes = [
  { name: 'Home', route: '/' },
  { name: 'MilkBooru', route: '/milkbooru' },
  { name: 'VRChat', route: '/vrchat' },
  { name: 'MIDIs', route: '/midi' },
  { name: 'Links', route: '/links' },
]

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

// Close mobile menu when clicking outside
let cleanupFunction = null

onMounted(() => {
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
})
</script>
