<!-- components/ui/AngularTag.vue -->
<template>
  <span
    class="angular-tag"
    :class="[variantClass, { 'cursor-pointer hover:brightness-125': clickable, 'brightness-125': active }]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="clickable && emit('click')"
    @keydown.enter="clickable && emit('click')"
  >
    <slot>{{ label }}</slot>
    <button
      v-if="removable"
      class="ml-1 opacity-60 hover:opacity-100 leading-none"
      aria-label="Remove tag"
      @click.stop="emit('remove')"
    >✕</button>
  </span>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  variant?: 'crimson' | 'pink' | 'blue' | 'gray'
  clickable?: boolean
  active?: boolean
  removable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gray',
  clickable: false,
  active: false,
  removable: false,
})

const emit = defineEmits<{
  click: []
  remove: []
}>()

const variantClass = computed(() => ({
  'tag-crimson': props.variant === 'crimson',
  'tag-pink': props.variant === 'pink',
  'tag-blue': props.variant === 'blue',
  'tag-gray': props.variant === 'gray',
}))
</script>

<style scoped>
.angular-tag {
  display: inline-flex;
  align-items: center;
  clip-path: var(--clip-parallelogram);
  font-size: 10px;
  font-family: monospace;
  letter-spacing: 0.05em;
  text-transform: lowercase;
  padding: 3px 12px;
  line-height: 1.4;
  white-space: nowrap;
  transition: filter 150ms;
}

.tag-crimson { background: color-mix(in srgb, var(--color-crimson-500) 20%, transparent); color: var(--color-crimson-400); }
.tag-pink    { background: color-mix(in srgb, var(--color-deeppink-500) 20%, transparent); color: var(--color-deeppink-400); }
.tag-blue    { background: color-mix(in srgb, var(--color-royalblue-500) 20%, transparent); color: var(--color-royalblue-400); }
.tag-gray    { background: rgb(255 255 255 / 0.05); color: var(--color-neutral-400, #94a3b8); }
</style>
