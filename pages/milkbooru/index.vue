<template>
  <div>
    <div
      class="container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-out"
      :class="search.isSearchFocused.value ? 'pt-5 pb-5' : 'pt-12 pb-20'"
    >
      <div class="max-w-8xl mx-auto">
        <!-- Header -->
        <div class="mb-4" :class="search.isSearchFocused.value ? '' : 'mb-8'">
          <div
            v-if="!search.shouldHideElements.value"
            class="transition-all duration-300 ease-out overflow-hidden"
            :class="search.isSearchFocused.value ? 'max-h-0 opacity-0 mb-0' : 'max-h-32 opacity-100 mb-4'"
          >
            <h1 class="navbar-brand text-5xl sm:text-7xl text-crimson-500 leading-none mb-1">
              milkbooru
            </h1>
            <p class="font-mono text-xs text-deeppink-500/70 dark:text-deeppink-400/70 tracking-widest uppercase">
              just a booru
            </p>
          </div>

          <!-- Search Bar -->
          <MilkbooruSearchBar
            v-model="search.searchTags.value"
            :disabled="search.isLoading.value"
            @search="handleSearch"
            @focus="search.handleSearchFocus"
            @open-preferences="showSearchPrefs = true"
          />
        </div>

        <!-- Loading State -->
        <div v-if="search.isLoading.value">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div
              v-for="i in 20"
              :key="`skeleton-${i}`"
              class="bg-gray-200 dark:bg-gray-800 animate-pulse aspect-square"
            />
          </div>
          <p class="font-mono text-xs text-center text-gray-400 dark:text-gray-600 mt-6 tracking-widest">
            loading posts...
          </p>
        </div>

        <!-- Error State -->
        <div v-else-if="search.hasError.value" class="text-center">
          <div class="bg-crimson-500/10 border border-crimson-500/30 p-6 max-w-md mx-auto">
            <h1 class="navbar-brand text-5xl uppercase text-crimson-500 mb-4">
              huh?
            </h1>
            <nuxt-img
              src="/seijaflustered.png"
              alt="seija-kij.in"
              class="mx-auto h-48 w-auto mb-4"
            />
            <p class="font-mono text-xs text-gray-400 dark:text-gray-500 mb-2 tracking-wide">probably the booru is dead</p>
            <button
              class="mt-4 clip-parallelogram font-mono text-xs uppercase tracking-widest px-6 py-3 bg-crimson-500 hover:bg-crimson-400 text-white transition-colors"
              @click="search.retryFetch"
            >
              retry
            </button>
          </div>
        </div>

        <!-- Posts Grid -->
        <template v-else-if="search.posts.value.length && !search.isLoading.value">
          <MilkbooruPostGrid
            :posts="search.posts.value"
            :blacklist-info="postsBlacklistInfo"
          />

          <!-- Pagination -->
          <div v-if="search.pagination.value" class="flex justify-center mt-8">
            <nav class="flex items-center gap-0.5 font-mono text-xs" aria-label="Pagination">
              <button
                class="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-crimson-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed tracking-widest"
                :disabled="search.currentPage.value <= 1 || search.isLoading.value"
                @click="search.goToPage(search.currentPage.value - 1)"
              >← prev</button>

              <template v-for="page in paginationPages" :key="page">
                <span v-if="page === '...'" class="px-2 py-2 text-neutral-600">···</span>
                <button
                  v-else
                  class="px-3 py-2 tracking-widest transition-colors"
                  :class="page === search.currentPage.value
                    ? 'clip-parallelogram bg-crimson-500 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-crimson-400'"
                  :disabled="search.isLoading.value"
                  @click="search.goToPage(page)"
                >{{ page }}</button>
              </template>

              <button
                class="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-crimson-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed tracking-widest"
                :disabled="search.currentPage.value >= search.totalPages.value || search.isLoading.value"
                @click="search.goToPage(search.currentPage.value + 1)"
              >next →</button>
            </nav>
          </div>
        </template>

        <!-- No Results -->
        <div v-else-if="!search.isLoading.value" class="py-12">
          <div class="border border-gray-800 p-6 max-w-sm">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-neutral-600 uppercase tracking-widest text-[10px] font-mono">── QUERY RESULT</span>
              <div class="flex-1 border-t border-neutral-800"/>
              <span class="text-crimson-500/50 text-[10px] font-mono">◈</span>
            </div>
            <p class="font-mono text-xs text-crimson-500/80 tracking-wide mb-1">nothing. absolutely nothing.</p>
            <p class="font-mono text-xs text-neutral-600 tracking-wide">try different tags</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Preferences Slideover -->
    <MilkbooruSearchPreferences
      v-model:open="showSearchPrefs"
      v-model:allow-nsfw="nsfwFilter._allowNSFWRef.value"
      v-model:blacklist-tags="tagManagement.blacklistTags.value"
      @update:allow-nsfw="handleNsfwToggle"
      @update:blacklist-tags="handleBlacklistChange"
    />

    <!-- Age Verification Modal -->
    <MilkbooruAgeVerificationModal
      v-model:open="nsfwFilter._showAgeModalRef.value"
      @confirm="handleAgeConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useMilkBooruSearch } from '~/composables/useMilkBooruSearch'
