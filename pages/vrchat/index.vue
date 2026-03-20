<template>
  <div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
      <div class="max-w-8xl mx-auto">

        <!-- Header -->
        <div class="mb-10">
          <h1 class="navbar-brand text-5xl sm:text-7xl text-crimson-500 dark:text-crimson-500 leading-none mb-1">
            gallery
          </h1>
          <p class="font-mono text-xs text-deeppink-500/70 dark:text-deeppink-400/70 tracking-widest uppercase">
            mug moment
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading">
          <!-- Tab skeleton -->
          <div class="flex gap-px mb-8">
            <div class="bg-gray-200 dark:bg-gray-800 animate-pulse h-10 w-36"/>
            <div class="bg-gray-200 dark:bg-gray-800 animate-pulse h-10 w-36"/>
          </div>

          <!-- Skeleton Month Headers and Grid -->
          <div v-for="i in 3" :key="`skeleton-${i}`" class="mb-8">
            <div class="flex items-center gap-3 mb-4 animate-pulse">
              <div class="h-px flex-1 bg-gray-200 dark:bg-gray-800"/>
              <div class="h-4 bg-gray-200 dark:bg-gray-800 w-28"/>
              <div class="h-px flex-1 bg-gray-200 dark:bg-gray-800"/>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
              <div v-for="j in 10" :key="`skeleton-image-${i}-${j}`" class="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse"/>
            </div>
          </div>

          <p class="font-mono text-xs text-center text-gray-400 dark:text-gray-600 mt-6 tracking-widest">
            {{ loadingMessage }}
          </p>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="text-center">
          <div class="bg-crimson-500/10 border border-crimson-500/30 p-6 max-w-md mx-auto">
            <h1 class="font-display text-5xl uppercase text-crimson-500 mb-4">
              huh?
            </h1>
            <nuxt-img src="/seijaflustered.png" alt="seija-kij.in" class="mx-auto h-48 w-auto mb-4"/>
            <p class="font-mono text-xs text-gray-400 dark:text-gray-500 mb-2 tracking-wide">probably the server is dead</p>
            <button
              class="mt-4 clip-parallelogram font-mono text-xs uppercase tracking-widest px-6 py-3 bg-crimson-500 hover:bg-crimson-400 text-white transition-colors"
              @click="retryFetch"
            >
              retry
            </button>
          </div>
        </div>

        <!-- Gallery Content -->
        <template v-else-if="galleryData">
          <!-- Custom Tab Toggle -->
          <div class="mb-8 flex gap-px">
            <button
              class="clip-parallelogram font-mono text-xs uppercase tracking-widest px-6 py-3 transition-colors"
              :class="activeView === 'images'
                ? 'bg-crimson-500 text-white'
                : 'bg-white dark:bg-black border border-gray-200 dark:border-crimson-500 text-gray-500 dark:text-gray-400 hover:border-white hover:text-crimson-500'"
              @click="activeView = 'images'"
            >
              images
              <span class="ml-2 opacity-60">{{ galleryData?.images?.length || 0 }}</span>
            </button>
            <button
              class="clip-parallelogram font-mono text-xs uppercase tracking-widest px-6 py-3 transition-colors"
              :class="activeView === 'videos'
                ? 'bg-crimson-500 text-white'
                : 'bg-white dark:bg-black border border-gray-200 dark:border-crimson-500 text-gray-500 dark:text-gray-400 hover:border-white hover:text-crimson-500'"
              @click="activeView = 'videos'"
            >
              videos
              <span class="ml-2 opacity-60">{{ galleryData?.videos?.length || 0 }}</span>
            </button>
          </div>

          <!-- Images Gallery -->
          <div v-if="activeView === 'images' && groupedImagesByYear.length" class="mb-8">
            <div v-for="(yearGroup, yearIndex) in groupedImagesByYear" :key="yearGroup.year">
              <!-- Year Separator -->
              <div class="flex items-center gap-6 mb-6" :class="yearIndex > 0 ? 'mt-10' : ''">
                <span class="font-mono text-2xl font-bold text-crimson-500/40 tracking-widest tabular-nums shrink-0">{{ yearGroup.year }}</span>
                <div class="h-px flex-1 bg-crimson-500/30"/>
              </div>

              <div v-for="(monthGroup, monthIndex) in yearGroup.months" :key="`${yearGroup.year}-${monthIndex}`" class="mb-8">
                <!-- Month Header -->
                <button
                  class="w-full flex justify-between items-center px-4 py-3 border-l-2 border-crimson-500 bg-white dark:bg-black hover:bg-crimson-200 dark:hover:bg-crimson-900 transition-colors mb-4 cursor-pointer group"
                  @click="toggleMonth('images', `${yearGroup.year}-${monthGroup.month}`)"
                >
                  <div class="flex items-center gap-3">
                    <svg
                      class="w-3 h-3 text-crimson-500 transition-transform duration-200 shrink-0"
                      :class="{ 'rotate-90': isMonthExpanded('images', `${yearGroup.year}-${monthGroup.month}`) }"
                      fill="currentColor" viewBox="0 0 8 8"
                    >
                      <polygon points="0,0 8,4 0,8"/>
                    </svg>
                    <span class="font-mono text-xs uppercase tracking-widest text-gray-700 dark:text-gray-300">{{ monthGroup.month }}</span>
                  </div>
                  <span class="font-mono text-xs text-crimson-500/70 tabular-nums">
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
                    class="group relative aspect-square overflow-hidden cursor-pointer"
                    @click="openImageModal(getGlobalImageIndex(yearGroup.year, monthGroup.month, imageIndex))"
                  >
                    <div class="absolute inset-0 z-20 pointer-events-none transition-opacity duration-200 opacity-60 group-hover:opacity-100">
                      <UiCornerBrackets size="sm" />
                    </div>
                    <nuxt-img
                      :src="`https://samba.seija-kij.in/public/vrchat/gallery/images/${image.href}?th=w`"
                      :alt="`VRChat screenshot taken on ${formatDate(image.ts * 1000)}`"
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      format="webp"
                      :width="300"
                      :height="300"
                      fit="cover"
                    />

                    <!-- Hover overlay -->
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex flex-col justify-end p-2">
                      <div class="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0" style="transition: opacity 200ms, transform 200ms;">
                        <div class="font-mono text-xs text-white/90 tabular-nums">{{ formatDate(image.ts * 1000) }}</div>
                        <div class="font-mono text-xs text-white/50 mt-0.5">{{ image.tags?.res || '' }}</div>
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
              <div class="flex items-center gap-6 mb-6" :class="yearIndex > 0 ? 'mt-10' : ''">
                <span class="font-mono text-2xl font-bold text-crimson-500/40 tracking-widest tabular-nums shrink-0">{{ yearGroup.year }}</span>
                <div class="h-px flex-1 bg-crimson-500/30"/>
              </div>

              <div v-for="(monthGroup, monthIndex) in yearGroup.months" :key="`${yearGroup.year}-${monthIndex}`" class="mb-8">
                <!-- Month Header -->
                <button
                  class="w-full flex justify-between items-center px-4 py-3 border-l-2 border-crimson-500 bg-white/50 dark:bg-gray-900/50 hover:bg-crimson-500/5 transition-colors mb-4 cursor-pointer"
                  @click="toggleMonth('videos', `${yearGroup.year}-${monthGroup.month}`)"
                >
                  <div class="flex items-center gap-3">
                    <svg
                      class="w-3 h-3 text-crimson-500 transition-transform duration-200 shrink-0"
                      :class="{ 'rotate-90': isMonthExpanded('videos', `${yearGroup.year}-${monthGroup.month}`) }"
                      fill="currentColor" viewBox="0 0 8 8"
                    >
                      <polygon points="0,0 8,4 0,8"/>
                    </svg>
                    <span class="font-mono text-xs uppercase tracking-widest text-gray-700 dark:text-gray-300">{{ monthGroup.month }}</span>
                  </div>
                  <span class="font-mono text-xs text-crimson-500/70 tabular-nums">
                    {{ monthGroup.items.length }}
                  </span>
                </button>

                <!-- Videos Grid -->
                <div
                  v-show="isMonthExpanded('videos', `${yearGroup.year}-${monthGroup.month}`)"
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up"
                >
                  <div
                    v-for="video in monthGroup.items"
                    :key="video.href"
                    class="group relative border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-crimson-500/40 transition-colors"
                  >
                    <div class="absolute inset-0 z-20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                      <UiCornerBrackets size="sm" />
                    </div>
                    <div class="aspect-video bg-black overflow-hidden">
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

                    <!-- Metadata strip -->
                    <div class="border-t border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-900 flex justify-between items-center">
                      <div>
                        <div class="font-mono text-xs text-gray-700 dark:text-gray-300 truncate">{{ video.href.replace('.mp4', '') }}</div>
                        <div class="font-mono text-xs text-gray-400 dark:text-gray-600 mt-0.5">{{ formatDate(video.ts * 1000) }}</div>
                      </div>
                      <div class="font-mono text-xs text-gray-400 dark:text-gray-600 text-right shrink-0 ml-3">
                        <div>{{ formatFileSize(video.sz) }}</div>
                        <div v-if="video.tags?.['.dur']">{{ formatDuration(video.tags['.dur']) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Content -->
          <div v-if="!hasContent" class="py-12">
            <div class="border border-gray-200 dark:border-gray-800 p-8 max-w-md">
              <p class="font-mono text-xs text-gray-400 dark:text-gray-600 tracking-wide">nothing here yet</p>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Image Modal — custom fullscreen overlay -->
    <ClientOnly>
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="showImageModal"
            class="fixed inset-0 z-200 bg-black/95 flex flex-col"
            @click.self="showImageModal = false"
          >
            <!-- Top bar -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
              <div class="font-mono text-xs text-white/50 tracking-wide truncate max-w-[60vw]">
                {{ modalTitle }}
              </div>
              <div class="flex items-center gap-4">
                <span class="font-mono text-xs text-white/30 tabular-nums">
                  {{ selectedImageIndex !== null ? selectedImageIndex + 1 : 0 }} / {{ allImages.length }}
                </span>
                <button
                  class="font-mono text-xs text-white/50 hover:text-crimson-400 transition-colors tracking-widest uppercase"
                  @click="showImageModal = false"
                >
                  close
                </button>
              </div>
            </div>

            <!-- Image area -->
            <div class="relative flex-1 flex items-center justify-center overflow-hidden" @click.self="showImageModal = false">
              <!-- Prev -->
              <button
                v-if="selectedImageIndex !== null && selectedImageIndex > 0"
                class="absolute left-4 top-1/2 -translate-y-1/2 z-10 clip-parallelogram px-4 py-3 bg-white/5 hover:bg-crimson-500/30 border border-white/10 hover:border-crimson-500/50 text-white/60 hover:text-white transition-all font-mono text-xs uppercase tracking-widest"
                @click.stop="navigateImage(-1)"
              >
                ← prev
              </button>

              <nuxt-img
                v-if="selectedImageIndex !== null && allImages[selectedImageIndex]"
                :src="`https://samba.seija-kij.in/public/vrchat/gallery/images/${allImages[selectedImageIndex].href}`"
                :alt="`VRChat screenshot - ${allImages[selectedImageIndex].tags?.res || ''} - ${formatDate(allImages[selectedImageIndex].ts * 1000)}`"
                class="max-w-full max-h-full object-contain"
                format="webp"
                quality="90"
                @click.stop
              />

              <!-- Next -->
              <button
                v-if="selectedImageIndex !== null && selectedImageIndex < allImages.length - 1"
                class="absolute right-4 top-1/2 -translate-y-1/2 z-10 clip-parallelogram px-4 py-3 bg-white/5 hover:bg-crimson-500/30 border border-white/10 hover:border-crimson-500/50 text-white/60 hover:text-white transition-all font-mono text-xs uppercase tracking-widest"
                @click.stop="navigateImage(1)"
              >
                next →
              </button>
            </div>

            <!-- Bottom metadata strip -->
            <div class="flex items-center gap-6 px-4 py-3 border-t border-white/10 shrink-0">
              <span class="font-mono text-xs text-white/30">{{ modalDescription }}</span>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup>
const title = 'VRChat Gallery'
const description = 'my vrc gallery :)'

// Loading flavor messages — rotates through on mount
const loadingMessages = [
  'indexing screenshots...',
  'loading the mug moments...',
  'dusting off the archives...',
  'fetching pixels from the void...',
  'syncing with the samba...',
]
const loadingMessage = ref(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])

// State
const activeView = ref('images')
const expandedMonths = ref({
  images: {},
  videos: {}
})
const showImageModal = ref(false)
const selectedImageIndex = ref(null)

// Fetch gallery data with useFetch (client-side)
const { data: imagesResponse, status: imagesStatus, refresh: refreshImages } = useFetch('https://samba.seija-kij.in/public/vrchat/gallery/images/?ls=raw', {
  default: () => null,
  server: false,
})
const { data: videosResponse, status: videosStatus, refresh: refreshVideos } = useFetch('https://samba.seija-kij.in/public/vrchat/gallery/videos/?ls=raw', {
  default: () => null,
  server: false,
})

const galleryData = computed(() => {
  if (!imagesResponse.value && !videosResponse.value) return null
  return {
    images: imagesResponse.value?.files || [],
    videos: videosResponse.value?.files || [],
  }
})
const isLoading = computed(() => imagesStatus.value === 'idle' || imagesStatus.value === 'pending' || videosStatus.value === 'idle' || videosStatus.value === 'pending')
const hasError = computed(() => imagesStatus.value === 'error' || videosStatus.value === 'error')

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

const retryFetch = () => {
  refreshImages()
  refreshVideos()
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
        items: items.sort((a, b) => b.ts - a.ts)
      }))
      .sort((a, b) => new Date(b.month + ' 1') - new Date(a.month + ' 1'))
}

