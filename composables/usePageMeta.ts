import type { MaybeRefOrGetter } from 'vue'

export interface PageMetaOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  keywords?: MaybeRefOrGetter<string>
  ogImage?: MaybeRefOrGetter<string>
  canonicalUrl?: MaybeRefOrGetter<string>
  robots?: MaybeRefOrGetter<string>
  twitterCard?: MaybeRefOrGetter<'summary' | 'summary_large_image'>
}

const DEFAULT_OG_IMAGE = '/__kijin_seija_touhou_drawn_by_risutaru__7bbe0ed74e92075cd0b0b85199dc42ed.jpg'
const BASE_KEYWORDS = 'touhou, seija kijin, kijin seija, seija, kijin, seija-kij.in, 鬼人 正邪, 鬼人, 正邪'

/**
 * Composable for managing SEO meta tags across pages
 * Centralizes meta tag configuration and ensures consistent SEO
 */
export function usePageMeta(options: PageMetaOptions) {
  const {
    title,
    description,
    keywords,
    ogImage = DEFAULT_OG_IMAGE,
    canonicalUrl,
    robots = 'index, follow',
    twitterCard = 'summary_large_image',
  } = options

  const computedTitle = computed(() => toValue(title))
  const computedDescription = computed(() => toValue(description))
  const computedKeywords = computed(() => {
    const kw = toValue(keywords)
    return kw ? `${BASE_KEYWORDS}, ${kw}` : BASE_KEYWORDS
  })
  const computedOgImage = computed(() => toValue(ogImage))
  const computedCanonicalUrl = computed(() => toValue(canonicalUrl))
  const computedRobots = computed(() => toValue(robots))
  const computedTwitterCard = computed(() => toValue(twitterCard))

  useHead({
    title: computedTitle,
    meta: [
      // Basic meta tags
      { name: 'description', content: computedDescription },
      { name: 'keywords', content: computedKeywords },
      { name: 'robots', content: computedRobots },

      // Open Graph tags for social sharing
      { property: 'og:title', content: computedTitle },
      { property: 'og:description', content: computedDescription },
      { property: 'og:image', content: computedOgImage },
      ...(computedCanonicalUrl.value ? [{ property: 'og:url', content: computedCanonicalUrl }] : []),

      // Twitter Card tags
      { name: 'twitter:card', content: computedTwitterCard },
      { name: 'twitter:title', content: computedTitle },
      { name: 'twitter:description', content: computedDescription },
    ],
    link: computedCanonicalUrl.value
      ? [{ rel: 'canonical', href: computedCanonicalUrl }]
      : [],
    htmlAttrs: [
      { lang: 'en' },
    ],
  })

  return {
    title: computedTitle,
    description: computedDescription,
    keywords: computedKeywords,
  }
}
