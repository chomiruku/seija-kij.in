<template>
  <div>
    <div
      class="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 transition-all duration-3000 ease-out"
      :class="search.isSearchFocused.value ? 'pt-0' : 'pt-12'"
    >
      <div class="max-w-8xl mx-auto">
        <!-- Header -->
        <div class="mb-4 text-center">
          <h1
            v-if="!search.shouldHideElements.value"
            class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 via-red-500 to-purple-600 dark:from-pink-300 dark:via-red-300 dark:to-purple-400 bg-clip-text text-transparent pb-3 mb-1 transition-all duration-3000 ease-out overflow-hidden"
            :class="search.isSearchFocused.value ? 'scale-y-0 max-h-0 opacity-0 mt-0 mb-0 pt-0 pb-0' : 'scale-y-100 max-h-32 opacity-100'"
          >
            milkbooru
          </h1>
          <p
            v-if="!search.shouldHideElements.value"
            class="text-lg text-gray-600 dark:text-gray-300 mb-8 transition-all duration-3000 ease-out overflow-hidden"
            :class="search.isSearchFocused.value ? 'scale-y-0 max-h-0 opacity-0 mt-0 mb-0 pt-0 pb-0' : 'scale-y-100 max-h-16 opacity-100'"
          >
            just a booru
          </p>

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
            <USkeleton
              v-for="i in 20"
              :key="`skeleton-${i}`"
              class="h-64"
            />
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="search.hasError.value" class="text-center">
          <UCard class="max-w-md mx-auto">
            <template #header>
              <h1 class="text-4xl font-bold">
                huh?
              </h1>
            </template>
            <div class="space-y-4">
              <nuxt-img
                src="/seijaflustered.png"
                alt="seija-kij.in"
                class="mx-auto h-48 w-auto"
              />
              <h3 class="text-lg font-medium">
                the query failed
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                probably the booru is dead
              </p>
              <UButton
                color="red"
                size="lg"
                @click="search.retryFetch"
              >
                Retry
              </UButton>
            </div>
          </UCard>
        </div>

        <!-- Posts Grid -->
        <template v-else-if="search.posts.value.length && !search.isLoading.value">
          <MilkbooruPostGrid
            :posts="search.posts.value"
            :blacklist-info="postsBlacklistInfo"
          />

          <!-- Pagination -->
          <div v-if="search.pagination.value" class="flex justify-center">
            <UPagination
              :page="search.currentPage.value"
              :total="search.totalPages.value"
              :items-per-page="1"
              :sibling-count="2"
              color="neutral"
              variant="link"
              active-color="deeppink"
              active-variant="solid"
              size="md"
              :disabled="search.isLoading.value"
              @update:page="search.goToPage"
            />
          </div>
        </template>

        <!-- No Results -->
        <div v-else-if="!search.isLoading.value" class="text-center py-12">
          <UCard class="max-w-md mx-auto">
            <div class="space-y-4">
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="w-12 h-12 mx-auto text-gray-400"
              />
              <p class="text-gray-500 dark:text-gray-400">
                No posts found. Try different tags!
              </p>
            </div>
          </UCard>
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
  background: linear-gradient(180deg, #ec4899, #be185d);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #db2777, #9f1239);
}
</style>
