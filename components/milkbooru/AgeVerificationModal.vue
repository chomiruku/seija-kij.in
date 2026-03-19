<template>
  <UModal
    v-model:open="isOpen"
    title="r u over 18"
    description="pinky promise u r over 18 and not at work to look at spicy images"
    :close="{ color: 'deeppink', variant: 'solid', onClick: () => handleConfirm(false) }"
    :ui="{ content: '' }"
  >
    <template #body>
      <div class="relative">
        <UiCornerBrackets size="md" />
        <div class="flex gap-3 justify-center pt-2">
          <UTooltip text="I'm under 18">
            <UButton
              color="neutral"
              size="lg"
              @click="handleConfirm(false)"
            >
              na✋
            </UButton>
          </UTooltip>
          <UTooltip text="I'm 18 or older">
            <UButton
              color="deeppink"
              size="lg"
              @click="handleConfirm(true)"
            >
              ye🤙
            </UButton>
          </UTooltip>
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
