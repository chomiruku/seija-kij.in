<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
    <NuxtLink
      v-for="(post, index) in posts"
      :key="post.id"
      :to="getPostRoute(post)"
      class="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 cursor-pointer transition-colors duration-150 hover:border-crimson-500/50 dark:hover:border-crimson-500/50 animate-fade-in-up block"
      :style="`animation-delay: ${index * 50}ms`"
    >
      <UiCornerBrackets size="sm" />
      <div class="aspect-square overflow-hidden relative">
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
            <p class="font-mono text-xs font-bold mb-1 text-crimson-400 bg-black w-full py-1 uppercase tracking-widest">
              blacklisted
            </p>
            <p class="font-mono text-xs text-crimson-500/70 w-full">
              {{ blacklistInfo[post.id]?.matchedTag }}
            </p>
            <p class="font-mono text-xs text-gray-500 mt-1">
              click to view
            </p>
          </div>
        </div>
      </div>

      <!-- Animation indicator -->
      <div
        v-if="isAnimated(post)"
        class="absolute top-2 right-2 bg-black/70 text-white px-1.5 py-0.5 z-10 font-mono text-xs uppercase tracking-widest text-crimson-400"
      >
        ▶
      </div>

      <!-- Post Info -->
      <div class="px-3 py-2 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div class="font-mono text-xs text-gray-700 dark:text-gray-300 truncate">
          {{ post.tag_string_artist || 'unknown' }}
        </div>
        <div class="font-mono text-xs text-gray-400 dark:text-gray-600 shrink-0 ml-2 tabular-nums">
          {{ post.image_width }}×{{ post.image_height }}
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
