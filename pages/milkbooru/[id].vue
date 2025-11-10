<template>
  <div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto border border-gray-200/50 dark:border-gray-700/50">
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
        <div class="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-6 max-w-md mx-auto">
          <h1 class="text-4xl font-bold mb-6">
            huh?
          </h1>
          <nuxt-img src="/seijaflustered.png" alt="seija-kij.in" class="mx-auto h-48 w-auto mb-2"/>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Post not found</h3>
          <p class="text-gray-800 dark:text-gray-400 mb-4">This post might not exist or the booru is down</p>
          <div class="flex gap-3 justify-center">
            <button
              class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors text-white"
              @click="retryFetch"
            >
              Retry
            </button>
            <NuxtLink
              to="/milkbooru"
              class="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-white"
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
            <!-- Main Media -->
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-6">
              <!-- Quality Slider for Images -->
              <div v-if="!isVideo && post.media_asset?.variants?.length > 1" class="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Image Quality</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getCurrentVariantInfo() }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-gray-500">Low</span>
                  <input
                    v-model.number="selectedVariantIndex"
                    type="range"
                    :min="0"
                    :max="post.media_asset.variants.length - 1"
                    class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 appearance-none slider"
                    @input="onVariantChange"
                  >
                  <span class="text-xs text-gray-500">High</span>
                </div>
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
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <!-- Clickable Header -->
              <div 
                class="flex justify-between items-center cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/20 rounded-lg p-2 -m-2 transition-colors"
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
                <div v-if="comments.length === 0" class="text-center py-8">
                  <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p class="text-gray-500 dark:text-gray-400">No comments yet.</p>
                  <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Be the first to share your thoughts!</p>
                </div>

                <!-- Comments List -->
                <div v-else class="space-y-4">
                  <div 
                    v-for="comment in comments" 
                    :key="comment.id" 
                    class="bg-gray-50/80 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200/50 dark:border-gray-600/30"
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
                        class="text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {{ comment.score > 0 ? '+' : '' }}{{ comment.score }}
                      </span>
                    </div>
                    
                    <!-- Comment Body with Quote Parsing -->
                    <div class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      <div v-html="parseCommentBody(comment.body)"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Details Sidebar -->
          <div class="space-y-6">
            <!-- Tags -->
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 class="text-lg font-bold mb-4">Tags</h3>
              
              <!-- Artists -->
              <div v-if="tagsByCategory.artist.length" class="mb-4">
                <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Artists</h4>
                <div class="flex flex-wrap gap-1">
                  <NuxtLink
                    v-for="tag in tagsByCategory.artist"
                    :key="tag"
                    :to="`/milkbooru?tags=${encodeURIComponent(tag)}`"
                    class="inline-block px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors cursor-pointer"
                  >
                    {{ tag }}
                  </NuxtLink>
                </div>
              </div>

              <!-- Characters -->
              <div v-if="tagsByCategory.character.length" class="mb-4">
                <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Characters</h4>
                <div class="flex flex-wrap gap-1">
                  <NuxtLink
                    v-for="tag in tagsByCategory.character"
                    :key="tag"
                    :to="`/milkbooru?tags=${encodeURIComponent(tag)}`"
                    class="inline-block px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors cursor-pointer"
                  >
                    {{ tag }}
                  </NuxtLink>
                </div>
              </div>

              <!-- Copyrights -->
              <div v-if="tagsByCategory.copyright.length" class="mb-4">
                <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Copyrights</h4>
                <div class="flex flex-wrap gap-1">
                  <NuxtLink
                    v-for="tag in tagsByCategory.copyright"
                    :key="tag"
                    :to="`/milkbooru?tags=${encodeURIComponent(tag)}`"
                    class="inline-block px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors cursor-pointer"
                  >
                    {{ tag }}
                  </NuxtLink>
                </div>
              </div>

              <!-- General -->
              <div v-if="tagsByCategory.general.length" class="mb-4">
                <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">General</h4>
                <div class="flex flex-wrap gap-1">
                  <NuxtLink
                    v-for="tag in tagsByCategory.general"
                    :key="tag"
                    :to="`/milkbooru?tags=${encodeURIComponent(tag)}`"
                    class="inline-block px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded transition-colors cursor-pointer"
                  >
                    {{ tag }}
                  </NuxtLink>
                </div>
              </div>

              <!-- Meta -->
              <div v-if="tagsByCategory.meta.length">
                <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Meta</h4>
                <div class="flex flex-wrap gap-1">
                  <NuxtLink
                    v-for="tag in tagsByCategory.meta"
                    :key="tag"
                    :to="`/milkbooru?tags=${encodeURIComponent(tag)}`"
                    class="inline-block px-2 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-xs rounded transition-colors cursor-pointer"
                  >
                    {{ tag }}
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Post Information -->
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 class="text-lg font-bold mb-4">Post Information</h3>
              
              <div class="space-y-3 text-sm">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">ID:</span>
                  <span class="font-mono">#{{ post.id }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">Rating:</span>
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300': rating === 'General',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300': rating === 'Sensitive',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300': rating === 'Questionable',
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300': rating === 'Explicit'
                    }"
                  >
                    {{ rating }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">Score:</span>
                  <div class="flex items-center gap-2">
                    <span class="text-green-600">↑{{ formattedScore.up }}</span>
                    <span class="text-gray-400">/</span>
                    <span class="text-red-600">↓{{ formattedScore.down }}</span>
                    <span class="ml-2 font-medium">({{ formattedScore.total }})</span>
                  </div>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">Status:</span>
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium"
                    :class="{
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300': status === 'Pending',
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300': status === 'Active',
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300': status === 'Deleted',
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300': status === 'Banned'
                    }"
                  >
                    {{ status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- File Details -->
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 class="text-lg font-bold mb-4">File Details</h3>
              
              <div class="space-y-3 text-sm">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">Format:</span>
                  <span class="font-mono uppercase">{{ post.file_ext }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">Size:</span>
                  <span>{{ formattedFileSize }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">Dimensions:</span>
                  <span class="font-mono">{{ dimensions }}</span>
                </div>
              </div>
            </div>

            <!-- Links -->
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 class="text-lg font-bold mb-4">Links</h3>
              
              <div class="space-y-3 text-sm">
                <div v-if="post.source">
                  <span class="text-gray-600 dark:text-gray-300 block mb-1">Source:</span>
                  <a
                    :href="post.source"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-pink-600 hover:text-pink-700 transition-colors break-all"
                  >
                    {{ post.source }}
                  </a>
                </div>
                
                <div>
                  <span class="text-gray-600 dark:text-gray-300 block mb-1">Danbooru:</span>
                  <a
                    :href="`https://danbooru.donmai.us/posts/${post.id}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    danbooru.donmai.us/posts/{{ post.id }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Upload Info -->
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 class="text-lg font-bold mb-4">Upload Information</h3>
              
              <div class="space-y-3 text-sm">
                <div>
                  <span class="text-gray-600 dark:text-gray-300 block mb-1">Uploaded:</span>
                  <span>{{ formatDate(post.created_at) }}</span>
                </div>
                
                <div v-if="post.updated_at !== post.created_at">
                  <span class="text-gray-600 dark:text-gray-300 block mb-1">Updated:</span>
                  <span>{{ formatDate(post.updated_at) }}</span>
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
const selectedVariantIndex = ref(2) // Default to middle quality
const commentsExpanded = ref(false) // Comments collapsed by default
const qualityToastShown = ref(false)
const isMounted = ref(false)

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

const formattedScore = computed(() => {
  return {
    up: post.value?.up_score || 0,
    down: post.value?.down_score || 0,
    total: (post.value?.up_score || 0) - (post.value?.down_score || 0)
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

// Quality toast methods
const toast = useToast()

const checkAndShowQualityToast = () => {
  if (!isMounted.value) return // Don't show toast if component is unmounted
  if (qualityToastShown.value) return
  if (!post.value?.media_asset?.variants?.length) return
  if (isVideo.value) return // Only show for images
  
  // Check if we've shown the quality toast recently (within 30 minutes)
  const lastToastTime = getCookie('milkbooru-quality-toast-shown')
  if (lastToastTime) {
    const timeSinceLastToast = Date.now() - parseInt(lastToastTime)
    const thirtyMinutesInMs = 30 * 60 * 1000 // 30 minutes in milliseconds
    if (timeSinceLastToast < thirtyMinutesInMs) {
      return // Don't show toast if it was shown within the last 30 minutes
    }
  }
  
  const maxQualityIndex = post.value.media_asset.variants.length - 1
  const currentQuality = selectedVariantIndex.value
  
  // Show toast if user is not at the highest quality
  if (currentQuality < maxQualityIndex) {
    toast.add({
      title: 'Increase image quality',
      description: 'You can view this image in higher resolution using the slider above.',
      icon: 'i-lucide-settings-2',
      color: 'royalblue',
      timeout: 8000
    })
    qualityToastShown.value = true
    
    // Set cookie with current timestamp to track when toast was last shown
    setCookie('milkbooru-quality-toast-shown', Date.now().toString(), 1) // 1 day expiry (cleanup)
  }
}

const _upgradeToHighestQuality = () => {
  if (!post.value?.media_asset?.variants?.length) return
  selectedVariantIndex.value = post.value.media_asset.variants.length - 1
  onVariantChange()
}

// Methods
const _getImageUrl = (post) => {
  if (post.is_banned) return '/banned.jpg'
  if (!post.media_asset?.variants?.length) return '/placeholder.jpg'
  
  // Use the largest available variant for the detail view (last variant is typically highest quality)
  const variant = post.media_asset.variants[post.media_asset.variants.length - 1] || post.media_asset.variants[0]
  return variant?.url || '/placeholder.jpg'
}

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
  fetchPost()
  fetchComments()
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

const getCurrentVariantInfo = () => {
  if (!post.value?.media_asset?.variants?.length) return 'N/A'
  
  const variants = post.value.media_asset.variants
  const safeIndex = Math.min(selectedVariantIndex.value, variants.length - 1)
  const variant = variants[safeIndex]
  
  if (!variant) return 'N/A'
  
  return `${variant.width}×${variant.height} (${variant.file_ext?.toUpperCase() || 'Unknown'})`
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

// Comment parsing and styling methods
const _getInitials = (name) => {
  if (!name || name === 'Anonymous') return '?'
  return name.charAt(0).toUpperCase()
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

// Cookie management
const setCookie = (name, value, days) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const getCookie = (name) => {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// Initial fetch
onMounted(async () => {
  isMounted.value = true
  await Promise.all([fetchPost(), fetchComments()])
  
  // Set up quality toast timer
  setTimeout(() => {
    checkAndShowQualityToast()
  }, 5000)
})

// Cleanup on unmount
onBeforeUnmount(() => {
  isMounted.value = false
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
/* Custom slider styling */
.slider {
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899, #be185d);
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #ec4899, #be185d);
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.slider::-webkit-slider-track {
  background: linear-gradient(90deg, #6b7280, #ec4899);
  border-radius: 4px;
}

.slider::-moz-range-track {
  background: linear-gradient(90deg, #6b7280, #ec4899);
  border-radius: 4px;
}

/* Dark mode adjustments */
.dark .slider::-webkit-slider-thumb {
  border-color: #374151;
}

.dark .slider::-moz-range-thumb {
  border-color: #374151;
}

/* Comment quote styling */
:deep(.comment-quote) {
  @apply bg-gray-100 dark:bg-gray-800/50 border-l-4 border-pink-400 rounded-r-lg p-3 my-2 italic;
}

:deep(.quote-content) {
  @apply text-gray-600 dark:text-gray-300 mb-2;
}

:deep(.quote-attribution) {
  @apply text-sm text-pink-600 dark:text-pink-400 font-medium not-italic;
}
</style>