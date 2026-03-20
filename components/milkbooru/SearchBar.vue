<template>
  <div class="max-w-8xl mx-auto mb-0">
    <div class="flex gap-2 items-center">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <UIcon name="i-heroicons-magnifying-glass" class="h-5 w-5 text-gray-400" />
        </div>
        <input
          v-model="searchValue"
          type="text"
          :placeholder="placeholder"
          :disabled="disabled"
          class="block w-full pl-10 pr-24 py-3 border border-gray-200 dark:border-gray-800 border-l-2 border-l-crimson-500 leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-crimson-500 dark:focus:border-crimson-500 transition-colors duration-150 relative z-0 disabled:opacity-50 disabled:cursor-progress font-mono text-sm tracking-wide"
          @keyup.enter="handleSearch"
          @focus="handleFocus"
        >
        <UTooltip text="Search for posts">
          <button
            :disabled="disabled"
            class="absolute right-2 top-1/2 -translate-y-1/2 clip-parallelogram font-mono text-xs uppercase tracking-widest px-4 py-2 bg-crimson-500 hover:bg-crimson-400 text-white transition-colors disabled:opacity-50 disabled:cursor-progress"
            @click="handleSearch"
          >
            search
          </button>
        </UTooltip>
      </div>

      <UTooltip text="Configure NSFW settings and tag blacklist">
        <button
          class="clip-parallelogram font-mono text-xs uppercase tracking-widest px-4 py-3 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-crimson-500/40 hover:text-crimson-400 transition-colors"
          @click="$emit('open-preferences')"
        >
          <span class="hidden sm:inline">prefs</span>
          <span class="sm:hidden">⚙</span>
        </button>
      </UTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter tags to search... (e.g., rating:g kijin_seija)',
  disabled: false,
})
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': []
  'focus': []
  'open-preferences': []
}>()

const searchValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const handleSearch = () => {
  emit('search')
}

const handleFocus = () => {
  emit('focus')
}
</script>
