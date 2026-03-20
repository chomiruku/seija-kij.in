<template>
  <div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="bg-white dark:bg-gray-900 p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-800">
          <div class="w-8 h-8 mx-auto mb-4">
            <svg class="animate-spin w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </div>
          <p class="text-gray-600 dark:text-gray-300">Loading post...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="text-center py-12">
        <div class="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-6 max-w-md mx-auto">
          <h1 class="text-4xl font-bold mb-6">
            huh?
          </h1>
          <nuxt-img src="/seijaflustered.png" alt="seija-kij.in" class="mx-auto h-48 w-auto mb-2"/>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Post not found</h3>
          <p class="text-gray-800 dark:text-gray-400 mb-4">This post might not exist or the booru is down</p>
          <div class="flex gap-3 justify-center">
            <button
              class="bg-red-500 hover:bg-red-600 px-4 py-2 transition-colors text-white"
              @click="retryFetch"
            >
              Retry
            </button>
            <NuxtLink
              to="/milkbooru"
              class="bg-gray-500 hover:bg-gray-600 px-4 py-2 transition-colors text-white"
            >
              Back to Gallery
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Post Navigation Bar -->
      <!-- Post Content -->
      <div v-else-if="post" class="max-w-8xl mx-auto">
        <!-- Post Navigation Bar -->
        <div class="mb-4 flex items-center justify-between gap-2">
          <button
            class="flex items-center gap-1.5 font-mono text-xs text-gray-500 dark:text-gray-400 hover:text-crimson-400 dark:hover:text-crimson-400 transition-colors"
            @click="goBack"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            back
          </button>

          <div class="flex items-center gap-1 font-mono text-xs">
            <NuxtLink
              :to="`/milkbooru/${Number(postId) - 1}`"
              class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-crimson-500/50 hover:text-crimson-400 transition-colors"
            >← prev</NuxtLink>
            <span class="px-2 text-gray-400 dark:text-gray-600">#{{ postId }}</span>
            <NuxtLink
              :to="`/milkbooru/${Number(postId) + 1}`"
              class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-crimson-500/50 hover:text-crimson-400 transition-colors"
            >next →</NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Media Column -->
          <div class="lg:col-span-2">
            <!-- Variant Buttons -->
            <div v-if="!isVideo && post.media_asset?.variants?.length > 1">
              <div class="flex items-center gap-2 mb-1 px-1">
                <span class="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">// QUALITY</span>
                <div class="flex-1 border-t border-neutral-800"/>
              </div>
              <div class="flex">
                <div
                  v-for="(variant, idx) in post.media_asset.variants"
                  :key="idx"
                  class="relative flex-1 border -ml-px first:ml-0 transition-colors"
                  :class="selectedVariantIndex === idx
                    ? 'bg-crimson-500 border-crimson-500'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'"
                >
                  <UiCornerBrackets size="sm" :color="selectedVariantIndex === idx ? 'white' : 'pink'" />
                  <button
                    class="variant-btn w-full px-3 py-2 text-xs font-mono transition-colors"
                    :class="selectedVariantIndex === idx
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'"
                    @click="selectedVariantIndex = idx; onVariantChange()"
                  >
                    {{ variant.width }}×{{ variant.height }}
                    <span
                      v-if="idx === post.media_asset.variants.length - 1"
                      class="ml-1 opacity-60"
                    >{{ post.file_ext?.toUpperCase() }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Main Media -->
            <div class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden mb-4">
              <div class="absolute inset-0 pointer-events-none z-10">
                <UiCornerBrackets />
              </div>

              <!-- Video -->
              <video
                v-if="isVideo"
                :src="getVideoUrl(post)"
                class="w-full h-auto max-h-[80vh] object-contain"
                controls
                preload="metadata"
                loop
                @volumechange="handleVolumeChange"
                @loadedmetadata="initializeVideo"
              >
                Your browser does not support the video tag.
              </video>

              <!-- Image -->
              <nuxt-img
                v-else
                :src="getSelectedVariantUrl()"
                :alt="post.tag_string_artist || 'Post image'"
                class="w-full h-auto object-contain"
                loading="eager"
                format="webp"
                fit="contain"
              />
            </div>

            <!-- Comments Section -->
            <div class="font-mono text-xs mt-6">

              <!-- Header row -->
              <div class="flex items-center gap-3 mb-4">
                <div class="flex items-center gap-2 flex-1">
                  <button
                    class="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors"
                    :aria-expanded="commentsExpanded"
                    :aria-label="`${commentsExpanded ? 'Collapse' : 'Expand'} comments (${comments.length})`"
                    @click="commentsExpanded = !commentsExpanded"
                  >
                    <span class="text-neutral-600 uppercase tracking-widest text-[10px]">── COMMENTS ({{ comments.length }})</span>
                    <div class="w-24 border-t border-neutral-800"/>
                    <svg
                      class="w-3 h-3 transition-transform duration-200"
                      :class="{ 'rotate-180': commentsExpanded }"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
                <a
                  :href="`https://danbooru.donmai.us/posts/${post.id}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-royalblue-400 hover:text-royalblue-300 transition-colors text-[10px]"
                  @click.stop
                >
                  ↗ danbooru
                </a>
              </div>

              <!-- Collapsible content -->
              <div v-show="commentsExpanded">

                <!-- Empty state -->
                <div v-if="comments.length === 0" class="text-neutral-600 py-2">
                  no comments —
                  <a
                    :href="`https://danbooru.donmai.us/posts/${post.id}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-royalblue-400 hover:text-royalblue-300 transition-colors"
                  >view on danbooru</a>
                </div>

                <!-- Comment log -->
                <div v-else class="space-y-4">
                  <div v-for="comment in comments" :key="comment.id">
                    <!-- Comment header line -->
                    <div class="flex items-baseline justify-between gap-2 mb-1">
                      <div class="flex items-baseline gap-3">
                        <span class="text-neutral-500">[{{ formatDateShort(comment.created_at) }}]</span>
                        <span class="text-neutral-200">{{ comment.creator_name || 'anonymous' }}</span>
                        <span v-if="comment.updated_at !== comment.created_at" class="text-neutral-600">(edited)</span>
                      </div>
                      <span
                        class="shrink-0"
                        :class="{
                          'text-green-400': comment.score > 0,
                          'text-red-400': comment.score < 0,
                          'text-neutral-600': comment.score === 0
                        }"
                      >{{ comment.score > 0 ? '+' : '' }}{{ comment.score }}</span>
                    </div>
                    <!-- Comment body -->
                    <div class="text-neutral-400 leading-relaxed pl-4 text-[11px]">
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <div v-html="parseCommentBody(comment.body)"/>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Details Sidebar -->
          <div class="font-mono text-xs border border-neutral-800 bg-black/60 p-4 space-y-0">

            <!-- Post ID + badges -->
            <div class="flex items-center gap-2 mb-3">
              <span class="text-neutral-200 text-sm tracking-wide">POST #{{ post.id }}</span>
              <UiAngularTag :label="status" :variant="statusVariant" />
              <UiAngularTag :label="rating" :variant="ratingVariant" />
            </div>

            <hr class="border-neutral-800 my-3">

            <!-- Score / File / Dates -->
            <div class="flex gap-2 mb-1.5">
              <span class="text-neutral-500 uppercase w-20 shrink-0">SCORE</span>
              <span>
                <span class="text-green-400">+{{ formattedScore.up }}</span>
                <span class="text-neutral-600 mx-1">/</span>
                <span class="text-red-400">−{{ formattedScore.down }}</span>
              </span>
            </div>
            <div class="flex gap-2 mb-1.5">
              <span class="text-neutral-500 uppercase w-20 shrink-0">FILE</span>
              <span class="text-neutral-300">{{ dimensions }} · {{ post.file_ext?.toUpperCase() }} · {{ formattedFileSize }}</span>
            </div>
            <div class="flex gap-2 mb-1.5">
              <span class="text-neutral-500 uppercase w-20 shrink-0">UPLOADED</span>
              <span class="text-neutral-300">{{ formatDateShort(post.created_at) }}</span>
            </div>
            <div v-if="post.updated_at !== post.created_at" class="flex gap-2 mb-1.5">
              <span class="text-neutral-500 uppercase w-20 shrink-0">UPDATED</span>
              <span class="text-neutral-300">{{ formatDateShort(post.updated_at) }}</span>
            </div>

            <hr class="border-neutral-800 my-3">

            <!-- Links -->
            <div v-if="post.source" class="flex gap-2 mb-1.5">
              <span class="text-neutral-500 uppercase w-20 shrink-0">SOURCE</span>
              <a
                :href="post.source" target="_blank" rel="noopener noreferrer"
                class="text-royalblue-400 hover:text-royalblue-300 transition-colors truncate"
              >
                ↗ {{ truncateUrl(post.source) }}
              </a>
            </div>
            <div class="flex gap-2 mb-1.5">
              <span class="text-neutral-500 uppercase w-20 shrink-0">DANBOORU</span>
              <a
                :href="`https://danbooru.donmai.us/posts/${post.id}`" target="_blank" rel="noopener noreferrer"
                class="text-royalblue-400 hover:text-royalblue-300 transition-colors"
              >
                ↗ /posts/{{ post.id }}
              </a>
            </div>

            <hr class="border-neutral-800 my-3">

            <!-- Tags section -->
            <div class="flex items-center gap-2 mb-3">
              <span class="text-neutral-600 uppercase tracking-widest text-[10px]">── TAGS</span>
              <div class="flex-1 border-t border-neutral-800"/>
            </div>

            <div v-if="tagsByCategory.character.length" class="flex gap-2 mb-1.5">
              <span class="text-neutral-600 w-20 shrink-0">[character]</span>
              <div class="flex flex-wrap gap-1">
                <NuxtLink v-for="tag in tagsByCategory.character" :key="tag" :to="`/milkbooru?tags=${encodeURIComponent(tag)}`">
                  <UiAngularTag :label="tag" variant="crimson" />
                </NuxtLink>
              </div>
            </div>
            <div v-if="tagsByCategory.artist.length" class="flex gap-2 mb-1.5">
              <span class="text-neutral-600 w-20 shrink-0">[artist]</span>
              <div class="flex flex-wrap gap-1">
                <NuxtLink v-for="tag in tagsByCategory.artist" :key="tag" :to="`/milkbooru?tags=${encodeURIComponent(tag)}`">
                  <UiAngularTag :label="tag" variant="pink" />
                </NuxtLink>
              </div>
            </div>
            <div v-if="tagsByCategory.copyright.length" class="flex gap-2 mb-1.5">
              <span class="text-neutral-600 w-20 shrink-0">[copyright]</span>
              <div class="flex flex-wrap gap-1">
                <NuxtLink v-for="tag in tagsByCategory.copyright" :key="tag" :to="`/milkbooru?tags=${encodeURIComponent(tag)}`">
                  <UiAngularTag :label="tag" variant="blue" />
                </NuxtLink>
              </div>
            </div>
            <div v-if="tagsByCategory.general.length" class="flex gap-2 mb-1.5">
              <span class="text-neutral-600 w-20 shrink-0">[general]</span>
              <div class="flex flex-wrap gap-1">
                <NuxtLink v-for="tag in tagsByCategory.general" :key="tag" :to="`/milkbooru?tags=${encodeURIComponent(tag)}`">
                  <UiAngularTag :label="tag" variant="gray" />
                </NuxtLink>
              </div>
            </div>
            <div v-if="tagsByCategory.meta.length" class="flex gap-2 mb-1.5">
              <span class="text-neutral-600 w-20 shrink-0">[meta]</span>
              <div class="flex flex-wrap gap-1">
                <NuxtLink v-for="tag in tagsByCategory.meta" :key="tag" :to="`/milkbooru?tags=${encodeURIComponent(tag)}`">
                  <UiAngularTag :label="tag" variant="gray" />
                </NuxtLink>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { setCookie, getCookie } = useCookies()
