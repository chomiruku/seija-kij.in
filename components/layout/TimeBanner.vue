<template>
  <div class="bg-black text-white py-1 border-b-2 border-crimson-500">
    <div class="container mx-auto px-4 text-center">
      <ClientOnly>
        <small class="time-banner-text hidden lg:inline">{{ time }}<span v-if="occasionName"> &mdash; {{ occasionName }}</span></small>
        <small class="time-banner-text lg:hidden">{{ timeMobile }}<span v-if="occasionName"> &mdash; {{ occasionName }}</span></small>
        <template #fallback>
          <small class="time-banner-text">Loading time...</small>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
const { occasionName } = useSpecialOccasion()

const time = ref('')
const timeMobile = ref('')
const timer = ref(null)

const updateTime = () => {
  const date = new Date()

  const timeString = date.toLocaleString('en-SG', {
    timeZone: 'Asia/Singapore',
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const shortTimeString = date.toLocaleString('en-SG', {
    timeZone: 'Asia/Singapore',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }) + ' SGT'

  const gmt8 = '+0800'
  time.value = `${timeString} GMT${gmt8} (Singapore Standard Time)`
  timeMobile.value = shortTimeString
}

onMounted(() => {
  updateTime()
  timer.value = setInterval(updateTime, 30000)
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>
