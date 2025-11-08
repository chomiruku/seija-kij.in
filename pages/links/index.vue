<template>
  <div class="">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
      <div class="max-w-6xl mx-auto">
        <div class="mb-12 text-center">
          <h1 class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-300 via-orange-500 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
            links
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
            hi
          </p>
        </div>
        
        <div class="grid gap-4 sm:gap-6">
          <a
            v-for="(link, index) in links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative overflow-hidden p-4 sm:p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 animate-fade-in-up"
            :style="`animation-delay: ${index * 100}ms`"
          >

            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            
            <div class="relative flex items-center">
              <div class="flex-shrink-0 mr-5">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"/>
                  <div class="relative w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img
                      v-if="link.image"
                      :src="link.image"
                      :alt="link.name"
                      class="w-7 h-7 object-contain filter group-hover:brightness-110 transition-all duration-300"
                    >
                  </div>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-1">
                  {{ link.name }}
                </h3>
                <p class="text-base text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {{ link.description }}
                </p>
              </div>
              
              <div class="flex-shrink-0 ml-4">
                <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 group-hover:scale-110 transition-all duration-300">
                  <svg class="w-5 h-5 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out"/>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = 'Links';
const description = 'my links :)';

const links = [
  {
    name: 'Booth',
    url: 'https://chomilk.booth.pm/',
    image: '/icons/booth.png',
    description: 'chomilk store'
  },
  {
    name: 'Steam',
    url: 'https://steamcommunity.com/id/whyareyouaspy/',
    description: 'steam profile',
    image: '/icons/Steam_icon_logo.svg',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@chomiruku',
    description: 'youtube channel',
    image: '/icons/YouTube_full-color_icon_(2017).svg',
  },
  {
    name: 'Bandcamp',
    url: 'https://bandcamp.com/chomilk',
    description: 'bandcamp profile',
    image: '/icons/Bandcamp-button-bc-circle-green.svg',
  },
  {
    name: 'Twitter',
    url: 'https://x.com/MintBIRDIE69',
    description: 'twitter profile',
    image: '/icons/Logo_of_Twitter.svg',
  },
  {
    name: 'Old Website',
    url: 'http://cirnodik.xara.hosting/',
    description: 'old website',
    image: '/icons/a-master-favicon.ico',
  }
];

useHead({
  title: `${title} | seija-kij.in`,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: 'touhou, seija kijin, kijin seija, seija, kijin, seija-kij.in, links, social media' },
    { name: 'robots', content: 'index, follow' },

    { property: 'og:title', content: `${title} | seija-kij.in` },
    { property: 'og:description', content: description },
    { property: 'og:url', content: 'https://seija-kij.in/links' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${title} | seija-kij.in` },
    { name: 'twitter:description', content: description }
  ],
  htmlAttrs: [
    {lang: 'en'},
  ]
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.mb-6 {
  animation: float 3s ease-in-out infinite;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2563eb, #7c3aed);
}
</style>