const postId = route.params.id

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/milkbooru')
  }
}

// Validate that the ID is a valid post ID (numeric)
const isValidPostId = computed(() => {
  return /^\d+$/.test(postId)
})

// If not a valid post ID, throw 404
if (!isValidPostId.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found'
  })
}

// State
const post = ref(null)
const comments = ref([])
const isLoading = ref(false)
const hasError = ref(false)
const videoRef = ref(null)
const selectedVariantIndex = ref(2)
const commentsExpanded = ref(false)
const commentsFetched = ref(false)

// Lazy-load comments when section is first expanded
watch(commentsExpanded, (expanded) => {
  if (expanded && !commentsFetched.value) {
    commentsFetched.value = true
    fetchComments()
  }
})
// Computed properties
const isVideo = computed(() => {
  return post.value?.file_ext === 'mp4' || post.value?.file_ext === 'zip' || post.value?.file_ext === 'webm'
})

const formattedFileSize = computed(() => {
  if (!post.value?.file_size) return 'Unknown'
  const sizes = ['B', 'KB', 'MB', 'GB']
  let size = post.value.file_size
  let i = 0
  while (size >= 1024 && i < sizes.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(2)} ${sizes[i]}`
})

const dimensions = computed(() => {
  if (!post.value) return null
  return `${post.value.image_width || '?'}×${post.value.image_height || '?'}`
})

const rating = computed(() => {
  const ratings = {
    g: 'General',
    s: 'Sensitive',
    q: 'Questionable',
    e: 'Explicit'
  }
  return ratings[post.value?.rating] || 'Unknown'
})

const status = computed(() => {
  if (!post.value) return 'Unknown'
  return post.value.is_banned ? 'Banned' : 
         post.value.is_deleted ? 'Deleted' : 
         post.value.is_pending ? 'Pending' : 'Active'
})

const formattedScore = computed(() => ({
  up: post.value?.up_score || 0,
  down: post.value?.down_score || 0,
}))

const statusVariant = computed(() => {
  const map = { Active: 'blue', Pending: 'pink', Deleted: 'gray', Banned: 'crimson' }
  return map[status.value] || 'gray'
})

const ratingVariant = computed(() => {
  const map = { General: 'blue', Sensitive: 'blue', Questionable: 'pink', Explicit: 'crimson' }
  return map[rating.value] || 'gray'
})

const tagsByCategory = computed(() => {
  if (!post.value) return {}
  return {
    artist: post.value.tag_string_artist.split(' ').filter(t => t),
    character: post.value.tag_string_character.split(' ').filter(t => t),
    copyright: post.value.tag_string_copyright.split(' ').filter(t => t),
    general: post.value.tag_string_general.split(' ').filter(t => t),
    meta: post.value.tag_string_meta.split(' ').filter(t => t)
  }
})


const getVideoUrl = (post) => {
  if (post.is_banned) return '/banned.jpg'
  return post.large_file_url || post.file_url || '/placeholder.jpg'
}

const formatDateShort = (dateString) => {
  const d = new Date(dateString)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const truncateUrl = (url) => {
  try {
    const u = new URL(url)
    const path = u.pathname.length > 20 ? u.pathname.slice(0, 20) + '…' : u.pathname
    return u.hostname + path
  } catch {
    return url.slice(0, 40)
  }
}

const fetchPost = async () => {
  isLoading.value = true
  hasError.value = false
  
  try {
    const response = await $fetch(`https://booru.seija-kij.in/api/booru/posts/${postId}`)
    post.value = response
    // Initialize quality preference after post is loaded
    nextTick(() => {
      initializeQualityPreference()
    })
  } catch (error) {
    console.error('Failed to fetch post:', error)
    hasError.value = true
    post.value = null
  } finally {
    isLoading.value = false
  }
}

