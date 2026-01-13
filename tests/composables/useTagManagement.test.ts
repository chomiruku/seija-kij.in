import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTagManagement } from '~/composables/useTagManagement'
import { mockCookies } from '../utils/testHelpers'
import { createMockPost, createBlacklistedPost } from '../fixtures/booruData'

describe('useTagManagement', () => {
  let cookies: ReturnType<typeof mockCookies>

  beforeEach(() => {
    cookies = mockCookies()
    vi.clearAllMocks()
  })

  describe('sanitizeTags', () => {
    it('should not modify tags when NSFW is allowed', () => {
      const { sanitizeTags } = useTagManagement()
      const tags = 'kijin_seija rating:e nsfw'
      const result = sanitizeTags(tags, true)
      expect(result).toBe(tags)
    })

    it('should add rating:g when NSFW is not allowed and no rating present', () => {
      const { sanitizeTags } = useTagManagement()
      const tags = 'kijin_seija solo'
      const result = sanitizeTags(tags, false)
      expect(result).toBe('rating:g kijin_seija solo')
    })

    it('should replace rating:e with rating:g when NSFW not allowed', () => {
      const { sanitizeTags } = useTagManagement()
      const tags = 'kijin_seija rating:e nsfw'
      const result = sanitizeTags(tags, false)
      expect(result).toBe('rating:g kijin_seija nsfw')
    })

    it('should replace rating:q with rating:g when NSFW not allowed', () => {
      const { sanitizeTags } = useTagManagement()
      const tags = 'rating:q kijin_seija'
      const result = sanitizeTags(tags, false)
      expect(result).toBe('rating:g kijin_seija')
    })

    it('should handle empty tags when NSFW not allowed', () => {
      const { sanitizeTags } = useTagManagement()
      const result = sanitizeTags('', false)
      expect(result).toBe('rating:g')
    })

    it('should clean up multiple spaces', () => {
      const { sanitizeTags } = useTagManagement()
      const tags = 'kijin_seija    solo    rating:g'
      const result = sanitizeTags(tags, false)
      expect(result).toContain('kijin_seija solo')
      expect(result).not.toMatch(/\s{2,}/)
    })

    it('should handle rating:general variant', () => {
      const { sanitizeTags } = useTagManagement()
      const tags = 'kijin_seija rating:general'
      const result = sanitizeTags(tags, false)
      expect(result).toBe('rating:g kijin_seija')
    })

    it('should handle rating:safe variant', () => {
      const { sanitizeTags } = useTagManagement()
      const tags = 'rating:safe kijin_seija'
      const result = sanitizeTags(tags, false)
      expect(result).toBe('rating:g kijin_seija')
    })

    it('should handle rating:explicit variant', () => {
      const { sanitizeTags } = useTagManagement()
      const tags = 'rating:explicit kijin_seija'
      const result = sanitizeTags(tags, false)
      expect(result).toBe('rating:g kijin_seija')
    })
  })

  describe('loadBlacklistFromCookie', () => {
    it('should return default blacklist when cookie does not exist', () => {
      const { loadBlacklistFromCookie } = useTagManagement()
      const result = loadBlacklistFromCookie()
      expect(result).toBe('guro scat furry pee loli shota fart vomit ryona blood')
    })

    it('should return cookie value when it exists', () => {
      const customBlacklist = 'gore violence'
      cookies.set({ tag_blacklist: encodeURIComponent(customBlacklist) })

      const { loadBlacklistFromCookie } = useTagManagement()
      const result = loadBlacklistFromCookie()
      expect(result).toBe(customBlacklist)
    })

    it('should decode URL-encoded cookie values', () => {
      const customBlacklist = 'tag with spaces'
      cookies.set({ tag_blacklist: encodeURIComponent(customBlacklist) })

      const { loadBlacklistFromCookie } = useTagManagement()
      const result = loadBlacklistFromCookie()
      expect(result).toBe(customBlacklist)
    })

    it('should return empty string if cookie is set to empty', () => {
      cookies.set({ tag_blacklist: '' })

      const { loadBlacklistFromCookie } = useTagManagement()
      const result = loadBlacklistFromCookie()
      expect(result).toBe('')
    })
  })

  describe('initializeBlacklist', () => {
    it('should set blacklistTags to default when no cookie exists', () => {
      const { initializeBlacklist, blacklistTags } = useTagManagement()
      initializeBlacklist()
      expect(blacklistTags.value).toBe('guro scat furry pee loli shota fart vomit ryona blood')
    })

    it('should set blacklistTags from cookie when it exists', () => {
      const customBlacklist = 'gore violence'
      cookies.set({ tag_blacklist: encodeURIComponent(customBlacklist) })

      const { initializeBlacklist, blacklistTags } = useTagManagement()
      initializeBlacklist()
      expect(blacklistTags.value).toBe(customBlacklist)
    })

    it('should create cookie with default blacklist if none exists', () => {
      const { initializeBlacklist } = useTagManagement()
      initializeBlacklist()

      const cookieStore = cookies.get()
      expect(cookieStore.tag_blacklist).toBeDefined()
    })
  })

  describe('updateBlacklist', () => {
    it('should update blacklistTags value', () => {
      const { updateBlacklist, blacklistTags } = useTagManagement()
      const newBlacklist = 'custom1 custom2'

      updateBlacklist(newBlacklist)
      expect(blacklistTags.value).toBe(newBlacklist)
    })

    it('should save to cookie', () => {
      const { updateBlacklist } = useTagManagement()
      const newBlacklist = 'custom1 custom2'

      updateBlacklist(newBlacklist)

      const cookieStore = cookies.get()
      expect(cookieStore.tag_blacklist).toBeDefined()
    })
  })

  describe('getPostBlacklistInfo', () => {
    it('should return not blacklisted for empty blacklist', () => {
      const { getPostBlacklistInfo } = useTagManagement()
      const post = createMockPost()
      const result = getPostBlacklistInfo(post, '')
      expect(result.isBlacklisted).toBe(false)
      expect(result.matchedTag).toBeNull()
    })

    it('should return not blacklisted when post has no matching tags', () => {
      const { getPostBlacklistInfo } = useTagManagement()
      const post = createMockPost({
        tag_string_general: 'solo safe',
      })
      const result = getPostBlacklistInfo(post, 'gore violence')
      expect(result.isBlacklisted).toBe(false)
      expect(result.matchedTag).toBeNull()
    })

    it('should detect blacklisted tag in general tags', () => {
      const { getPostBlacklistInfo } = useTagManagement()
      const post = createBlacklistedPost('gore')
      const result = getPostBlacklistInfo(post, 'gore violence')
      expect(result.isBlacklisted).toBe(true)
      expect(result.matchedTag).toBe('gore')
    })

    it('should handle multiple blacklisted tags and return first match', () => {
      const { getPostBlacklistInfo } = useTagManagement()
      const post = createMockPost({
        tag_string_general: 'gore violence blood',
      })
      const result = getPostBlacklistInfo(post, 'gore violence')
      expect(result.isBlacklisted).toBe(true)
      expect(result.matchedTag).toBe('gore')
    })

    it('should be case insensitive', () => {
      const { getPostBlacklistInfo } = useTagManagement()
      const post = createMockPost({
        tag_string_general: 'GORE',
      })
      const result = getPostBlacklistInfo(post, 'gore')
      expect(result.isBlacklisted).toBe(true)
      expect(result.matchedTag).toBe('gore')
    })

    it('should check all tag fields', () => {
      const { getPostBlacklistInfo } = useTagManagement()
      const post = createMockPost({
        tag_string_artist: 'banned_artist',
        tag_string_general: 'safe',
      })
      const result = getPostBlacklistInfo(post, 'banned_artist')
      expect(result.isBlacklisted).toBe(true)
      expect(result.matchedTag).toBe('banned_artist')
    })

    it('should handle newline-separated blacklist', () => {
      const { getPostBlacklistInfo } = useTagManagement()
      const post = createBlacklistedPost('gore')
      const result = getPostBlacklistInfo(post, 'gore\nviolence\nblood')
      expect(result.isBlacklisted).toBe(true)
      expect(result.matchedTag).toBe('gore')
    })

    it('should require exact word match (not substring)', () => {
      const { getPostBlacklistInfo } = useTagManagement()
      const post = createMockPost({
        tag_string_general: 'gorgeous',
      })
      const result = getPostBlacklistInfo(post, 'gore')
      expect(result.isBlacklisted).toBe(false)
    })
  })

  describe('encodeTagsForUrl', () => {
    it('should replace spaces with plus signs', () => {
      const { encodeTagsForUrl } = useTagManagement()
      const result = encodeTagsForUrl('kijin seija rating:g')
      expect(result).toBe('kijin+seija+rating:g')
    })

    it('should encode plus signs as %2B', () => {
      const { encodeTagsForUrl } = useTagManagement()
      const result = encodeTagsForUrl('tag+with+plus')
      expect(result).toBe('tag%2Bwith%2Bplus')
    })

    it('should handle both spaces and plus signs correctly', () => {
      const { encodeTagsForUrl } = useTagManagement()
      const result = encodeTagsForUrl('tag+plus and space')
      expect(result).toBe('tag%2Bplus+and+space')
    })
  })

  describe('decodeTagsFromUrl', () => {
    it('should replace plus signs with spaces', () => {
      const { decodeTagsFromUrl } = useTagManagement()
      const result = decodeTagsFromUrl('kijin+seija+rating:g')
      expect(result).toBe('kijin seija rating:g')
    })

    it('should decode %2B to plus signs', () => {
      const { decodeTagsFromUrl } = useTagManagement()
      const result = decodeTagsFromUrl('tag%2Bwith%2Bplus')
      expect(result).toBe('tag+with+plus')
    })

    it('should handle both plus and %2B correctly', () => {
      const { decodeTagsFromUrl } = useTagManagement()
      const result = decodeTagsFromUrl('tag%2Bplus+and+space')
      expect(result).toBe('tag+plus and space')
    })

    it('should be inverse of encodeTagsForUrl', () => {
      const { encodeTagsForUrl, decodeTagsFromUrl } = useTagManagement()
      const original = 'kijin seija rating:g tag+with+plus'
      const encoded = encodeTagsForUrl(original)
      const decoded = decodeTagsFromUrl(encoded)
      expect(decoded).toBe(original)
    })
  })
})
