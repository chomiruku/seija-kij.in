<template>
  <USlideover
    v-model:open="isOpen"
    :ui="{
      content: 'bg-gray-950 border-l border-gray-800 border-t-2 border-t-crimson-500',
      header: 'border-b border-gray-400 px-5 py-4',
      body: 'px-5 py-5',
      footer: 'hidden',
    }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <span class="text-crimson-500/50 font-mono text-[10px] tracking-widest select-none">◈</span>
          <span class="font-mono text-xs uppercase tracking-widest text-gray-300">search prefs</span>
        </div>
        <button
          class="w-8 h-8 border border-gray-40 hover:border-crimson-500/60 hover:text-crimson-400 text-gray-400 font-mono text-xs flex items-center justify-center transition-colors"
          aria-label="Close preferences"
          @click="isOpen = false"
        >✕</button>
      </div>
    </template>

    <template #body>
      <div class="space-y-0">

        <!-- NSFW section -->
        <div class="border border-gray-400 p-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-gray-400 uppercase tracking-widest text-[10px] font-mono">── content filter</span>
            <div class="flex-1 border-t border-gray-400" />
          </div>

          <label class="flex items-center justify-between cursor-pointer group">
            <div class="flex flex-col gap-0.5">
              <span class="font-mono text-xs tracking-widest text-gray-300 group-hover:text-white transition-colors">nsfw</span>
              <span class="font-mono text-[10px] text-gray-400 tracking-wide">
                {{ nsfwValue ? 'all ratings shown' : 'safe only' }}
              </span>
            </div>
            <USwitch
              v-model="nsfwValue"
              color="deeppink"
              aria-label="Toggle NSFW content"
              @update:model-value="handleNsfwChange"
            />
          </label>

          <p class="mt-3 font-mono text-[10px] text-gray-400 leading-relaxed tracking-wide border-t border-gray-400 pt-3">
            turning this on will show all content ratings. you'll need to pinky promise your age first.
          </p>
        </div>

        <!-- Tag Blacklist section -->
        <div class="border border-gray-400 border-t-0 p-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-gray-400 uppercase tracking-widest text-[10px] font-mono">── blocked tags</span>
            <div class="flex-1 border-t border-gray-400" />
            <span
              v-if="tagCount > 0"
              class="font-mono text-[10px] text-crimson-500/70 tracking-widest"
            >{{ tagCount }} blocked</span>
          </div>

          <textarea
            id="tag-blacklist"
            v-model="blacklistValue"
            placeholder="guro blood violence..."
            rows="5"
            class="w-full bg-gray-900 border border-gray-700 border-l-2 border-l-crimson-500/60 focus:border-gray-600 focus:border-l-crimson-500 focus:outline-none text-gray-300 placeholder-gray-700 font-mono text-xs tracking-wide p-3 resize-none transition-colors leading-relaxed"
            aria-label="Tag blacklist"
            aria-describedby="blacklist-help"
            @keydown.enter.prevent
          />
          <p id="blacklist-help" class="mt-2 font-mono text-[10px] text-gray-400 leading-relaxed tracking-wide">
            space-separated tags. posts that match get an overlay — click through to reveal.
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

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:allowNsfw': [value: boolean]
  'update:blacklistTags': [value: string]
}>()

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

const tagCount = computed(() =>
  props.blacklistTags.trim()
    ? props.blacklistTags.trim().split(/\s+/).filter(Boolean).length
    : 0
)

const handleNsfwChange = (value: boolean) => {
  emit('update:allowNsfw', value)
}
</script>