const fetchComments = async () => {
  try {
    const response = await $fetch(`https://booru.seija-kij.in/api/booru/posts/${postId}/comments`)
    const fetchedComments = response?.comments || []
    // Sort comments by created_at (newest first)
    comments.value = fetchedComments.sort((b, a) => new Date(b.created_at) - new Date(a.created_at))
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    comments.value = []
  }
}

const handleVolumeChange = (event) => {
  const volume = event.target.volume
  setCookie('milkbooru-volume', volume.toString(), 30)
}

const initializeVideo = (event) => {
  const element = event.target
  videoRef.value = element
  const savedVolume = getCookie('milkbooru-volume')
  if (savedVolume !== null && !isNaN(parseFloat(savedVolume))) {
    element.volume = parseFloat(savedVolume)
  }
}

const retryFetch = () => {
  commentsFetched.value = false
  fetchPost()
}

// Quality slider methods
const getSelectedVariantUrl = () => {
  if (!post.value?.media_asset?.variants?.length) return '/placeholder.jpg'
  if (post.value.is_banned) return '/banned.jpg'
  
  const variants = post.value.media_asset.variants
  const safeIndex = Math.min(selectedVariantIndex.value, variants.length - 1)
  const variant = variants[safeIndex] || variants[0]
  return variant?.url || '/placeholder.jpg'
}