import { useNsfwFilter } from '~/composables/useNsfwFilter'
import { useTagManagement } from '~/composables/useTagManagement'
import { useMilkBooruCache } from '~/composables/useMilkBooruCache'
import type { BlacklistInfo } from '~/types/booru'

const title = 'MilkBooru'
const description = 'Just a booru'
const route = useRoute()
const toast = useToast()

// Initialize composables
const cache = useMilkBooruCache()
const search = useMilkBooruSearch()
const nsfwFilter = useNsfwFilter()
const tagManagement = useTagManagement()

// Local state
const showSearchPrefs = ref(false)

// Pagination page range with ellipsis
const paginationPages = computed(() => {
  const total = search.totalPages.value
  const current = search.currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = []
  pages.push(1)
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// Computed blacklist info for all posts
const postsBlacklistInfo = computed(() => {
  const info: Record<number, BlacklistInfo> = {}
  for (const post of search.posts.value) {
    info[post.id] = tagManagement.getPostBlacklistInfo(
      post,
      tagManagement.blacklistTags.value
    )
  }
  return info
})

// Handle search
const handleSearch = () => {
  search.handleSearch(
    search.searchTags.value,
    nsfwFilter.allowNSFW.value,
    nsfwFilter.validateNsfwSetting
  )
}

// Handle NSFW toggle
const handleNsfwToggle = (value: boolean) => {
  const success = nsfwFilter.handleNsfwToggle(value)
  if (!success) {
    // Age modal will be shown automatically
    return
  }
}

// Handle age confirmation
const handleAgeConfirm = (isOver18: boolean) => {
  const result = nsfwFilter.confirmAge(isOver18)

  toast.add({
    title: result.success ? 'NSFW Content Enabled' : 'NSFW Content Disabled',
    description: result.message,
    icon: result.success ? 'i-heroicons-check-circle' : 'i-heroicons-shield-check',
    color: result.success ? 'royalblue' : 'crimson',
    timeout: 4000,
  })
}

// Handle blacklist change
const handleBlacklistChange = (value: string) => {
  tagManagement.updateBlacklist(value)
}

// Keyboard navigation for pagination (non-mobile only)
const handleKeydown = (event: KeyboardEvent) => {
  // Check if mobile
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window
  if (isMobile) return

  // Check if user is currently focused on any form element
  const activeElement = document.activeElement
  if (activeElement && (
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.tagName === 'SELECT' ||
    activeElement.tagName === 'BUTTON' ||
    activeElement.isContentEditable ||
    activeElement.getAttribute('contenteditable') === 'true'
  )) {
    return
  }

  // Only handle arrow keys when pagination exists and not loading
  if (!search.pagination.value || search.isLoading.value) return

  if (event.key === 'ArrowLeft' && search.currentPage.value > 1) {
    event.preventDefault()
    search.goToPage(search.currentPage.value - 1)
  }
  else if (event.key === 'ArrowRight' && search.currentPage.value < search.totalPages.value) {
    event.preventDefault()
    search.goToPage(search.currentPage.value + 1)
  }
}

// Watch for route changes (browser back/forward)
watch(() => route.query, (newQuery, oldQuery) => {
  if (oldQuery && (newQuery.tags !== oldQuery.tags || newQuery.page !== oldQuery.page)) {
    search.initializeFromUrl(nsfwFilter.allowNSFW.value)
  }
}, { deep: true })

// Initialize on mount
onMounted(() => {
  // Load cache from sessionStorage
  cache.loadCacheFromStorage()

  // Initialize NSFW preferences
  nsfwFilter.initializeNsfwPreference()

  // Initialize blacklist
  tagManagement.initializeBlacklist()

  // Initialize search from URL
  search.initializeFromUrl(nsfwFilter.allowNSFW.value)

  // Setup keyboard navigation
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Dynamic meta tags based on search state
const isInitialState = computed(() => {
  return !route.query.tags || (route.query.tags === '' && search.searchTags.value === '')
})

const isEmptySearch = computed(() => {
  return route.query.tags === '' || (search.searchTags.value === '' && search.actualSearchTags.value !== 'rating:g kijin_seija')
})

const isNormalSearch = computed(() => {
  return route.query.tags && route.query.tags !== '' && !isInitialState.value
})

const dynamicTitle = computed(() => {
  if (isInitialState.value) {
    return `${title} | seija-kij.in`
  }
  else if (isEmptySearch.value) {
    const count = search.pagination.value?.total_posts || 0
    if (count === 0) return `${title} | seija-kij.in`
    return `All Posts (${count.toLocaleString()}) - ${title} | seija-kij.in`
  }
  else if (isNormalSearch.value) {
    const cleanTags = route.query.tags.toString().replace(/\+/g, ' ').replace(/%2B/g, '+')
    const count = search.pagination.value?.total_posts || 0
    if (count === 0) return `${title} | seija-kij.in`
    return `${cleanTags} (${count.toLocaleString()}) - ${title} | seija-kij.in`
  }
  return `${title} | seija-kij.in`
})

const dynamicDescription = computed(() => {
  if (isInitialState.value) {
    return description
  }
  else if (isEmptySearch.value) {
    const count = search.pagination.value?.total_posts || 0
    if (count === 0) return description
    return `Browse all ${count.toLocaleString()} images on MilkBooru - Just a booru for all your image needs`
  }
  else if (isNormalSearch.value) {
    const cleanTags = route.query.tags.toString().replace(/\+/g, ' ').replace(/%2B/g, '+')
    const count = search.pagination.value?.total_posts || 0
    if (count === 0) return description
    return `Browse ${count.toLocaleString()} images tagged with "${cleanTags}" on MilkBooru - Just a booru for all your image needs`
  }
  return description
})

const dynamicKeywords = computed(() => {
  const baseKeywords = 'booru, danbooru, seija kijin, kijin seija, seija, kijin, seija-kij.in, images, gallery'
  if (isNormalSearch.value) {
    const cleanTags = route.query.tags.toString().replace(/\+/g, ' ').replace(/%2B/g, '+')
    return `${baseKeywords}, ${cleanTags}`
  }
  return baseKeywords
})

const canonicalUrl = computed(() => {
  const baseUrl = 'https://seija-kij.in/milkbooru'
  const urlTags = route.query.tags
  const urlPage = route.query.page

  if (urlTags || (urlPage && urlPage !== '1')) {
    const params = new URLSearchParams()
    if (urlTags) params.append('tags', urlTags.toString())
    if (urlPage && urlPage !== '1') params.append('page', urlPage.toString())
    return `${baseUrl}?${params.toString()}`
  }
  return baseUrl
})

// SEO with dynamic meta tags
useHead({
  title: dynamicTitle,
  meta: [
    { name: 'description', content: dynamicDescription },
    { name: 'keywords', content: dynamicKeywords },
    { name: 'robots', content: 'index, follow' },

    { property: 'og:title', content: dynamicTitle },
    { property: 'og:description', content: dynamicDescription },
    { property: 'og:url', content: canonicalUrl },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: dynamicTitle },
    { name: 'twitter:description', content: dynamicDescription },
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
  htmlAttrs: [
    { lang: 'en' },
  ],
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #ff3342;
}

::-webkit-scrollbar-thumb:hover {
  background: #cc2935;
}
</style>
