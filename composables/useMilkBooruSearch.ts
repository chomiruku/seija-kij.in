import { ref, computed } from 'vue'
import type { Post, Pagination, BooruResponse } from '~/types/booru'
import { useMilkBooruCache } from './useMilkBooruCache'
import { useTagManagement } from './useTagManagement'

const MAX_PAGES = 1000

export function useMilkBooruSearch() {
  const cache = useMilkBooruCache()
  const tagManagement = useTagManagement()
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()

  // State
  const posts = ref<Post[]>([])
  const pagination = ref<Pagination | null>(null)
  const isLoading = ref(false)
  const hasError = ref(false)
  const currentPage = ref(1)
  const searchTags = ref('')
  const actualSearchTags = ref('rating:g kijin_seija')
  const paginationToastShown = ref(false)
  const isSearchFocused = ref(false)
  const hasEverFocused = ref(false)
  const shouldHideElements = ref(false)

  // Computed
  const totalPages = computed(() => pagination.value?.total_pages || 0)

  /**
   * Updates the URL with current search parameters
   */
  const updateUrl = (tags: string, page: number): void => {
    const query: Record<string, string> = {}

    // Only add tags to URL if it's not the default and not empty
    if (tags && tags !== 'rating:g kijin_seija' && tags !== '') {
      query.tags = tagManagement.encodeTagsForUrl(tags)
    }

    // Only add page to URL if it's not page 1
    if (page && page > 1) {
      query.page = page.toString()
    }

    router.push({ query })
  }

  /**
   * Fetches posts from API with caching
   */
  const fetchPosts = async (
    tags: string = 'rating:g kijin_seija',
    page: number = 1,
    updateUrlFlag: boolean = true,
    useCache: boolean = true
  ): Promise<void> => {
    // Check cache first (only if navigating back/forward)
    if (useCache) {
      const cachedResult = cache.getCachedResult(tags, page)
      if (cachedResult) {
        // Use cached data instantly without loading state
        posts.value = cachedResult.posts
        pagination.value = cachedResult.pagination

        // Apply 1000 page limit
        if (pagination.value && (pagination.value.total_pages > MAX_PAGES || pagination.value.total_pages === 1000)) {
          pagination.value.total_pages = MAX_PAGES
        }

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
      const response = await $fetch<BooruResponse>('https://booru.seija-kij.in/api/booru/posts', {
        params: {
          tags,
          page,
          limit: 20,
        },
      })

      posts.value = response.posts || []
      pagination.value = response.pagination || null

      // Cache the results
      if (pagination.value) {
        cache.setCachedResult(tags, page, posts.value, pagination.value)
      }

      // Apply 1000 page limit and show toast if needed (only once per search)
      if (pagination.value && (pagination.value.total_pages > MAX_PAGES || pagination.value.total_pages === 1000)) {
        const originalTotalPages = pagination.value.total_pages
        pagination.value.total_pages = MAX_PAGES

        // Show toast about pagination limit only if we haven't shown it yet for this search
        if (!paginationToastShown.value) {
          toast.add({
            title: 'Pagination Limited',
            description: originalTotalPages === 1000
              ? `Showing first ${MAX_PAGES} pages. Use tags to narrow down your search for better results.`
              : `Showing first ${MAX_PAGES} pages of ${originalTotalPages} total pages. Use tags to narrow down your search for better results.`,
            icon: 'i-heroicons-information-circle',
            color: 'deeppink',
            timeout: 8000,
          })
          paginationToastShown.value = true
        }
      }

      currentPage.value = page

      if (updateUrlFlag) {
        updateUrl(tags, page)
      }

      // Show keyboard navigation toast after successful search (only for new searches, not cached ones)
      if (page === 1 && posts.value.length > 0 && pagination.value && totalPages.value > 1) {
        nextTick(() => {
          showKeyboardNavigationToast()
        })
      }
    }
    catch (error) {
      console.error('Failed to fetch posts:', error)
      hasError.value = true
      posts.value = []
      pagination.value = null
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Handles search action
   */
  const handleSearch = (tags: string, allowNSFW: boolean, validateNsfwCallback: () => void): void => {
    currentPage.value = 1
    paginationToastShown.value = false

    // Validate NSFW setting before search - security check
    validateNsfwCallback()

    const searchValue = tags.trim()

    let tagsToUse: string
    if (searchValue === '') {
      // Empty search bar
      tagsToUse = allowNSFW ? '' : 'rating:g'
    }
    else {
      // Sanitize the search based on NSFW setting
      tagsToUse = tagManagement.sanitizeTags(searchValue, allowNSFW)
    }

    actualSearchTags.value = tagsToUse
    fetchPosts(tagsToUse, 1, true, false) // Disable cache for new searches
  }

  /**
   * Navigate to a specific page
   */
  const goToPage = (page: number): void => {
    if (page) {
      // Check if this page is cached before navigating
      const cachedResult = cache.getCachedResult(actualSearchTags.value, page)
      const isFromCache = !!cachedResult

      fetchPosts(actualSearchTags.value, page)

      // Only scroll to top for non-cached page navigation
      if (!isFromCache) {
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

  /**
   * Retry fetching after an error
   */
  const retryFetch = (): void => {
    fetchPosts(actualSearchTags.value, currentPage.value, false, false)
  }

  /**
   * Initialize from URL query parameters
   */
  const initializeFromUrl = (nsfwEnabled: boolean): void => {
    const { getCookie } = useCookies()

    // Check if user has previously seen the header collapse behavior
    const headerSeenCookie = getCookie('milkbooru-header-seen')
    const urlTags = route.query.tags
    const urlPage = route.query.page

    // Apply header collapse logic
    if (headerSeenCookie === 'true') {
      isSearchFocused.value = true
      hasEverFocused.value = true
    }
    else if (urlTags && typeof urlTags === 'string') {
      isSearchFocused.value = false
      hasEverFocused.value = false
    }
    else {
      isSearchFocused.value = false
      hasEverFocused.value = false
    }

    if (urlTags && typeof urlTags === 'string') {
      const tagsFromUrl = tagManagement.decodeTagsFromUrl(urlTags)
      searchTags.value = tagsFromUrl
      actualSearchTags.value = tagManagement.sanitizeTags(tagsFromUrl, nsfwEnabled)
    }
    else {
      searchTags.value = ''
      actualSearchTags.value = 'rating:g kijin_seija'
    }

    const page = urlPage ? Number.parseInt(urlPage.toString()) : 1
    currentPage.value = page

    // Fetch without updating URL since we're initializing from URL
    fetchPosts(actualSearchTags.value, page, false)
  }

  /**
   * Handle search focus
   */
  const handleSearchFocus = (): void => {
    if (hasEverFocused.value) return

    isSearchFocused.value = true
    hasEverFocused.value = true

    const { setCookie } = useCookies()
    setCookie('milkbooru-header-seen', 'true', 1)
  }

  /**
   * Show keyboard navigation toast
   */
  const showKeyboardNavigationToast = (): void => {
    const { getCookie, setCookie } = useCookies()

    // Check if desktop
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window
    if (isMobile) return

    // Check if already shown
    if (getCookie('milkbooru_keyboard_toast_seen') === 'true') return

    setCookie('milkbooru_keyboard_toast_seen', 'true', 15)

    toast.add({
      title: 'Keyboard Navigation',
      description: 'Use ← → arrow keys to navigate between pages quickly!',
      icon: 'i-heroicons-command-line',
      color: 'deeppink',
      timeout: 5000,
    })
  }

  return {
    // State
    posts: readonly(posts),
    pagination: readonly(pagination),
    isLoading: readonly(isLoading),
    hasError: readonly(hasError),
    currentPage: readonly(currentPage),
    searchTags,
    actualSearchTags: readonly(actualSearchTags),
    totalPages,
    isSearchFocused,
    hasEverFocused: readonly(hasEverFocused),
    shouldHideElements: readonly(shouldHideElements),

    // Methods
    fetchPosts,
    handleSearch,
    goToPage,
    retryFetch,
    initializeFromUrl,
    handleSearchFocus,
  }
}