const onVariantChange = () => {
  // Save user's quality preference
  setCookie('milkbooru-quality', selectedVariantIndex.value.toString(), 30)
}

// Initialize quality preference on post load
const initializeQualityPreference = () => {
  if (!post.value?.media_asset?.variants?.length) return
  
  const savedQuality = getCookie('milkbooru-quality')
  if (savedQuality !== null) {
    const qualityIndex = parseInt(savedQuality)
    const maxIndex = post.value.media_asset.variants.length - 1
    selectedVariantIndex.value = Math.min(Math.max(0, qualityIndex), maxIndex)
  } else {
    // Default to middle quality, but ensure it's within bounds
    const variantCount = post.value.media_asset.variants.length
    selectedVariantIndex.value = Math.min(2, variantCount - 1)
  }
}

const parseCommentBody = (body) => {
  if (!body) return ''
  
  // Escape HTML to prevent XSS
  let escaped = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
  
  // Parse [quote][/quote] tags
  escaped = escaped.replace(/\[quote\]([\s\S]*?)\[\/quote\]/g, (match, content) => {
    // Clean up the quote content and parse attribution
    const lines = content.trim().split('\n')
    let attribution = ''
    let quoteText = content.trim()
    
    // Check if first line contains "said:" pattern for attribution
    if (lines.length > 0 && lines[0].includes(' said:')) {
      attribution = lines[0].replace(' said:', '').trim()
      quoteText = lines.slice(1).join('\n').trim()
    }
    
    const quotedContent = quoteText ? `<div class="quote-content">${quoteText.replace(/\n/g, '<br>')}</div>` : ''
    const attributionContent = attribution ? `<div class="quote-attribution">— ${attribution}</div>` : ''
    
    return `<div class="comment-quote">${quotedContent}${attributionContent}</div>`
  })
  
  // Convert line breaks to <br> tags
  escaped = escaped.replace(/\n/g, '<br>')
  
  return escaped
}

