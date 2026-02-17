<template>
  <USlideover
    v-model:open="isOpen"
    title="Milkbooru Search Preferences"
    :close="{
      class: 'text-white',
      color: 'deeppink',
      variant: 'solid',
    }"
  >
    <template #body>
      <div class="space-y-6">
        <!-- NSFW Toggle -->
        <div>
          <label class="inline-flex cursor-pointer items-center gap-3">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">NSFW Content</span>
            <USwitch
              v-model="nsfwValue"
              color="deeppink"
              @update:model-value="handleNsfwChange"
            />
          </label>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Enable to view all content ratings including explicit content.
          </p>
        </div>

        <!-- Tag Blacklist -->
        <div>
          <label for="tag-blacklist" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Tag Blacklist
          </label>
          <UTextarea
            id="tag-blacklist"
            v-model="blacklistValue"
            color="error"
            placeholder="Enter tags to blacklist, separated by spaces... (e.g., gore blood violence)"
            :rows="4"
            class="w-full"
            aria-label="Tag blacklist"
            aria-describedby="blacklist-help"
            @input="handleBlacklistChange"
            @keyup="handleBlacklistChange"
            @blur="handleBlacklistChange"
            @keydown.enter.prevent
          />
          <p id="blacklist-help" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Posts containing any of these tags will be shown with an overlay. Click to view the post.
          </p>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
  allowNsfw: boolean
  blacklistTags: string
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'update:allowNsfw', value: boolean): void
  (e: 'update:blacklistTags', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value),
})

const nsfwValue = computed({
  get: () => props.allowNsfw,
  set: (value: boolean) => emit('update:allowNsfw', value),
})

const blacklistValue = computed({
  get: () => props.blacklistTags,
  set: (value: string) => emit('update:blacklistTags', value),
})

const handleNsfwChange = (value: boolean) => {
  emit('update:allowNsfw', value)
}

const handleBlacklistChange = () => {
  emit('update:blacklistTags', blacklistValue.value)
}
</script>
