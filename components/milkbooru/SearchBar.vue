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
          class="block w-full pl-10 pr-24 py-3 border border-gray-300 dark:border-gray-600 border-l-2 border-l-crimson-500 leading-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-crimson-500 focus:border-transparent transition-all duration-200 relative z-0 disabled:opacity-50 disabled:cursor-progress font-mono"
          @keyup.enter="handleSearch"
          @focus="handleFocus"
        >
        <UTooltip text="Search for posts">
          <UButton
            :disabled="disabled"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 text-white transition-colors text-sm font-medium disabled:cursor-progress cursor-pointer"
            color="deeppink"
            :loading="disabled"
            @click="handleSearch"
          >
            Search
          </UButton>
        </UTooltip>
      </div>

      <UTooltip text="Configure NSFW settings and tag blacklist">
        <UButton
          class="text-white hidden sm:flex"
          label="Search Preferences"
          color="deeppink"
          icon="i-heroicons-cog-6-tooth"
          @click="$emit('open-preferences')"
        />
        <UButton
          class="text-white sm:hidden"
          color="deeppink"
          icon="i-heroicons-cog-6-tooth"
          @click="$emit('open-preferences')"
        />
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
