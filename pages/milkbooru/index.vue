<template>
  <div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 transition-all duration-3000 ease-out" :class="isSearchFocused ? 'pt-0' : 'pt-12'">
      <div class="max-w-8xl mx-auto">
        <!-- Header -->
        <div class="mb-4 text-center">
          <h1 
            v-if="!shouldHideElements"
            class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 via-red-500 to-purple-600 dark:from-pink-300 dark:via-red-300 dark:to-purple-400 bg-clip-text text-transparent pb-3 mb-1 transition-all duration-3000 ease-out overflow-hidden"
            :class="isSearchFocused ? 'scale-y-0 max-h-0 opacity-0 mt-0 mb-0 pt-0 pb-0' : 'scale-y-100 max-h-32 opacity-100'"
          >
            milkbooru
          </h1>
          <p 
            v-if="!shouldHideElements"
            class="text-lg text-gray-600 dark:text-gray-300 mb-8 transition-all duration-3000 ease-out overflow-hidden"
            :class="isSearchFocused ? 'scale-y-0 max-h-0 opacity-0 mt-0 mb-0 pt-0 pb-0' : 'scale-y-100 max-h-16 opacity-100'"
          >
            just a booru
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-8xl mx-auto mb-0">
            <div class="relative mb-3">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                  v-model="searchTags"
                  type="text"
                  placeholder="Enter tags to search... (e.g., rating:g kijin_seija)"
                  :disabled="isLoading"
                  class="block w-full pl-10 pr-24 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 relative z-0 disabled:opacity-50 disabled:cursor-progress"
                  @keyup.enter="handleSearch"
                  @focus="handleSearchFocus"
              >
              <UTooltip text="Search for posts">
                <UButton
                    :disabled="isLoading"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium disabled:cursor-progress cursor-pointer"
                    color="deeppink"
                    @click="handleSearch"
                >
                  <span v-if="!isLoading">Search</span>
                  <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </UButton>
              </UTooltip>
            </div>

            <div class="flex items-end justify-end">
              <UTooltip text="Configure NSFW settings and tag blacklist">
                <UButton
                    class="text-white"
                    label="Search Preferences"
                    color="deeppink"
                    @click="openSearchPrefs()"
                />
              </UTooltip>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div v-for="i in 20" :key="`skeleton-${i}`" class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 animate-pulse">
              <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"/>
              <div class="p-3">
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"/>
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="text-center">
          <div class="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-6 max-w-md mx-auto">
            <h1 class="text-4xl font-bold mb-6">
              huh?
            </h1>
            <nuxt-img src="/seijaflustered.png" alt="seija-kij.in" class="mx-auto h-48 w-auto mb-2"/>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">the query failed</h3>
            <p class="text-gray-800 dark:text-gray-400 mb-4">probably the booru is dead</p>
            <button
              class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors text-white"
              @click="retryFetch"
            >
              Retry
            </button>
          </div>
        </div>

        <!-- Posts Grid -->
        <template v-else-if="posts.length && !isLoading">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            <NuxtLink
              v-for="(post, index) in posts"
              :key="post.id"
              :to="getPostRoute(post)"
              class="group relative overflow-hidden rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up block"
              :style="`animation-delay: ${index * 50}ms`"
            >
              <div class="aspect-square overflow-hidden rounded-lg relative">
                <nuxt-img
                  :src="getImageUrl(post)"
                  :alt="post.tag_string_artist || 'Booru post'"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  format="webp"
                  :quality="60"
                  :width="300"
                  :height="300"
                  fit="cover"
                />

                <!-- Blacklist overlay -->
                <div
