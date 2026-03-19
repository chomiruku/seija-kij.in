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

      <!-- Post Content -->
      <div v-else-if="post" class="max-w-8xl mx-auto">

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Media Column -->
          <div class="lg:col-span-2">
            <!-- Variant Buttons -->
            <div v-if="!isVideo && post.media_asset?.variants?.length > 1" class="flex mb-2">
              <div
                v-for="(variant, idx) in post.media_asset.variants"
                :key="idx"
                class="relative flex-1 border -ml-px first:ml-0 transition-colors"
                :class="selectedVariantIndex === idx ? 'bg-crimson-500/20 border-crimson-500/30' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'"
              >
                <UiCornerBrackets size="sm" :color="selectedVariantIndex === idx ? 'crimson' : 'pink'" />
                <button
                  class="variant-btn w-full px-3 py-2 text-xs font-mono transition-colors"
                  :class="selectedVariantIndex === idx ? 'text-crimson-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'"
                  @click="selectedVariantIndex = idx; onVariantChange()"
                >
                  {{ variant.width }}×{{ variant.height }}
                </button>
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
            <div class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5">
              <UiCornerBrackets size="sm" />
              <!-- Clickable Header -->
              <div 
                class="flex justify-between items-center cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/20 p-2 -m-2 transition-colors"
                @click="commentsExpanded = !commentsExpanded"
              >
                <div class="flex items-center gap-2">
                  <h3 class="text-xl font-bold">Comments ({{ comments.length }})</h3>
                  <svg 
                    class="w-5 h-5 transition-transform duration-200"
                    :class="{ 'rotate-180': commentsExpanded }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
                <a
                  :href="`https://danbooru.donmai.us/posts/${post.id}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-pink-600 hover:text-pink-700 transition-colors"
                  @click.stop
                >
                  View on Danbooru →
                </a>
              </div>

              <!-- Collapsible Content -->
              <div v-show="commentsExpanded" class="mt-6">
                <!-- No Comments State -->
                <div v-if="comments.length === 0" class="py-6">
                  <p class="text-gray-500 dark:text-gray-400 font-mono text-sm">no comments on danbooru yet</p>
                </div>

                <!-- Comments List -->
                <div v-else class="space-y-4">
                  <div 
                    v-for="comment in comments" 
                    :key="comment.id" 
                    class="bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <!-- Comment Header -->
                    <div class="flex justify-between items-start mb-3">
                      <div>
                        <span class="font-semibold text-gray-900 dark:text-white text-sm">
                          {{ comment.creator_name || 'Anonymous' }}
                        </span>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatDate(comment.created_at) }}
                          <span v-if="comment.updated_at !== comment.created_at" class="ml-1">
                            (edited)
                          </span>
                        </div>
                      </div>
                      <span 
                        :class="{
                          'text-green-600 bg-green-100 dark:bg-green-900/20': comment.score > 0,
                          'text-red-600 bg-red-100 dark:bg-red-900/20': comment.score < 0,
                          'text-gray-500 bg-gray-100 dark:bg-gray-800/50': comment.score === 0
                        }"
                        class="text-xs font-medium px-2 py-1"
                      >
                        {{ comment.score > 0 ? '+' : '' }}{{ comment.score }}
                      </span>
                    </div>
                    
                    <!-- Comment Body with Quote Parsing -->
                    <div class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <div v-html="parseCommentBody(comment.body)"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Details Sidebar -->
          <div class="space-y-4">
            <!-- Tags -->
            <div class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5">
              <UiCornerBrackets size="sm" />
              <h3 class="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Tags</h3>

              <div v-if="tagsByCategory.artist.length" class="mb-4">
                <h4 class="text-xs uppercase tracking-widest text-deeppink-400 dark:text-deeppink-500 mb-2 font-mono">artist</h4>
                <div class="flex flex-wrap gap-1">
                  <NuxtLink
                    v-for="tag in tagsByCategory.artist"
                    :key="tag"
                    :to="`/milkbooru?tags=${encodeURIComponent(tag)}`"
                  >
                    <UiAngularTag :label="tag" variant="pink" />
                  </NuxtLink>
                </div>
              </div>

              <div v-if="tagsByCategory.character.length" class="mb-4">
                <h4 class="text-xs uppercase tracking-widest text-crimson-400 dark:text-crimson-500 mb-2 font-mono">character</h4>
                <div class="flex flex-wrap gap-1">
                  <NuxtLink v-for="tag in tagsByCategory.character" :key="tag" :to="`/milkbooru?tags=${encodeURIComponent(tag)}`">
                    <UiAngularTag :label="tag" variant="crimson" />
                  </NuxtLink>
                </div>
              </div>

              <div v-if="tagsByCategory.copyright.length" class="mb-4">
                <h4 class="text-xs uppercase tracking-widest text-royalblue-400 dark:text-royalblue-500 mb-2 font-mono">copyright</h4>
                <div class="flex flex-wrap gap-1">
                  <NuxtLink v-for="tag in tagsByCategory.copyright" :key="tag" :to="`/milkbooru?tags=${encodeURIComponent(tag)}`">
                    <UiAngularTag :label="tag" variant="blue" />
                  </NuxtLink>
                </div>
              </div>

              <div v-if="tagsByCategory.general.length" class="mb-4">
                <h4 class="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 font-mono">general</h4>
                <div class="flex flex-wrap gap-1">
                  <NuxtLink v-for="tag in tagsByCategory.general" :key="tag" :to="`/milkbooru?tags=${encodeURIComponent(tag)}`">
                    <UiAngularTag :label="tag" variant="gray" />
                  </NuxtLink>
                </div>
              </div>

              <div v-if="tagsByCategory.meta.length">
                <h4 class="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 font-mono">meta</h4>
                <div class="flex flex-wrap gap-1">
                  <NuxtLink v-for="tag in tagsByCategory.meta" :key="tag" :to="`/milkbooru?tags=${encodeURIComponent(tag)}`">
                    <UiAngularTag :label="tag" variant="gray" />
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Unified Details Panel -->
            <div class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5">
              <UiCornerBrackets size="sm" />

              <!-- Post Info -->
              <h3 class="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">post</h3>
              <div class="space-y-2 text-sm mb-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 font-mono text-xs">id</span>
                  <span class="font-mono text-xs">#{{ post.id }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 font-mono text-xs">rating</span>
                  <span
                    class="px-2 py-0.5 text-xs font-mono"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300': rating === 'General',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300': rating === 'Sensitive',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300': rating === 'Questionable',
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300': rating === 'Explicit'
                    }"
                  >{{ rating }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 font-mono text-xs">score</span>
                  <div class="flex items-center gap-2 font-mono text-xs">
                    <span class="text-green-500">↑{{ formattedScore.up }}</span>
                    <span class="text-red-500">↓{{ formattedScore.down }}</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 font-mono text-xs">status</span>
                  <span
                    class="px-2 py-0.5 text-xs font-mono"
                    :class="{
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300': status === 'Pending',
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300': status === 'Active',
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300': status === 'Deleted',
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300': status === 'Banned'
                    }"
                  >{{ status }}</span>
                </div>
              </div>

              <hr class="border-gray-200 dark:border-gray-800 mb-4">

              <!-- File Info -->
              <h3 class="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">file</h3>
              <div class="space-y-2 text-sm mb-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 font-mono text-xs">format</span>
                  <span class="font-mono text-xs uppercase">{{ post.file_ext }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 font-mono text-xs">size</span>
                  <span class="font-mono text-xs">{{ formattedFileSize }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 font-mono text-xs">dimensions</span>
                  <span class="font-mono text-xs">{{ dimensions }}</span>
                </div>
              </div>

              <hr class="border-gray-200 dark:border-gray-800 mb-4">

              <!-- Dates -->
              <h3 class="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">dates</h3>
              <div class="space-y-2 text-sm mb-4">
                <div class="flex justify-between items-start gap-4">
                  <span class="text-gray-500 dark:text-gray-400 font-mono text-xs shrink-0">uploaded</span>
                  <span class="font-mono text-xs text-right">{{ formatDate(post.created_at) }}</span>
                </div>
                <div v-if="post.updated_at !== post.created_at" class="flex justify-between items-start gap-4">
                  <span class="text-gray-500 dark:text-gray-400 font-mono text-xs shrink-0">updated</span>
                  <span class="font-mono text-xs text-right">{{ formatDate(post.updated_at) }}</span>
                </div>
              </div>

              <hr class="border-gray-200 dark:border-gray-800 mb-4">

              <!-- Links -->
              <h3 class="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">links</h3>
              <div class="space-y-2 text-sm">
                <div v-if="post.source" class="flex justify-between items-center gap-4">
                  <span class="text-gray-500 dark:text-gray-400 font-mono text-xs shrink-0">source</span>
                  <a
                    :href="post.source"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-deeppink-500 hover:text-deeppink-400 transition-colors font-mono text-xs truncate"
                    :title="post.source"
                  >{{ sourceHostname }}</a>
                </div>
                <div class="flex justify-between items-center gap-4">
                  <span class="text-gray-500 dark:text-gray-400 font-mono text-xs shrink-0">danbooru</span>
                  <a
                    :href="`https://danbooru.donmai.us/posts/${post.id}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-deeppink-500 hover:text-deeppink-400 transition-colors font-mono text-xs"
                  >posts/{{ post.id }}</a>
                </div>
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
const { setCookie, getCookie } = useCookies()
const postId = route.params.id

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

const sourceHostname = computed(() => {
  if (!post.value?.source) return ''
  try {
    return new URL(post.value.source).hostname
  } catch {
    return post.value.source
  }
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
  @apply bg-gray-100 dark:bg-gray-800/50 border-l-4 border-pink-400 p-3 my-2 italic;
}

:deep(.quote-content) {
  @apply text-gray-600 dark:text-gray-300 mb-2;
}

:deep(.quote-attribution) {
  @apply text-sm text-pink-600 dark:text-pink-400 font-medium not-italic;
}
</style>