<template>
  <svg class="absolute w-0 h-0 overflow-hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern :id="patternId" x="0" y="0" width="600" height="200" patternTransform="rotate(-60) scale(0.25)" patternUnits="userSpaceOnUse">
        <animate attributeName="x" from="0" to="600" dur="30s" repeatCount="indefinite"/>
        <rect width="600" height="200" fill="var(--arrow-bg)"/>
        <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" fill="var(--arrow-grey)" stroke="var(--arrow-grey)" stroke-width="1.5" stroke-linejoin="miter" transform="translate(-150,-100)"/>
        <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" fill="var(--arrow-grey)" stroke="var(--arrow-grey)" stroke-width="1.5" transform="translate(450,-100)"/>
        <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" fill="var(--arrow-grey)" stroke="var(--arrow-grey)" stroke-width="1.5" transform="translate(-150,100)"/>
        <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" fill="var(--arrow-grey)" stroke="var(--arrow-grey)" stroke-width="1.5" transform="translate(450,100)"/>
        <polygon points="0,50 150,50 150,0 300,100 150,200 150,150 0,150" fill="var(--arrow-white)" stroke="var(--arrow-white)" stroke-width="1.5" stroke-linejoin="miter"/>
        <polygon points="0,50 150,50 150,0 300,100 150,200 150,150 0,150" fill="var(--arrow-red)" stroke="var(--arrow-red)" stroke-width="1.5" stroke-linejoin="miter" transform="translate(300,0)"/>
        <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" fill="var(--arrow-black)" stroke="var(--arrow-black)" stroke-width="1.5" stroke-linejoin="miter" transform="translate(150,-100)"/>
        <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" fill="var(--arrow-black)" stroke="var(--arrow-black)" stroke-width="1.5" stroke-linejoin="miter" transform="translate(150,100)"/>
      </pattern>
    </defs>
  </svg>
</template>

<script setup>
defineProps({
  patternId: {
    type: String,
    required: true,
  },
})
</script>