v-if="getPostBlacklistInfo(post).isBlacklisted"
                     class="absolute inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center">
                  <div class="text-center text-white w-full">
                    <p class="text-sm font-extrabold mb-1 text-red-500 bg-black w-full py-1">Blacklisted</p>
                    <p class="text-xs text-red-500 w-full">Contains: {{ getPostBlacklistInfo(post).matchedTag }}</p>
                    <p class="text-xs text-gray-400 mt-1">Click to view</p>
                  </div>
                </div>
              </div>

              <!-- Animation indicator -->
              <div v-if="isAnimated(post)" class="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 z-10">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>

              <!-- Post Info -->
              <div class="p-3">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {{ post.tag_string_artist || 'Unknown artist' }}
                </div>
                <div class="text-xs text-gray-400 dark:text-gray-500">
                  {{ post.image_width }}x{{ post.image_height }}
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Pagination -->
          <div v-if="pagination" class="flex justify-center">
            <UPagination 
              v-model:page="currentPage"
              :total="totalPages"
              :items-per-page="1"
              :sibling-count="2"
              color="neutral"
              variant="link"
              active-color="deeppink"
              active-variant="solid"
              size="md"
              :disabled="isLoading"
              @update:page="handlePageChange"
            />
          </div>
        </template>

        <!-- No Results -->
        <div v-else-if="!isLoading" class="text-center py-12">
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p class="text-gray-500 dark:text-gray-400">No posts found. Try different tags!</p>
          </div>
        </div>
      </div>
    </div>
    <USlideover
        v-model:open="showSearchPrefs"
        title="Milkbooru Search Preferences"
        :close="{
          class: 'text-white',
          color: 'deeppink',
          variant: 'solid',
        }"
    >
      <template #body>
        <div class="space-y-6">
          <div>
            <label class="inline-flex cursor-pointer">
              <span class="me-3 text-sm font-medium text-gray-600 dark:text-gray-300">nsfw</span>
              <USwitch
                  v-model="allowNSFW"
                  color="deeppink"
                  @change="handleNSFWToggle"
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Tag Blacklist
            </label>
            <UTextarea
                v-model="blacklistTags"
              color="error"
              placeholder="Enter tags to blacklist, separated by spaces... (e.g., gore blood violence)"
              :rows="4"
              class="w-full"
              @input="handleBlacklistChange"
              @keyup="handleBlacklistChange"
              @blur="handleBlacklistChange"
              @keydown.enter.prevent
            />
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Posts containing any of these tags will be shown with an overlay. Click to view the post.
            </p>
          </div>
        </div>
      </template>
    </USlideover>
    <UModal
        v-model:open="showAgeModal"
        title="r u over 18"
        description="pinky promise u r over 18 and not at work to look at spicy images"
        :close="{color: 'deeppink', variant:'solid', onClick: () => confirmAge(false) }"
        :ui="{
        content: ''
      }"
    >
      <template #body>
        <div class="flex gap-3 justify-center">
          <UTooltip text="I'm under 18">
            <UButton
                class=""
                color="neutral"
                @click="confirmAge(false)"
            >
              na✋
            </UButton>
          </UTooltip>
          <UTooltip text="I'm 18 or older">
            <UButton
                class=""
                color="deeppink"
                @click="confirmAge(true)"
            >
              ye🤙
            </UButton>
          </UTooltip>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
const title = 'MilkBooru'
const description = 'Just a booru'
const route = useRoute()
const router = useRouter()

// State
const posts = ref([])
const pagination = ref(null)
const isLoading = ref(false)
const _toast = useToast()
const maxPages = 1000
const totalPages = ref(0)
const hasError = ref(false)
const searchTags = ref('') // Start with empty search bar
const currentPage = ref(1)
const actualSearchTags = ref('rating:g kijin_seija') // The actual tags being used for search
const allowNSFW = ref(false) // NSFW toggle - off by default
const showAgeModal = ref(false) // Age verification modal state
const isSearchFocused = ref(false) // Search bar focus state
const hasEverFocused = ref(false) // Track if user has ever focused on search
const shouldHideElements = ref(false) // Control when to remove elements from DOM
const paginationToastShown = ref(false) // Track if pagination toast has been shown for current search

// Search results cache - stores results by cache key using sessionStorage
const searchCache = ref(new Map())
const maxCacheSize = 50 // Maximum number of cached search results
const CACHE_KEY = 'milkbooru_search_cache'

const showSearchPrefs = ref(false);
const blacklistTags = ref('');

// Open MIDI details modal
const openSearchPrefs = () => {
  showSearchPrefs.value = true;
};

