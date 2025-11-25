<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Quote Banner -->
    <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-6">
      <figure>
        <blockquote class="border-l-4 border-gray-400 dark:border-gray-600 pl-4">
          <p class="text-lg italic mb-2">Whatever the means, whoever survives, wins.</p>
        </blockquote>
        <figcaption class="text-sm text-gray-600 dark:text-gray-400 pl-4">
          Kijin Seija <cite>Impossible Spell Card</cite>
        </figcaption>
      </figure>
    </div>

    <!-- Notice -->
    <div class="mb-6">
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-4">
        <p class="text-yellow-800 dark:text-yellow-200">A reporter form is in progress.</p>
      </div>
      <div class="bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-500 p-4">
        <h4 class="text-base leading-relaxed">
          This list serves to collect and archive information about pedophiles in VRChat or any other platforms that relate to it.<br><br>
          These pages will get updated as more people submit information to me.<br><br>
          Pages that are (COMPILING) are not complete and you cannot navigate into them.
        </h4>
      </div>
    </div>

    <!-- List of Individuals -->
    <div class="space-y-2">
      <NuxtLink
        to="/pdf/chunchuunmaru"
        class="block bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded px-4 py-3 transition-colors"
      >
        ChunChuunMaru
      </NuxtLink>
      <div class="block bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-4 py-3 text-gray-600 dark:text-gray-400">
        mono mouse / Vintage 1958 / Vintage3340S (COMPILING)
      </div>
      <div class="block bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-4 py-3 text-gray-600 dark:text-gray-400">
        Shenron / SHΣNROΠ (COMPILING)
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'PDF Tracker - seija-kij.in',
  meta: [
    { name: 'description', content: 'Information archive about dangerous individuals in VRChat and related platforms' },
    { name: 'robots', content: 'noindex, nofollow, noarchive' }
  ]
})
</script>