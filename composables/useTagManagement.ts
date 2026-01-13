import { ref, readonly } from 'vue'
import type { Post, BlacklistInfo } from '~/types/booru'
import { useCookies } from './useCookies'

const BLACKLIST_COOKIE_NAME = 'tag_blacklist'
const BLACKLIST_EXPIRY_DAYS = 30
const DEFAULT_BLACKLIST_TAGS = 'guro scat furry pee loli shota fart vomit ryona blood'

export function useTagManagement() {
  const { getCookie, setCookie } = useCookies()
  const blacklistTags = ref<string>('')

  /**
   * Sanitizes search tags based on NSFW settings
   * If NSFW is not allowed, ensures rating:g is present
   */
  const sanitizeTags = (tags: string, allowNSFW: boolean): string => {
    if (allowNSFW) {
      // NSFW allowed - don't modify tags
      return tags
    }

    // NSFW not allowed - sanitize rating tags
    let sanitized = tags

    // Remove existing rating tags
    sanitized = sanitized.replace(/\brating:(g|general|s|safe|q|questionable|e|explicit)\b/gi, '')

    // Clean up multiple spaces
    sanitized = sanitized.replace(/\s+/g, ' ').trim()

    // Add rating:g if there are any tags, or return rating:g if empty
    if (sanitized === '') {
      return 'rating:g'
    }
    return `rating:g ${sanitized}`
  }

  /**
   * Loads blacklist preferences from cookies
   * Returns default blacklist if cookie doesn't exist
   */
  const loadBlacklistFromCookie = (): string => {
    const blacklistCookie = getCookie(BLACKLIST_COOKIE_NAME)

    if (blacklistCookie !== null) {
      // Cookie exists (even if empty) - user has interacted with blacklist before
      return decodeURIComponent(blacklistCookie)
    }

    // No cookie exists - new user, return default blacklist tags
    return DEFAULT_BLACKLIST_TAGS
  }

  /**
   * Saves blacklist tags to cookie
   */
  const saveBlacklistToCookie = (tags: string): void => {
    setCookie(BLACKLIST_COOKIE_NAME, encodeURIComponent(tags), BLACKLIST_EXPIRY_DAYS)
  }

  /**
   * Initializes blacklist from cookie
   */
  const initializeBlacklist = (): void => {
    const tags = loadBlacklistFromCookie()
    blacklistTags.value = tags

    // Set cookie if it doesn't exist (for new users)
    if (getCookie(BLACKLIST_COOKIE_NAME) === null) {
      saveBlacklistToCookie(tags)
    }
  }

  /**
   * Updates blacklist tags and saves to cookie
   */
  const updateBlacklist = (tags: string): void => {
    blacklistTags.value = tags
    saveBlacklistToCookie(tags)
  }

  /**
   * Checks if a post contains any blacklisted tags
   * Returns information about whether it's blacklisted and which tag matched
   */
  const getPostBlacklistInfo = (post: Post, blacklist: string): BlacklistInfo => {
    if (!blacklist || blacklist.trim() === '') {
      return { isBlacklisted: false, matchedTag: null }
    }

    // Parse blacklist tags (support both space and newline separation)
    const blacklistedTags = blacklist
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
      post.tag_string_meta || '',
    ]
      .join(' ')
      .toLowerCase()
      .split(/\s+/)
      .filter(tag => tag.length > 0)

    // Find the first matching blacklisted tag (exact word match only)
    for (const blacklistedTag of blacklistedTags) {
      const matchedPostTag = postTags.find(postTag => postTag === blacklistedTag)
      if (matchedPostTag) {
        return { isBlacklisted: true, matchedTag: blacklistedTag }
      }
    }

    return { isBlacklisted: false, matchedTag: null }
  }

  /**
   * Encodes tags in Danbooru URL format
   * First encode actual + signs to %2B, then replace spaces with +
   */
  const encodeTagsForUrl = (tags: string): string => {
    return tags.replace(/\+/g, '%2B').replace(/\s+/g, '+')
  }

  /**
   * Decodes tags from Danbooru URL format
   * Replace + with spaces, then decode %2B back to +
   */
  const decodeTagsFromUrl = (tags: string): string => {
    return tags.replace(/\+/g, ' ').replace(/%2B/g, '+')
  }

  return {
    blacklistTags: readonly(blacklistTags),
    sanitizeTags,
    loadBlacklistFromCookie,
    saveBlacklistToCookie,
    initializeBlacklist,
    updateBlacklist,
    getPostBlacklistInfo,
    encodeTagsForUrl,
    decodeTagsFromUrl,
  }
}
