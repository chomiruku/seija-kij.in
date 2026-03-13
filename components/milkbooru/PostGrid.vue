<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
    <NuxtLink
      v-for="(post, index) in posts"
      :key="post.id"
      :to="getPostRoute(post)"
      class="group relative overflow-hidden rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 hover:border-pink-300 dark:hover:border-pink-600 animate-fade-in-up block"
      :style="`animation-delay: ${index * 50}ms`"
    >
      <div class="aspect-square overflow-hidden rounded-lg relative">
        <nuxt-img
          :src="getImageUrl(post)"
          :alt="post.tag_string_artist || 'Booru post'"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          format="webp"
          :quality="60"
          :width="300"
          :height="300"
          fit="cover"
        />

        <!-- Blacklist overlay -->
        <div
          v-if="blacklistInfo && blacklistInfo[post.id]?.isBlacklisted"
          class="absolute inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center"
        >
          <div class="text-center text-white w-full">
            <p class="text-sm font-extrabold mb-1 text-red-500 bg-black w-full py-1">
              Blacklisted
            </p>
            <p class="text-xs text-red-500 w-full">
              Contains: {{ blacklistInfo[post.id]?.matchedTag }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              Click to view
            </p>
          </div>
        </div>
      </div>

      <!-- Animation indicator -->
      <div
        v-if="isAnimated(post)"
        class="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 z-10"
      >
        <UIcon name="i-heroicons-play" class="w-4 h-4" />
      </div>

      <!-- Post Info -->
      <div class="p-3">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {{ post.tag_string_artist || 'Unknown artist' }}
        </div>
        <div class="text-xs text-gray-400 dark:text-gray-500">
          {{ post.image_width }}x{{ post.image_height }}
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Post, BlacklistInfo } from '~/types/booru'

interface Props {
  posts: Post[]
  blacklistInfo?: Record<number, BlacklistInfo>
}

defineProps<Props>()

/**
 * Gets the image URL for a post, handling banned posts and missing media
 */
const getImageUrl = (post: Post): string => {
  if (post.is_banned) return '/banned.jpg'
  if (!post.media_asset?.variants?.length) return '/placeholder.jpg'

  // Use preview variant (index 2) or fallback to first variant
  const variant = post.media_asset.variants[2] || post.media_asset.variants[0]
  return variant?.url || '/placeholder.jpg'
}

/**
 * Generates the route for a post detail page
 */
const getPostRoute = (post: Post): string => {
  return `/milkbooru/${post.id}`
}

/**
 * Checks if a post contains animated content
 */
const isAnimated = (post: Post): boolean => {
  return ['gif', 'webm', 'mp4', 'zip'].includes(post.file_ext)
}
</script>