// Update URL with current search parameters
const updateUrl = (tags, page) => {
  const query = {}
  
  // Only add tags to URL if it's not the default and not empty
  if (tags && tags !== 'rating:g kijin_seija' && tags !== '') {
    // Encode like Danbooru: first encode actual + signs to %2B, then replace spaces with +
    query.tags = tags.replace(/\+/g, '%2B').replace(/\s+/g, '+')
  }
  
  // Only add page to URL if it's not page 1
  if (page && page > 1) {
    query.page = page.toString()
  }
  
  router.push({ query })
}

// Cache utility functions with sessionStorage persistence
const getCacheKey = (tags, page) => {
  return `${tags || 'default'}-${page}`
}

const loadCacheFromStorage = () => {
  try {
    const stored = sessionStorage.getItem(CACHE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert back to Map and populate searchCache
      Object.entries(parsed).forEach(([key, value]) => {
        searchCache.value.set(key, value)
      })
    }
  } catch (error) {
    console.warn('Failed to load cache from sessionStorage:', error)
  }
}

const saveCacheToStorage = () => {
  try {
    // Convert Map to plain object for JSON serialization
    const cacheObj = Object.fromEntries(searchCache.value)
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj))
  } catch (error) {
    console.warn('Failed to save cache to sessionStorage:', error)
  }
}

const getCachedResult = (tags, page) => {
  const key = getCacheKey(tags, page)
  return searchCache.value.get(key)
}

const setCachedResult = (tags, page, data) => {
  const key = getCacheKey(tags, page)
  
  // Implement LRU cache by removing oldest entries
  if (searchCache.value.size >= maxCacheSize) {
    const firstKey = searchCache.value.keys().next().value
    searchCache.value.delete(firstKey)
  }
  
  searchCache.value.set(key, {
    posts: [...data.posts], // Deep copy to prevent mutations
    pagination: { ...data.pagination }, // Deep copy pagination
    timestamp: Date.now()
  })
  
  // Save to sessionStorage
  saveCacheToStorage()
}