const groupedImages = computed(() => {
  if (!galleryData.value?.images) return []
  return groupItemsByMonth(galleryData.value.images)
})

const groupedVideos = computed(() => {
  if (!galleryData.value?.videos) return []
  return groupItemsByMonth(galleryData.value.videos)
})

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
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
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
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
})

const allImages = computed(() => {
  if (!galleryData.value?.images) return []
  return [...galleryData.value.images].sort((a, b) => b.ts - a.ts)
})

const hasContent = computed(() => {
  return (galleryData.value?.images?.length > 0) || (galleryData.value?.videos?.length > 0)
})

// Auto-expand the most recent month when data loads
watch(groupedImagesByYear, (groups) => {
  if (groups.length && !Object.keys(expandedMonths.value.images).length) {
    const firstMonthKey = `${groups[0].year}-${groups[0].months[0].month}`
    expandedMonths.value.images[firstMonthKey] = true
  }
}, { immediate: true })

watch(groupedVideosByYear, (groups) => {
  if (groups.length && !Object.keys(expandedMonths.value.videos).length) {
    const firstMonthKey = `${groups[0].year}-${groups[0].months[0].month}`
    expandedMonths.value.videos[firstMonthKey] = true
  }
}, { immediate: true })

const toggleMonth = (type, monthKey) => {
  if (!expandedMonths.value[type]) {
    expandedMonths.value[type] = {}
  }
  expandedMonths.value[type][monthKey] = !expandedMonths.value[type][monthKey]
}

