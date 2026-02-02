import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useMilkBooruCache } from '~/composables/useMilkBooruCache'
import { mockSessionStorage } from '../utils/testHelpers'
import { createMockPost, createMockPagination, createMockPosts } from '../fixtures/booruData'

describe('useMilkBooruCache', () => {
  let storage: ReturnType<typeof mockSessionStorage>

  beforeEach(() => {
    storage = mockSessionStorage()
    vi.clearAllMocks()
  })

  describe('getCachedResult', () => {
    it('should return undefined for non-existent cache key', () => {
      const { getCachedResult } = useMilkBooruCache()
      const result = getCachedResult('test_tags', 1)
      expect(result).toBeUndefined()
    })

    it('should return cached result after it has been set', () => {
      const { setCachedResult, getCachedResult } = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination()

      setCachedResult('test_tags', 1, posts, pagination)
      const result = getCachedResult('test_tags', 1)

      expect(result).toBeDefined()
      expect(result?.posts).toHaveLength(1)
      expect(result?.pagination.current_page).toBe(1)
    })

    it('should return different results for different cache keys', () => {
      const { setCachedResult, getCachedResult } = useMilkBooruCache()
      const posts1 = [createMockPost({ id: 1 })]
      const posts2 = [createMockPost({ id: 2 })]
      const pagination = createMockPagination()

      setCachedResult('tags1', 1, posts1, pagination)
      setCachedResult('tags2', 1, posts2, pagination)

      const result1 = getCachedResult('tags1', 1)
      const result2 = getCachedResult('tags2', 1)

      expect(result1?.posts[0].id).toBe(1)
      expect(result2?.posts[0].id).toBe(2)
    })
  })

  describe('setCachedResult', () => {
    it('should store result with timestamp', () => {
      const { setCachedResult, getCachedResult } = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination()
      const beforeTime = Date.now()

      setCachedResult('test_tags', 1, posts, pagination)
      const result = getCachedResult('test_tags', 1)

      expect(result?.timestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(result?.timestamp).toBeLessThanOrEqual(Date.now())
    })

    it('should deep copy posts to prevent mutations', () => {
      const { setCachedResult, getCachedResult } = useMilkBooruCache()
      const posts = [createMockPost({ id: 1 })]
      const pagination = createMockPagination()

      setCachedResult('test_tags', 1, posts, pagination)

      // Mutate original
      posts[0].id = 999

      const result = getCachedResult('test_tags', 1)
      expect(result?.posts[0].id).toBe(1) // Should still be original value
    })

    it('should deep copy pagination to prevent mutations', () => {
      const { setCachedResult, getCachedResult } = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination({ current_page: 1 })

      setCachedResult('test_tags', 1, posts, pagination)

      // Mutate original
      pagination.current_page = 999

      const result = getCachedResult('test_tags', 1)
      expect(result?.pagination.current_page).toBe(1) // Should still be original value
    })

    it('should implement LRU eviction when cache exceeds max size', () => {
      const { setCachedResult, getCachedResult, getCacheSize } = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination()

      // Fill cache to max size (50)
      for (let i = 0; i < 51; i++) {
        setCachedResult(`tags_${i}`, 1, posts, pagination)
      }

      expect(getCacheSize()).toBe(50)
      // First entry should be evicted
      expect(getCachedResult('tags_0', 1)).toBeUndefined()
      // Last entry should exist
      expect(getCachedResult('tags_50', 1)).toBeDefined()
    })
  })

  describe('loadCacheFromStorage and saveCacheToStorage', () => {
    it('should persist cache to sessionStorage', () => {
      const { setCachedResult } = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination()

      setCachedResult('test_tags', 1, posts, pagination)

      const stored = storage.getItem('milkbooru_search_cache')
      expect(stored).toBeDefined()
      expect(JSON.parse(stored!)).toHaveProperty('test_tags-1')
    })

    it('should load cache from sessionStorage on initialization', () => {
      const posts = [createMockPost()]
      const pagination = createMockPagination()

      // Manually set sessionStorage
      storage.setItem(
        'milkbooru_search_cache',
        JSON.stringify({
          'test_tags-1': {
            posts,
            pagination,
            timestamp: Date.now(),
          },
        })
      )

      const { loadCacheFromStorage, getCachedResult } = useMilkBooruCache()
      loadCacheFromStorage()

      const result = getCachedResult('test_tags', 1)
      expect(result).toBeDefined()
      expect(result?.posts).toHaveLength(1)
    })

    it('should handle corrupted sessionStorage gracefully', () => {
      storage.setItem('milkbooru_search_cache', 'invalid json')

      const { loadCacheFromStorage, getCacheSize } = useMilkBooruCache()

      // Should not throw
      expect(() => loadCacheFromStorage()).not.toThrow()
      expect(getCacheSize()).toBe(0)
    })
  })

  describe('clearCache', () => {
    it('should clear all cached results', () => {
      const { setCachedResult, clearCache, getCacheSize, getCachedResult }
        = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination()

      setCachedResult('tags1', 1, posts, pagination)
      setCachedResult('tags2', 1, posts, pagination)

      expect(getCacheSize()).toBe(2)

      clearCache()

      expect(getCacheSize()).toBe(0)
      expect(getCachedResult('tags1', 1)).toBeUndefined()
      expect(getCachedResult('tags2', 1)).toBeUndefined()
    })

    it('should clear sessionStorage', () => {
      const { setCachedResult, clearCache } = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination()

      setCachedResult('test_tags', 1, posts, pagination)
      expect(storage.getItem('milkbooru_search_cache')).toBeDefined()

      clearCache()
      expect(storage.getItem('milkbooru_search_cache')).toBeNull()
    })
  })

  describe('getCacheSize', () => {
    it('should return 0 for empty cache', () => {
      const { getCacheSize } = useMilkBooruCache()
      expect(getCacheSize()).toBe(0)
    })

    it('should return correct size after adding entries', () => {
      const { setCachedResult, getCacheSize } = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination()

      setCachedResult('tags1', 1, posts, pagination)
      expect(getCacheSize()).toBe(1)

      setCachedResult('tags2', 1, posts, pagination)
      expect(getCacheSize()).toBe(2)
    })
  })

  describe('edge cases', () => {
    it('should handle empty tags string', () => {
      const { setCachedResult, getCachedResult } = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination()

      setCachedResult('', 1, posts, pagination)
      const result = getCachedResult('', 1)

      expect(result).toBeDefined()
      expect(result?.posts).toHaveLength(1)
    })

    it('should handle large page numbers', () => {
      const { setCachedResult, getCachedResult } = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination({ current_page: 9999 })

      setCachedResult('tags', 9999, posts, pagination)
      const result = getCachedResult('tags', 9999)

      expect(result).toBeDefined()
      expect(result?.pagination.current_page).toBe(9999)
    })

    it('should handle tags with special characters', () => {
      const { setCachedResult, getCachedResult } = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination()
      const specialTags = 'kijin_seija rating:g -guro ~solo'

      setCachedResult(specialTags, 1, posts, pagination)
      const result = getCachedResult(specialTags, 1)

      expect(result).toBeDefined()
    })

    it('should handle multiple posts in cache', () => {
      const { setCachedResult, getCachedResult } = useMilkBooruCache()
      const posts = createMockPosts(20)
      const pagination = createMockPagination({ total_posts: 20 })

      setCachedResult('tags', 1, posts, pagination)
      const result = getCachedResult('tags', 1)

      expect(result?.posts).toHaveLength(20)
    })

    it('should handle updating same cache key', () => {
      const { setCachedResult, getCachedResult, getCacheSize } = useMilkBooruCache()
      const posts1 = [createMockPost({ id: 1 })]
      const posts2 = [createMockPost({ id: 2 })]
      const pagination = createMockPagination()

      setCachedResult('tags', 1, posts1, pagination)
      setCachedResult('tags', 1, posts2, pagination)

      const result = getCachedResult('tags', 1)
      expect(result?.posts[0].id).toBe(2)
      expect(getCacheSize()).toBe(1)
    })

    it('should handle different pages of same tags', () => {
      const { setCachedResult, getCachedResult, getCacheSize } = useMilkBooruCache()
      const posts1 = [createMockPost({ id: 1 })]
      const posts2 = [createMockPost({ id: 21 })]
      const pagination1 = createMockPagination({ current_page: 1 })
      const pagination2 = createMockPagination({ current_page: 2 })

      setCachedResult('tags', 1, posts1, pagination1)
      setCachedResult('tags', 2, posts2, pagination2)

      expect(getCacheSize()).toBe(2)
      expect(getCachedResult('tags', 1)?.posts[0].id).toBe(1)
      expect(getCachedResult('tags', 2)?.posts[0].id).toBe(21)
    })

    it('should evict oldest entry when cache is full (FIFO-like LRU)', () => {
      const { setCachedResult, getCachedResult, getCacheSize } = useMilkBooruCache()
      const posts = [createMockPost()]
      const pagination = createMockPagination()

      // Fill cache to max (50 entries)
      for (let i = 0; i < 50; i++) {
        setCachedResult(`tags_${i}`, 1, posts, pagination)
      }

      expect(getCacheSize()).toBe(50)
      expect(getCachedResult('tags_0', 1)).toBeDefined()

      // Add one more entry to trigger eviction
      setCachedResult('tags_50', 1, posts, pagination)

      expect(getCacheSize()).toBe(50)
      // First entry (tags_0) should be evicted
      expect(getCachedResult('tags_0', 1)).toBeUndefined()
      // Newest entry should exist
      expect(getCachedResult('tags_50', 1)).toBeDefined()
      // Second entry should still exist
      expect(getCachedResult('tags_1', 1)).toBeDefined()
    })

    it('should handle empty posts array', () => {
      const { setCachedResult, getCachedResult } = useMilkBooruCache()
      const pagination = createMockPagination({ total_posts: 0 })

      setCachedResult('no_results', 1, [], pagination)
      const result = getCachedResult('no_results', 1)

      expect(result?.posts).toHaveLength(0)
    })
  })
})