// Fetch posts from API with caching
const fetchPosts = async (tags = 'rating:g kijin_seija', page = 1, updateUrlFlag = true, useCache = true) => {
  // Check cache first (only if navigating back/forward)
  if (useCache) {
    const cachedResult = getCachedResult(tags, page)
    if (cachedResult) {
      // Use cached data instantly without loading state
      posts.value = cachedResult.posts
      pagination.value = cachedResult.pagination
      
      // Apply 1000 page limit
      if (pagination.value && (pagination.value.total_pages > maxPages || pagination.value.total_pages === 1000)) {
        pagination.value.total_pages = maxPages
      }
      
      totalPages.value = pagination.value.total_pages
      currentPage.value = page
      hasError.value = false
      
      if (updateUrlFlag) {
        updateUrl(tags, page)
      }
      return
    }
  }

  isLoading.value = true
  hasError.value = false

  try {
    const response = await $fetch('https://booru.seija-kij.in/api/booru/posts', {
      params: {
        tags: tags,
        page: page,
        limit: 20
      }
    })

    const responseData = {
      posts: response.posts || [],
      pagination: response.pagination || null
    }

    posts.value = responseData.posts
    pagination.value = responseData.pagination
    
    // Cache the results
    setCachedResult(tags, page, responseData)
    
    // Apply 1000 page limit and show toast if needed (only once per search)
    if (pagination.value && (pagination.value.total_pages > maxPages || pagination.value.total_pages === 1000)) {
      const originalTotalPages = pagination.value.total_pages
      pagination.value.total_pages = maxPages
      
      // Show toast about pagination limit only if we haven't shown it yet for this search
      if (!paginationToastShown.value) {
        useToast().add({
          title: 'Pagination Limited',
          description: originalTotalPages === 1000 ? `Showing first ${maxPages} pages. Use tags to narrow down your search for better results.` : `Showing first ${maxPages} pages of ${originalTotalPages} total pages. Use tags to narrow down your search for better results.`,
          icon: 'i-heroicons-information-circle',
          color: 'deeppink',
          duration: 8000
        })
        paginationToastShown.value = true
      }
    }

    totalPages.value = pagination.value.total_pages

    currentPage.value = page
    
    if (updateUrlFlag) {
      updateUrl(tags, page)
    }
    
    // Show keyboard navigation toast after successful search (only for new searches, not cached ones)
    if (page === 1 && posts.value.length > 0 && pagination.value && totalPages.value > 1) {
      // Use nextTick to ensure the toast shows after the UI has updated
      nextTick(() => {
        showKeyboardNavigationToast()
      })
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    hasError.value = true
    posts.value = []
    pagination.value = null
  } finally {
    isLoading.value = false
  }
}

// Initialize from URL query parameters and restore preferences
const initializeFromUrl = () => {
  // Validate NSFW preference with age verification
  const nsfwCookie = getCookie('nsfw_enabled')
  const ageVerified = isAgeVerified()

  if (nsfwCookie === 'true' && ageVerified) {
    // Both cookies are valid - allow NSFW
    allowNSFW.value = true
  } else if (nsfwCookie === 'true' && !ageVerified) {
    // User has NSFW cookie but no age verification - disable NSFW and reset cookie
    allowNSFW.value = false
    setCookie('nsfw_enabled', 'false', 30)
  } else {
    // NSFW is false or not set - keep it disabled
    allowNSFW.value = false
  }

  // Load blacklist preferences from cookie
  const blacklistCookie = getCookie('tag_blacklist')
  if (blacklistCookie !== null) {
    // Cookie exists (even if empty) - user has interacted with blacklist before
    blacklistTags.value = decodeURIComponent(blacklistCookie)
  } else {
    // No cookie exists - new user, set default blacklist tags
    const defaultBlacklistTags = 'guro scat furry pee loli shota fart vomit ryona blood'
    blacklistTags.value = defaultBlacklistTags
    // Set cookie so we know user has seen the blacklist feature (no expiration)
    setCookie('tag_blacklist', encodeURIComponent(defaultBlacklistTags))
  }
  
  // Check if user has previously seen the header collapse behavior
  const headerSeenCookie = getCookie('milkbooru-header-seen')
  const urlTags = route.query.tags
  const urlPage = route.query.page
  
  // Apply header collapse logic based on your requirements:
  if (headerSeenCookie === 'true') {
    // User has seen the header behavior before (within 1 day), hide header immediately
    isSearchFocused.value = true
    hasEverFocused.value = true
  } else if (urlTags && typeof urlTags === 'string') {
    // User came from a share link with tags - don't collapse header
    // This is their first time or cookie expired, so let them see the full header
    isSearchFocused.value = false
    hasEverFocused.value = false
  } else {
    // First time visitor with no share link - don't collapse header
    isSearchFocused.value = false
    hasEverFocused.value = false
  }
  
  if (urlTags && typeof urlTags === 'string') {
    // Convert URL tags format back to normal format and show in search bar
    // Reverse Danbooru encoding: replace + with spaces, then decode %2B back to +
    const tagsFromUrl = urlTags.replace(/\+/g, ' ').replace(/%2B/g, '+')
    searchTags.value = tagsFromUrl
    // Apply NSFW filtering to URL tags before using them
    actualSearchTags.value = sanitizeTags(tagsFromUrl)
  } else {
    // First visit with no URL parameters - use default search but keep search bar empty
    searchTags.value = ''
    actualSearchTags.value = 'rating:g kijin_seija'
  }
  
  const page = urlPage ? parseInt(urlPage.toString()) : 1
  currentPage.value = page
  
  // Fetch without updating URL since we're initializing from URL
  fetchPosts(actualSearchTags.value, page, false)
}

// Watch for route changes (browser back/forward)
watch(() => route.query, (newQuery, oldQuery) => {
  // Only respond if this isn't the initial load and the query actually changed
  if (oldQuery && (newQuery.tags !== oldQuery.tags || newQuery.page !== oldQuery.page)) {
    initializeFromUrl()
  }
}, { deep: true })

// Keyboard navigation for pagination (non-mobile only)
const isMobile = ref(false)

const detectMobile = () => {
  // Check if device is mobile based on screen width and touch capability
  isMobile.value = window.innerWidth <= 768 || 'ontouchstart' in window
}

const handleKeydown = (event) => {
  // Only handle keyboard navigation on non-mobile devices and when not typing in form elements
  if (isMobile.value) {
    return
  }

  // Check if user is currently focused on any form element or contenteditable
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
  if (!pagination.value || isLoading.value) {
    return
  }

  if (event.key === 'ArrowLeft' && currentPage.value > 1) {
    event.preventDefault()
    goToPage(currentPage.value - 1)
  } else if (event.key === 'ArrowRight' && currentPage.value < totalPages.value) {
    event.preventDefault()
    goToPage(currentPage.value + 1)
  }
}

// Initial fetch
onMounted(() => {
  // Load cache from sessionStorage before initializing
  loadCacheFromStorage()
  initializeFromUrl()
  
  // Setup keyboard navigation
  detectMobile()
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', detectMobile)
})

onUnmounted(() => {
  // Cleanup event listeners
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', detectMobile)
})

// Helper functions
const getImageUrl = (post) => {
  if (post.is_banned) return '/banned.jpg'
  if (!post.media_asset?.variants?.length) return '/placeholder.jpg'
  
  // Use preview variant (index 2) or fallback to first variant
  const variant = post.media_asset.variants[2] || post.media_asset.variants[0]
  return variant?.url || '/placeholder.jpg'
}

const getPostRoute = (post) => {
  return `/milkbooru/${post.id}`
}

const isAnimated = (post) => {
  return ['gif', 'webm', 'mp4', 'zip'].includes(post.file_ext)
}

// Helper function to sanitize tags based on NSFW setting
const sanitizeTags = (tags) => {
  if (allowNSFW.value) {
    // NSFW allowed - don't modify tags
    return tags
  } else {
    // NSFW not allowed - sanitize rating tags
    let sanitized = tags
    
    // Remove existing rating tags
    sanitized = sanitized.replace(/\brating:(g|general|s|safe|q|questionable|e|explicit)\b/gi, '')
    
    // Clean up multiple spaces
    sanitized = sanitized.replace(/\s+/g, ' ').trim()
    
    // Add rating:g if there are any tags, or return rating:g if empty
    if (sanitized === '') {
      return 'rating:g'
    } else {
      return `rating:g ${sanitized}`
    }
  }
}

const handleSearchFocus = () => {
  if (hasEverFocused.value) return // Already processed
  
  isSearchFocused.value = true
  hasEverFocused.value = true
  
  // Set cookie that user has seen the header collapse behavior
  setCookie('milkbooru-header-seen', 'true', 1) // 1 day expiry
  
  // Remove the elements from DOM after animation completes
  // Commented out for now, don't touch
  /*setTimeout(() => {
    shouldHideElements.value = true
  }, 500)*/
}

const handleSearch = () => {
  currentPage.value = 1
  paginationToastShown.value = false // Reset toast flag for new search
  
  // Validate NSFW setting before search - security check
  if (allowNSFW.value && !isAgeVerified()) {
    // User has NSFW enabled but no age verification - disable and reset
    allowNSFW.value = false
    setCookie('nsfw_enabled', 'false', 30)
  }
  
  const searchValue = searchTags.value.trim()
  
  let tagsToUse
  if (searchValue === '') {
    // Empty search bar
    if (allowNSFW.value) {
      tagsToUse = '' // Full /posts search when NSFW allowed
    } else {
      tagsToUse = 'rating:g' // Safe content when NSFW not allowed
    }
  } else {
    // Sanitize the search based on NSFW setting
    tagsToUse = sanitizeTags(searchValue)
  }
  
  actualSearchTags.value = tagsToUse
  fetchPosts(tagsToUse, 1, true, false) // Disable cache for new searches
}

const goToPage = (page) => {
  if (page) {
    // Check if this page is cached before navigating
    const cachedResult = getCachedResult(actualSearchTags.value, page)
    const isFromCache = !!cachedResult
    
    fetchPosts(actualSearchTags.value, page)
    
    // Only scroll to top for non-cached page navigation
    if (!isFromCache) {
      // Force scroll to top even if already at bottom
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // Fallback for edge cases where smooth scroll might not work
      setTimeout(() => {
        if (window.scrollY > 500) {
          window.scrollTo({ top: 0, behavior: 'auto' })
        }
      }, 500)
    }
  }
}

// Handler for UPagination component
const handlePageChange = (page) => {
  goToPage(page)
}

// Generate visible page numbers for pagination - Mobile optimized
const _getVisiblePagesMobile = () => {
  if (!pagination.value?.total_pages) return []
  
  const current = pagination.value.current_page
  // Apply max page limit
  const total = Math.min(pagination.value.total_pages, maxPages)
  const pages = []
  
  if (total <= 5) {
    // Show all pages if total is 5 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Mobile-optimized pagination - fewer pages shown
    if (current <= 3) {
      // Near the beginning - show first 4 pages
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      if (total > 4) {
        pages.push('...')
        pages.push(total)
      }
    } else if (current >= total - 2) {
      // Near the end - show last 4 pages
      pages.push(1)
      if (total > 4) {
        pages.push('...')
      }
      for (let i = Math.max(total - 3, 1); i <= total; i++) {
        if (i > 1) pages.push(i)
      }
    } else {
      // In the middle - show current ±2 with first and last
      pages.push(1)
      pages.push('...')
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

// Generate visible page numbers for pagination - Desktop version (kept for reference)
const _getVisiblePages = () => {
  if (!pagination.value?.total_pages) return []
  
  const current = pagination.value.current_page
  // Apply max page limit
  const total = Math.min(pagination.value.total_pages, maxPages)
  const pages = []
  
  if (total <= 10) {
    // Show all pages if total is 10 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Complex pagination logic
    if (current <= 6) {
      // Near the beginning
      for (let i = 1; i <= 8; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 5) {
      // Near the end
      pages.push(1)
      pages.push('...')
      for (let i = total - 7; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // In the middle - show 3 before and 3 after current  
      pages.push(1)
      pages.push('...')
      for (let i = current - 3; i <= current + 3; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

const retryFetch = () => {
  fetchPosts(actualSearchTags.value, currentPage.value, false, false) // Disable cache for retry
}

// Cookie management functions
const setCookie = (name, value, days) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const getCookie = (name) => {
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length)
  }
  return null
}

// Age verification functions
const isAgeVerified = () => {
  return getCookie('age_verified') === 'true'
}

// Keyboard navigation toast functions
const hasSeenKeyboardToast = () => {
  return getCookie('milkbooru_keyboard_toast_seen') === 'true'
}

const showKeyboardNavigationToast = () => {
  // Only show on desktop and if user hasn't seen it before
  if (isMobile.value || hasSeenKeyboardToast()) {
    return
  }
  
  // Set cookie to not show again for half a month (15 days)
  setCookie('milkbooru_keyboard_toast_seen', 'true', 15)

  useToast().add({
    title: 'Keyboard Navigation',
    description: 'Use ← → arrow keys to navigate between pages quickly!',
    icon: 'i-heroicons-command-line',
    color: 'deeppink',
    duration: 5000
  })
}

const handleNSFWToggle = () => {
  if (allowNSFW.value && !isAgeVerified()) {
    // User is trying to enable NSFW but hasn't been age verified
    allowNSFW.value = false // Reset the toggle
    showAgeModal.value = true
  } else {
    // Save NSFW preference to cookie
    setCookie('nsfw_enabled', allowNSFW.value ? 'true' : 'false', 30) // 30 days
  }
}

const confirmAge = (isOver18) => {
  showAgeModal.value = false
  
  if (isOver18) {
    // User confirmed they are 18+
    setCookie('age_verified', 'true', 30) // 30 days = 1 month
    allowNSFW.value = true
    setCookie('nsfw_enabled', 'true', 30) // Also save NSFW preference
    
    // Show success toast
    useToast().add({
      title: 'NSFW Content Enabled',
      description: 'You can now view all content types. This preference will be remembered for 30 days.',
      icon: 'i-heroicons-check-circle',
      color: 'royalblue',
      duration: 4000
    })
  } else {
    // User said they are under 18
    allowNSFW.value = false
    setCookie('nsfw_enabled', 'false', 30) // Save NSFW preference as disabled
    
    // Show info toast
    useToast().add({
      title: 'NSFW Content Disabled',
      description: 'Only safe content will be shown.',
      icon: 'i-heroicons-shield-check',
      color: 'crimson',
      duration: 3000
    })
  }
}

const _closeAgeModal = () => {
  showAgeModal.value = false
  allowNSFW.value = false
}

// Handle blacklist tag changes
const handleBlacklistChange = () => {
  // Save blacklist to cookie (URL encode to handle special characters)
  setCookie('tag_blacklist', encodeURIComponent(blacklistTags.value), 30) // 30 days
}

// Helper function to get blacklisted tag info for a post
const getPostBlacklistInfo = (post) => {
  if (!blacklistTags.value || blacklistTags.value.trim() === '') {
    return { isBlacklisted: false, matchedTag: null }
  }

  // Parse blacklist tags (support both space and newline separation)
  const blacklistedTags = blacklistTags.value
    .toLowerCase()
    .split(/[\s\n]+/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)

  if (blacklistedTags.length === 0) {
    return { isBlacklisted: false, matchedTag: null }
  }

  // Get all tags from the post (combine all tag strings)
  const postTags = [
    post.tag_string_general || '',
    post.tag_string_artist || '',
    post.tag_string_copyright || '',
    post.tag_string_character || '',
    post.tag_string_meta || ''
  ].join(' ').toLowerCase().split(/\s+/).filter(tag => tag.length > 0)

  // Find the first matching blacklisted tag (exact word match only)
  for (const blacklistedTag of blacklistedTags) {
    const matchedPostTag = postTags.find(postTag => postTag === blacklistedTag)
    if (matchedPostTag) {
      return { isBlacklisted: true, matchedTag: blacklistedTag }
    }
  }

  return { isBlacklisted: false, matchedTag: null }
}


// Dynamic meta tags based on search state
const isInitialState = computed(() => {
  // Initial state: no URL params or URL tags is empty (meaning default search)
  return !route.query.tags || (route.query.tags === '' && searchTags.value === '')
})

const isEmptySearch = computed(() => {
  // Empty search: user searched with empty tags (all posts or rating:g depending on NSFW)
  return route.query.tags === '' || (searchTags.value === '' && actualSearchTags.value !== 'rating:g kijin_seija')
})

const isNormalSearch = computed(() => {
  // Normal search: user searched with specific tags
  return route.query.tags && route.query.tags !== '' && !isInitialState.value
})

const dynamicTitle = computed(() => {
  if (isInitialState.value) {
    return `${title} | seija-kij.in`
  } else if (isEmptySearch.value) {
    const count = pagination.value?.total_posts || 0
    if (count === 0) {
      return `${title} | seija-kij.in`
    }
    return `All Posts (${count.toLocaleString()}) - ${title} | seija-kij.in`
  } else if (isNormalSearch.value) {
    const cleanTags = route.query.tags.toString().replace(/\+/g, ' ').replace(/%2B/g, '+')
    const count = pagination.value?.total_posts || 0
    if (count === 0) {
      return `${title} | seija-kij.in`
    }
    return `${cleanTags} (${count.toLocaleString()}) - ${title} | seija-kij.in`
  }
  return `${title} | seija-kij.in`
})

const dynamicDescription = computed(() => {
  if (isInitialState.value) {
    return description
  } else if (isEmptySearch.value) {
    const count = pagination.value?.total_posts || 0
    if (count === 0) {
      return description
    }
    return `Browse all ${count.toLocaleString()} images on MilkBooru - Just a booru for all your image needs`
  } else if (isNormalSearch.value) {
    const cleanTags = route.query.tags.toString().replace(/\+/g, ' ').replace(/%2B/g, '+')
    const count = pagination.value?.total_posts || 0
    if (count === 0) {
      return description
    }
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
    { name: 'twitter:description', content: dynamicDescription }
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ],
  htmlAttrs: [
    { lang: 'en' },
  ]
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

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