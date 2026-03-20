<template>
  <UModal
    v-model:open="isOpen"
    :ui="{
      content: 'bg-gray-950 border border-gray-800 border-t-2 border-t-crimson-500 p-0',
      header: 'hidden',
      body: 'p-0',
      footer: 'hidden',
    }"
    :close="false"
  >
    <template #body>
      <div class="relative p-6">
        <UiCornerBrackets size="md" />

        <!-- Header -->
        <div class="mb-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-crimson-500/50 font-mono text-[10px] select-none">◈</span>
            <span class="font-mono text-[10px] uppercase tracking-widest text-neutral-400">── age check</span>
          </div>
          <p class="font-mono text-sm text-white tracking-wide">r u over 18?</p>
          <p class="font-mono text-[11px] text-white mt-1 tracking-wide leading-relaxed">
            pinky promise you're over 18 and not at work to look at spicy images
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            class="flex-1 clip-parallelogram font-mono text-xs uppercase tracking-widest px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            @click="handleConfirm(false)"
          >
            na ✋
          </button>
          <button
            class="flex-1 clip-parallelogram font-mono text-xs uppercase tracking-widest px-5 py-3 bg-deeppink-500 hover:bg-deeppink-400 text-white transition-colors"
            @click="handleConfirm(true)"
          >
            ye 🤙
          </button>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': [isOver18: boolean]
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value),
})

const handleConfirm = (isOver18: boolean) => {
  emit('confirm', isOver18)
  isOpen.value = false
}
</script>
