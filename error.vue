<!-- error.vue -->
<template>
  <NuxtLayout>
    <div class="">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div class="text-center">
          <div class=" bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">

            <h1 v-if="error.statusCode === 404" class="text-4xl font-bold mb-6">
              huh?
            </h1>
            <h1 v-else class="text-4xl font-bold mb-6">
              oops
            </h1>

            <NuxtImg
                src="/seijaflustered.png"
                class="mx-auto mb-6 w-32 sm:w-40 md:w-48 lg:w-56 h-auto rounded-lg shadow-lg"
            />
            
            <p v-if="error.statusCode === 404" class="text-lg mb-8">
              what the hell is
              <code class="bg-white/70 dark:bg-white/20 px-3 py-1 rounded text-pink-500 dark:text-pink-300 font-mono">
                {{ route.path }}
              </code>
            </p>
            <p v-else class="text-lg mb-8">
              {{ error }}
            </p>

            <UButton
                class="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                @click="handleError"
            >
              go back lol
            </UButton>
            
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
defineProps({
  error: {
    type: Object,
    required: true
  }
})
const route = useRoute()

const handleError = () => clearError({ redirect: '/' })
</script>