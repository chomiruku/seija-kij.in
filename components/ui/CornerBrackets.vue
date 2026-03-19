<!-- components/ui/CornerBrackets.vue -->
<template>
  <span aria-hidden="true" class="corner-brackets-root">
    <span class="corner tl" :class="sizeClass" :style="colorStyle" />
    <span class="corner tr" :class="sizeClass" :style="colorStyle" />
    <span class="corner bl" :class="sizeClass" :style="colorStyle" />
    <span class="corner br" :class="sizeClass" :style="colorStyle" />
  </span>
</template>

<script setup lang="ts">
interface Props {
  color?: 'crimson' | 'pink' | 'blue'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'crimson',
  size: 'md',
})

const sizeClass = computed(() => ({
  'sm': props.size === 'sm',
  'md': props.size === 'md',
  'lg': props.size === 'lg',
}))

const colorMap = {
  crimson: 'var(--color-crimson-500, #ff3342)',
  pink: 'var(--color-deeppink-500, #ff348b)',
  blue: 'var(--color-royalblue-500, #204dff)',
}

const colorStyle = computed(() => ({
  '--bracket-color': colorMap[props.color],
}))
</script>

<style scoped>
.corner-brackets-root {
  pointer-events: none;
}

.corner {
  position: absolute;
  border-color: var(--bracket-color, #ff3342);
  opacity: 0.6;
  transition: opacity 150ms;
}

/* Size variants */
.corner.sm { width: 6px; height: 6px; border-width: 1px; }
.corner.md { width: 10px; height: 10px; border-width: 2px; }
.corner.lg { width: 14px; height: 14px; border-width: 2px; }

.corner.tl { top: -1px; left: -1px; border-style: solid none none solid; }
.corner.tr { top: -1px; right: -1px; border-style: solid solid none none; }
.corner.bl { bottom: -1px; left: -1px; border-style: none none solid solid; }
.corner.br { bottom: -1px; right: -1px; border-style: none solid solid none; }

/* Parent hover brightens brackets — parent must apply group class */
:global(.group:hover) .corner,
:global(*:hover > .corner-brackets-root > .corner) {
  opacity: 1;
}
</style>
