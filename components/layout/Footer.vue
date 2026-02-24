<template>
  <footer class="border-t border-red-500 bg-gray-50/80 dark:bg-gray-800/80">
    <div class="px-4 py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <!-- Theme Toggle -->
        <div class="text-center md:text-left">
          <ClientOnly>
            <UTooltip :text="`Switch to ${isDark ? 'light' : 'dark'} mode`">
              <UButton
                color="deeppink"
                class="cursor-pointer text-white"
                size="xl"
                :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
                variant="solid"
                :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
                @click="switchTheme"
              />
            </UTooltip>
          </ClientOnly>
        </div>

        <!-- Quote -->
        <div class="text-center">
          <figure
            class="cursor-pointer hover:opacity-80 transition-opacity"
            role="button"
            tabindex="0"
            aria-label="Play audio: We are japanese goblin"
            @click="playAudio"
            @keydown.enter="playAudio"
            @keydown.space.prevent="playAudio"
          >
            <blockquote class="text-sm italic">
              <p>"we are japanese goblin"</p>
              <audio ref="audioRef" preload="none" aria-label="Audio quote">
                <source src="/liltihjapanesegoblin_01.ogg" type="audio/ogg">
              </audio>
            </blockquote>
            <figcaption class="text-xs text-gray-600 dark:text-gray-400">
              Lilith in the <cite>Home Depot</cite>
            </figcaption>
          </figure>
        </div>

        <!-- Disclaimer -->
        <div class="text-center md:text-right text-sm text-gray-500 dark:text-gray-400">
          For any complaints, we do not care.
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const colorMode = useColorMode()
const audioRef = ref(null)

const isDark = computed(() => colorMode.value === 'dark')

const switchTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const playAudio = () => {
  if (audioRef.value) {
    audioRef.value.currentTime = 0
    audioRef.value.play().catch(() => {
      // Handle audio play errors silently
    })
  }
}
</script>