const isMonthExpanded = (type, monthKey) => {
  return expandedMonths.value[type]?.[monthKey] ?? false
}

const getGlobalImageIndex = (year, month, imageIndex) => {
  const targetYearGroup = groupedImagesByYear.value.find(yg => yg.year === year)
  if (!targetYearGroup) return -1

  const targetMonthGroup = targetYearGroup.months.find(mg => mg.month === month)
  if (!targetMonthGroup) return -1

  const targetImage = targetMonthGroup.items[imageIndex]
  if (!targetImage) return -1

  return allImages.value.findIndex(img => img.href === targetImage.href)
}

const openImageModal = (globalIndex) => {
  selectedImageIndex.value = globalIndex
  showImageModal.value = true
}

const navigateImage = (direction) => {
  const newIndex = selectedImageIndex.value + direction
  if (newIndex >= 0 && newIndex < allImages.value.length) {
    selectedImageIndex.value = newIndex
  }
}

const modalTitle = computed(() => {
  if (selectedImageIndex.value === null || !allImages.value[selectedImageIndex.value]) return ''
  return allImages.value[selectedImageIndex.value].href
})

const modalDescription = computed(() => {
  if (selectedImageIndex.value === null || !allImages.value[selectedImageIndex.value]) return ''
  const image = allImages.value[selectedImageIndex.value]
  return `${formatDate(image.ts * 1000)} · ${image.tags?.res || '?'} · ${formatFileSize(image.sz)}`
})

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
    case 'Escape':
      showImageModal.value = false
      break
  }
}

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
  htmlAttrs: [{ lang: 'en' }]
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