// Initial fetch
onMounted(async () => {
  await fetchPost()
})

// Dynamic meta tags
const dynamicTitle = computed(() => {
  if (!post.value) return `Post ${postId} | MilkBooru`
  
  const copyright = post.value.tag_string_copyright ? post.value.tag_string_copyright.split(' ').join(', ') : ''
  const character = post.value.tag_string_character ? post.value.tag_string_character.split(' ').join(', ') : ''
  const artist = post.value.tag_string_artist || 'Unknown Artist'
  
  let title = ''
  
  // Build title with copyright and character if available
  if (copyright && character) {
    title = `${character} (${copyright}) drawn by ${artist}`
  } else if (character) {
    title = `${character} drawn by ${artist}`
  } else if (copyright) {
    title = `${copyright} drawn by ${artist}`
  } else {
    title = `Artwork by ${artist}`
  }
  
  return `${title} | MilkBooru`
})

const dynamicDescription = computed(() => {
  if (!post.value) return `View post ${postId} on MilkBooru`
  
  const artist = post.value.tag_string_artist || 'Unknown Artist'
  const characters = post.value.tag_string_character || ''
  const copyright = post.value.tag_string_copyright || ''
  
  let description = `Artwork by ${artist}`
  if (characters) description += ` featuring ${characters.split(' ').join(', ')}`
  if (copyright) description += ` from ${copyright.split(' ').join(', ')}`
  description += ` - View on MilkBooru`
  
  return description
})

const dynamicKeywords = computed(() => {
  if (!post.value) return 'booru, danbooru, seija kijin, kijin seija, seija, kijin, seija-kij.in'
  
  const tags = [
    ...post.value.tag_string_artist.split(' '),
    ...post.value.tag_string_character.split(' '),
    ...post.value.tag_string_copyright.split(' '),
    ...post.value.tag_string_general.split(' ').slice(0, 10) // Limit general tags
  ].filter(t => t).join(', ')
  
  return `booru, danbooru, seija kijin, kijin seija, seija, kijin, seija-kij.in, ${tags}`
})

const postImageUrl = computed(() => {
  if (!post.value) return '/__kijin_seija_touhou_drawn_by_risutaru__7bbe0ed74e92075cd0b0b85199dc42ed.jpg'
  
  // Use low quality variant for social sharing to reduce load times
  if (post.value.is_banned) return '/banned.jpg'
  if (!post.value.media_asset?.variants?.length) return '/placeholder.jpg'
  
  // Use the first variant (typically lowest quality) for social media sharing
  const variant = post.value.media_asset.variants[0]
  return variant?.url || '/placeholder.jpg'
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
    { property: 'og:image', content: postImageUrl },
    { property: 'og:url', content: `https://seija-kij.in/milkbooru/${postId}` },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: dynamicTitle },
    { name: 'twitter:description', content: dynamicDescription },
    { name: 'twitter:image', content: postImageUrl }
  ],
  link: [
    { rel: 'canonical', href: `https://seija-kij.in/milkbooru/${postId}` }
  ],
  htmlAttrs: [
    { lang: 'en' },
  ]
})
</script>

<style scoped>
@reference "tailwindcss";

.variant-btn {
  border-radius: 0;
}

/* Comment quote styling */
:deep(.comment-quote) {
  @apply text-neutral-600 my-1 pl-2;
}

:deep(.quote-content)::before {
  content: '> ';
  @apply text-neutral-700;
}

:deep(.quote-attribution) {
  @apply text-neutral-700 text-[10px] not-italic mt-0.5;
}
</style>