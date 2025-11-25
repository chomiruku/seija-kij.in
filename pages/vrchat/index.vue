<template>
  <div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
      <div class="max-w-8xl mx-auto">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-300 via-purple-500 to-pink-600 dark:from-white dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent pb-3 mb-1">
            gallery
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            mug moment
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading">
          <!-- Toggle Buttons Skeleton -->
          <div class="flex justify-start mb-8">
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-2">
              <div class="flex gap-2">
                <div class="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse w-32 h-12"/>
                <div class="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse w-32 h-12"/>
              </div>
            </div>
          </div>

          <!-- Skeleton Month Headers and Grid -->
          <div v-for="i in 3" :key="`skeleton-${i}`" class="mb-8">
            <!-- Month Header Skeleton -->
            <div class="w-full flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl border border-purple-300/20 dark:border-purple-700/20 mb-4 animate-pulse">
              <div class="flex items-center">
                <div class="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded mr-3"/>
                <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"/>
              </div>
              <div class="bg-gray-300 dark:bg-gray-600 px-3 py-1 rounded-full w-8 h-6"/>
            </div>

            <!-- Images Grid Skeleton -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
              <div v-for="j in 10" :key="`skeleton-image-${i}-${j}`" class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 animate-pulse">
                <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"/>
                <div class="p-3">
                  <div class="flex justify-between items-center mb-2">
                    <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"/>
                    <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"/>
                  </div>
                  <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"/>
                </div>
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
            <p class="text-gray-800 dark:text-gray-400 mb-4">probably the server is dead</p>
            <UTooltip text="Retry loading gallery">
              <UButton
                  class="bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  @click="retryFetch"
              >
                Retry
              </UButton>
            </UTooltip>
          </div>
        </div>

        <!-- Gallery Content -->
        <template v-else-if="galleryData">
          <!-- Toggle Buttons -->
          <div class="mb-8">
            <UTabs v-model="activeView" :items="tabItems" color="deeppink" variant="link" size="xl"/>
          </div>

          <!-- Images Gallery -->
          <div v-if="activeView === 'images' && groupedImagesByYear.length" class="mb-8">
            <div v-for="(yearGroup, yearIndex) in groupedImagesByYear" :key="yearGroup.year">
              <!-- Year Separator -->
              <USeparator v-if="yearIndex > 0" :label="yearGroup.year" class="mb-8" color="deeppink" size="lg"/>
              
              <div v-for="(monthGroup, monthIndex) in yearGroup.months" :key="`${yearGroup.year}-${monthIndex}`" class="mb-8">
              <!-- Month Header -->
              <button
                  class="w-full flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl border border-purple-300/30 dark:border-purple-700/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 mb-4 cursor-pointer"
                  :class="{ 'shadow-lg': isMonthExpanded('images', `${yearGroup.year}-${monthGroup.month}`) }"
                  @click="toggleMonth('images', `${yearGroup.year}-${monthGroup.month}`)"
              >
                <div class="flex items-center">
                  <svg
                      class="w-5 h-5 mr-3 transition-transform duration-300"
                      :class="{ 'rotate-90': isMonthExpanded('images', `${yearGroup.year}-${monthGroup.month}`) }"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  <span class="text-lg font-semibold">{{ monthGroup.month }}</span>
                </div>
                <span class="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                  {{ monthGroup.items.length }}
                </span>
              </button>

              <!-- Images Grid -->
              <div
                  v-show="isMonthExpanded('images', `${yearGroup.year}-${monthGroup.month}`)"
                  class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 animate-fade-in-up"
              >
                <div
                    v-for="(image, imageIndex) in monthGroup.items"
                    :key="image.href"
                    class="group relative overflow-hidden rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    @click="openImageModal(getGlobalImageIndex(yearGroup.year, monthGroup.month, imageIndex))"
                >
                  <div class="aspect-square overflow-hidden rounded-lg">
                    <nuxt-img
                        :src="`https://samba.seija-kij.in/public/vrchat/gallery/images/${image.href}?th=300`"
                        :alt="`VRChat Screenshot ${image.href}`"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                    />
                  </div>

                  <!-- Overlay -->
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                    </svg>
                  </div>

                  <!-- Image Info -->
                  <div class="p-2 sm:p-3">
                    <div class="flex justify-between items-center text-xs">
                      <span class="text-gray-500 dark:text-gray-400">
                        {{ formatDate(image.ts * 1000) }}
                      </span>
                      <span class="text-gray-500 dark:text-gray-400">
                        {{ formatFileSize(image.sz) }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {{ image.tags?.res || 'Unknown resolution' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          <!-- Videos Gallery -->
          <div v-if="activeView === 'videos' && groupedVideosByYear.length" class="mb-8">
            <div v-for="(yearGroup, yearIndex) in groupedVideosByYear" :key="yearGroup.year">
              <!-- Year Separator -->
              <USeparator v-if="yearIndex > 0" :label="yearGroup.year" class="mb-8" color="deeppink" size="lg"/>
              
              <div v-for="(monthGroup, monthIndex) in yearGroup.months" :key="`${yearGroup.year}-${monthIndex}`" class="mb-8">
              <!-- Month Header -->
              <button
                  class="w-full flex justify-between items-center p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-pink-300/30 dark:border-pink-700/30 hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-300 mb-4"
                  :class="{ 'shadow-lg': isMonthExpanded('videos', `${yearGroup.year}-${monthGroup.month}`) }"
                  @click="toggleMonth('videos', `${yearGroup.year}-${monthGroup.month}`)"
              >
                <div class="flex items-center">
                  <svg
                      class="w-5 h-5 mr-3 transition-transform duration-300"
                      :class="{ 'rotate-90': isMonthExpanded('videos', `${yearGroup.year}-${monthGroup.month}`) }"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  <span class="text-lg font-semibold">{{ monthGroup.month }}</span>
                </div>
                <span class="bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
                  {{ monthGroup.items.length }}
                </span>
              </button>

              <!-- Videos Grid -->
              <div
                  v-show="isMonthExpanded('videos', `${yearGroup.year}-${monthGroup.month}`)"
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up"
              >
                <div
                    v-for="video in monthGroup.items"
                    :key="video.href"
                    class="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div class="aspect-video bg-black rounded-t-xl overflow-hidden">
                    <video
                        :src="`https://samba.seija-kij.in/public/vrchat/gallery/videos/${video.href}`"
                        controls
                        preload="metadata"
                        class="w-full h-full object-cover"
                        :poster="`https://samba.seija-kij.in/public/vrchat/gallery/videos/${video.href}#t=1`"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div class="p-4">
                    <h3 class="font-medium text-gray-900 dark:text-white mb-2 truncate">
                      {{ video.href.replace('.mp4', '') }}
                    </h3>
                    <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{{ formatDate(video.ts * 1000) }}</span>
                      <span>{{ formatFileSize(video.sz) }}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 mt-1">
                      <span>{{ video.tags?.res || 'Unknown' }}</span>
                      <span v-if="video.tags?.['.dur']">{{ formatDuration(video.tags['.dur']) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          <!-- No Content -->
          <div v-if="!hasContent" class="text-center py-12">
            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1l-.757 9.083A2 2 0 0118.247 18H5.753a2 2 0 01-1.996-1.917L3 7H2a1 1 0 01-1-1V5a1 1 0 011-1h4z"/>
              </svg>
              <p class="text-gray-500 dark:text-gray-400">No content available</p>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Image Modal -->
    <ClientOnly>
      <UModal
        v-model:open="showImageModal"
        fullscreen
        :ui="{
          body: 'flex-1 p-0 !p-0 sm:!p-0',
          content: 'bg-white/95 dark:bg-black/80 backdrop-blur-sm',
          title: 'text-sm sm:text-base',
          description: 'text-xs sm:text-sm',
        }"
        :close="{
          color: 'deeppink',
          variant: 'solid',
        }"
        :title="modalTitle"
        :description="modalDescription"
      >

        <template #body>
          <div class="relative w-full h-full flex items-center justify-center">
            <!-- Navigation buttons -->
            <UButton
                v-if="selectedImageIndex !== null && selectedImageIndex > 0"
                icon="i-lucide-chevron-left"
                color="gray"
                variant="soft"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                size="xl"
                :ui="{ rounded: 'rounded-full' }"
                @click.stop="navigateImage(-1)"
            />

            <UButton
                v-if="selectedImageIndex !== null && selectedImageIndex < allImages.length - 1"
                icon="i-lucide-chevron-right"
                color="gray"
                variant="soft"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                size="xl"
                :ui="{ rounded: 'rounded-full' }"
                @click.stop="navigateImage(1)"
            />

            <nuxt-img
                v-if="selectedImageIndex !== null && allImages[selectedImageIndex]"
                :src="`https://samba.seija-kij.in/public/vrchat/gallery/images/${allImages[selectedImageIndex].href}`"
                :alt="`VRChat Screenshot ${allImages[selectedImageIndex].href}`"
                class="max-w-full max-h-full object-contain"
                @click.stop
            />
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>

<script setup>
const title = 'VRChat Gallery'
const description = 'my vrc gallery :)'

// State
const galleryData = useState('vrchat-gallery', () => null)
const isLoading = ref(false)
const hasError = ref(false)
const activeView = ref('images')
const expandedMonths = ref({
  images: {},
  videos: {}
})
const showImageModal = ref(false)
const selectedImageIndex = ref(null)

// Non-blocking API calls
if (!galleryData.value) {
  isLoading.value = true
  hasError.value = false

  Promise.all([
    $fetch('https://samba.seija-kij.in/public/vrchat/gallery/images/?ls=raw'),
    $fetch('https://samba.seija-kij.in/public/vrchat/gallery/videos/?ls=raw')
  ]).then(([imagesResponse, videosResponse]) => {
    galleryData.value = {
      images: imagesResponse.files || [],
      videos: videosResponse.files || []
    }
    isLoading.value = false
  }).catch((error) => {
    console.error('Failed to fetch gallery data:', error)
    hasError.value = true
    galleryData.value = { images: [], videos: [] }
    isLoading.value = false
  })
}

// Tab items with counts
const tabItems = computed(() => [
  {
    label: `Images (${galleryData.value?.images?.length || 0})`,
    value: 'images',
    icon: 'i-lucide-image'
  },
  {
    label: `Videos (${galleryData.value?.videos?.length || 0})`,
    value: 'videos',
    icon: 'i-lucide-video'
  }
])

const retryFetch = () => {
  galleryData.value = null
  isLoading.value = true
  hasError.value = false

  Promise.all([
    $fetch('https://samba.seija-kij.in/public/vrchat/gallery/images/?ls=raw'),
    $fetch('https://samba.seija-kij.in/public/vrchat/gallery/videos/?ls=raw')
  ]).then(([imagesResponse, videosResponse]) => {
    galleryData.value = {
      images: imagesResponse.files || [],
      videos: videosResponse.files || []
    }
    isLoading.value = false
  }).catch((error) => {
    console.error('Failed to fetch gallery data:', error)
    hasError.value = true
    galleryData.value = { images: [], videos: [] }
    isLoading.value = false
  })
}

// Utility functions
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getMonthYear = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

const groupItemsByMonth = (items) => {
  const groups = items.reduce((acc, item) => {
    const monthYear = getMonthYear(item.ts * 1000)
    if (!acc[monthYear]) {
      acc[monthYear] = []
    }
    acc[monthYear].push(item)
    return acc
  }, {})

  return Object.entries(groups)
      .map(([month, items]) => ({
        month,
        items: items.sort((a, b) => b.ts - a.ts) // Sort by newest first
      }))
      .sort((a, b) => new Date(b.month + ' 1') - new Date(a.month + ' 1')) // Sort months by newest first
}

// Computed properties
const groupedImages = computed(() => {
  if (!galleryData.value?.images) return []
  return groupItemsByMonth(galleryData.value.images)
})

const groupedVideos = computed(() => {
  if (!galleryData.value?.videos) return []
  return groupItemsByMonth(galleryData.value.videos)
})

// Group months by years for separators
const groupedImagesByYear = computed(() => {
  const monthGroups = groupedImages.value
  const yearGroups = {}
  
  monthGroups.forEach(monthGroup => {
    const year = new Date(monthGroup.month + ' 1').getFullYear().toString()
    if (!yearGroups[year]) {
      yearGroups[year] = []
    }
    yearGroups[year].push(monthGroup)
  })
  
  return Object.entries(yearGroups)
    .map(([year, months]) => ({ year, months }))
    .sort((a, b) => parseInt(b.year) - parseInt(a.year)) // Sort by newest year first
})

const groupedVideosByYear = computed(() => {
  const monthGroups = groupedVideos.value
  const yearGroups = {}
  
  monthGroups.forEach(monthGroup => {
    const year = new Date(monthGroup.month + ' 1').getFullYear().toString()
    if (!yearGroups[year]) {
      yearGroups[year] = []
    }
    yearGroups[year].push(monthGroup)
  })
  
  return Object.entries(yearGroups)
    .map(([year, months]) => ({ year, months }))
    .sort((a, b) => parseInt(b.year) - parseInt(a.year)) // Sort by newest year first
})

const allImages = computed(() => {
  if (!galleryData.value?.images) return []
  return [...galleryData.value.images].sort((a, b) => b.ts - a.ts)
})

const hasContent = computed(() => {
  return (galleryData.value?.images?.length > 0) || (galleryData.value?.videos?.length > 0)
})

// Month expansion functions
const toggleMonth = (type, monthKey) => {
  if (!expandedMonths.value[type]) {
    expandedMonths.value[type] = {}
  }
  expandedMonths.value[type][monthKey] = !expandedMonths.value[type][monthKey]
}

const isMonthExpanded = (type, monthKey) => {
  return expandedMonths.value[type]?.[monthKey] ?? false
}

// Image modal functions
const getGlobalImageIndex = (year, month, imageIndex) => {
  // Find the target image from the specific year/month combination
  const targetYearGroup = groupedImagesByYear.value.find(yg => yg.year === year)
  if (!targetYearGroup) return -1

  const targetMonthGroup = targetYearGroup.months.find(mg => mg.month === month)
  if (!targetMonthGroup) return -1

  const targetImage = targetMonthGroup.items[imageIndex]
  if (!targetImage) return -1

  return allImages.value.findIndex(img => img.href === targetImage.href)
}

const openImageModal = (globalIndex) => {
  console.log('Opening modal with index:', globalIndex)
  console.log('Total images:', allImages.value.length)
  selectedImageIndex.value = globalIndex
  showImageModal.value = true
  console.log('Modal state:', showImageModal.value, 'Selected index:', selectedImageIndex.value)
}

const navigateImage = (direction) => {
  const newIndex = selectedImageIndex.value + direction
  if (newIndex >= 0 && newIndex < allImages.value.length) {
    selectedImageIndex.value = newIndex
  }
}

// Modal title and description computed properties
const modalTitle = computed(() => {
  if (selectedImageIndex.value === null || !allImages.value[selectedImageIndex.value]) {
    return ''
  }
  return allImages.value[selectedImageIndex.value].href
})

const modalDescription = computed(() => {
  if (selectedImageIndex.value === null || !allImages.value[selectedImageIndex.value]) {
    return ''
  }
  const image = allImages.value[selectedImageIndex.value]
  return `${formatDate(image.ts * 1000)} • ${image.tags?.res || 'Unknown resolution'} • ${formatFileSize(image.sz)}`
})

// Keyboard navigation
const handleKeydown = (event) => {
  if (!showImageModal.value) return

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      navigateImage(-1)
      break
    case 'ArrowRight':
      event.preventDefault()
      navigateImage(1)
      break
  }
}

// Keyboard navigation - Let UModal handle Escape key
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// SEO
useHead({
  title: `${title} | seija-kij.in`,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: 'vrchat, virtual reality, screenshots, videos, gallery, seija-kij.in' },
    { name: 'robots', content: 'index, follow' },

    { property: 'og:title', content: `${title} | seija-kij.in` },
    { property: 'og:description', content: description },
    { property: 'og:url', content: 'https://seija-kij.in/vrchat' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${title} | seija-kij.in` },
    { name: 'twitter:description', content: description }
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
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #8b5cf6, #ec4899);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #7c3aed, #db2777);
}
</style>