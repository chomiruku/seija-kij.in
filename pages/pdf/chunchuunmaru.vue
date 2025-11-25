<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg mb-6">
      <h1 class="text-4xl font-bold p-6">ChunChuunMaru</h1>
      <p class="text-base px-6 pb-6">
        This page will get updated with more info as more people who have interacted with
        ChunChuunMaru come forward.
      </p>
    </div>

    <!-- Links Section -->
    <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6">
      <div class="flex flex-wrap gap-3">
        <a
          class="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          href="https://vrchat.com/home/user/usr_09503244-0cb1-4822-a356-26b01b21f621"
          target="_blank"
          rel="noopener noreferrer"
        >
          VRChat account
        </a>
        <a
          class="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          href="https://vrc.group/WECHUN.6951"
          target="_blank"
          rel="noopener noreferrer"
        >
          VRChat Group
        </a>
        <a
          class="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          href="https://vrc.group/HAPPYS.7607"
          target="_blank"
          rel="noopener noreferrer"
        >
          VRChat Group #2
        </a>
        <a
          class="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          href="https://steamcommunity.com/profiles/76561198186229289"
          target="_blank"
          rel="noopener noreferrer"
        >
          Steam account
        </a>
      </div>
    </div>

    <!-- Section 1: Admission -->
    <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6">
      <p class="text-lg mb-6">
        On the 21st of May 2024 GMT+0800 (Singapore Standard Time)<br>
        ChunChuunMaru would admit to receiving Erotic Role-Play from a minor who was 14 years at the time.
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        <div
          v-for="(image, index) in admissionImages"
          :key="image.src"
          class="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
          @click="openImageModal(index)"
        >
          <div class="aspect-square overflow-hidden">
            <nuxt-img
              :src="image.src"
              :alt="image.alt"
              loading="lazy"
              format="webp"
              quality="60"
              :width="300"
              :height="300"
              fit="cover"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: Video Evidence -->
    <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6">
      <p class="text-lg mb-6">
        Below is the interaction that was recorded when someone else in the room happened
        to be live-streaming.
      </p>
      <div>
        <video
          src="/pdf/chun/confession.mp4"
          controls
          preload="metadata"
          class="w-full rounded border border-gray-300 dark:border-gray-600"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>

    <!-- Section 3: Private Confrontation -->
    <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6">
      <p class="text-lg mb-6">
        Later he was confronted in private and asked if he knew that she was 14, he would
        reply with a nod and later say "it's not like it happened irl"
      </p>
      <div
        class="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl inline-block max-w-sm"
        @click="openImageModal(3)"
      >
        <nuxt-img
          src="/pdf/chun/profile1.png"
          alt="profile1"
          loading="lazy"
          format="webp"
          quality="60"
          :width="300"
          :height="442"
          fit="cover"
          class="w-full h-auto transition-transform duration-300 group-hover:scale-110"
        />
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Section 4: Pattern of Behavior -->
    <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6">
      <p class="text-lg">
        ChunChuunMaru regularly jokes about being a lolicon around friends so much that
        they think "oh he's probably an actual pedophile btw" in a joking manner, downplaying his actual nature.
      </p>
    </div>

    <!-- Section 5: Friend Testimony -->
    <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6">
      <p class="text-lg mb-6">
        This is a transcript of someone who was friends with Chun, confirming that he is a
        problem and knows what he's doing.
      </p>
      <div
        class="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl inline-block max-w-2xl"
        @click="openImageModal(4)"
      >
        <nuxt-img
          src="/pdf/chun/chun4.png"
          alt="chun4"
          loading="lazy"
          format="webp"
          quality="60"
          :width="600"
          :height="441"
          fit="cover"
          class="w-full h-auto transition-transform duration-300 group-hover:scale-110"
        />
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Section 6: Testimony from others -->
    <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6">
      <p class="text-lg mb-6">
        This is testimony from someone else who was around him recorded by another person.
      </p>
      <div>
        <video
          src="/pdf/chun/Vrchat - 2025-03-27 22-53-15-1.mp4"
          controls
          preload="metadata"
          class="w-full rounded border border-gray-300 dark:border-gray-600"
        >
          Your browser does not support the video tag.
        </video>
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
          color: 'red',
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
              :src="allImages[selectedImageIndex].src"
              :alt="allImages[selectedImageIndex].alt"
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
// Image data
const admissionImages = [
  { src: '/pdf/chun/chun1.png', alt: 'chun1', description: 'Admission screenshot 1' },
  { src: '/pdf/chun/chun2.png', alt: 'chun2', description: 'Admission screenshot 2' },
  { src: '/pdf/chun/chun3.png', alt: 'chun3', description: 'Admission screenshot 3' }
]

const allImages = [
  ...admissionImages,
  { src: '/pdf/chun/profile1.png', alt: 'profile1', description: 'Private confrontation' },
  { src: '/pdf/chun/chun4.png', alt: 'chun4', description: 'Friend testimony transcript' }
]

// Modal state
const showImageModal = ref(false)
const selectedImageIndex = ref(null)

// Modal functions
const openImageModal = (index) => {
  selectedImageIndex.value = index
  showImageModal.value = true
}

const navigateImage = (direction) => {
  const newIndex = selectedImageIndex.value + direction
  if (newIndex >= 0 && newIndex < allImages.length) {
    selectedImageIndex.value = newIndex
  }
}

// Modal title and description
const modalTitle = computed(() => {
  if (selectedImageIndex.value === null || !allImages[selectedImageIndex.value]) {
    return ''
  }
  return allImages[selectedImageIndex.value].alt
})

const modalDescription = computed(() => {
  if (selectedImageIndex.value === null || !allImages[selectedImageIndex.value]) {
    return ''
  }
  return allImages[selectedImageIndex.value].description
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

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// SEO
useHead({
  title: 'ChunChuunMaru - PDF Tracker - seija-kij.in',
  meta: [
    { name: 'description', content: 'Information about ChunChuunMaru' }
  ]
})
</script>