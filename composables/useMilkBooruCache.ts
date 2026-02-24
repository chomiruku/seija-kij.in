import { ref } from 'vue'
import type { CachedSearchResult, Post, Pagination } from '~/types/booru'

const CACHE_KEY = 'milkbooru_search_cache'
const MAX_CACHE_SIZE = 50

const searchCache = ref<Map<string, CachedSearchResult>>(new Map())

export function useMilkBooruCache() {

  /**
   * Generates a cache key from search tags and page number
   */
  const getCacheKey = (tags: string, page: number): string => {
    return `${tags || 'default'}-${page}`
  }

  /**
   * Loads cached search results from sessionStorage
   */
  const loadCacheFromStorage = (): void => {
    try {
      const stored = sessionStorage.getItem(CACHE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Convert back to Map and populate searchCache
        Object.entries(parsed).forEach(([key, value]) => {
          searchCache.value.set(key, value as CachedSearchResult)
        })
      }
    }
    catch (error) {
      console.warn('Failed to load cache from sessionStorage:', error)
    }
  }

  /**
   * Saves the current cache to sessionStorage
   */
  const saveCacheToStorage = (): void => {
    try {
      // Convert Map to plain object for JSON serialization
      const cacheObj = Object.fromEntries(searchCache.value)
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj))
    }
    catch (error) {
      console.warn('Failed to save cache to sessionStorage:', error)
    }
  }

  /**
   * Retrieves a cached search result if it exists
   */
  const getCachedResult = (tags: string, page: number): CachedSearchResult | undefined => {
    const key = getCacheKey(tags, page)
    return searchCache.value.get(key)
  }

  /**
   * Stores a search result in the cache with LRU eviction
   */
  const setCachedResult = (tags: string, page: number, posts: Post[], pagination: Pagination): void => {
    const key = getCacheKey(tags, page)

    // Implement LRU cache by removing oldest entries
    if (searchCache.value.size >= MAX_CACHE_SIZE) {
      const firstKey = searchCache.value.keys().next().value
      if (firstKey) {
        searchCache.value.delete(firstKey)
      }
    }

    searchCache.value.set(key, {
      posts: JSON.parse(JSON.stringify(posts)), // Deep copy to prevent mutations
      pagination: { ...pagination }, // Deep copy pagination
      timestamp: Date.now(),
    })

    // Save to sessionStorage
    saveCacheToStorage()
  }

  /**
   * Clears all cached results
   */
  const clearCache = (): void => {
    searchCache.value.clear()
    try {
      sessionStorage.removeItem(CACHE_KEY)
    }
    catch (error) {
      console.warn('Failed to clear cache from sessionStorage:', error)
    }
  }

  /**
   * Gets the current cache size
   */
  const getCacheSize = (): number => {
    return searchCache.value.size
  }

  return {
    loadCacheFromStorage,
    getCachedResult,
    setCachedResult,
    clearCache,
    getCacheSize,
  }
}
