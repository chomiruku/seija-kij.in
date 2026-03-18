<template>
  <div class="arrow-color-transition" :style="arrowColorVars">
    <!-- Hidden arrow pattern definition for card backgrounds -->
    <ArrowPatternDefs pattern-id="links-arrows"/>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
      <div class="max-w-6xl mx-auto">
        <div class="mb-12 text-center">
          <h1 class="text-4xl sm:text-5xl font-bold text-crimson-500 dark:text-crimson-400 mb-4">
            links
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
            places chomilk can be found on the internet
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <a
            v-for="(link, index) in links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative overflow-hidden p-4 bg-white dark:bg-gray-900 rounded-xl border-l-4 border-l-crimson-500 dark:border-l-crimson-400 border border-gray-200 dark:border-gray-700 hover:border-l-crimson-400 dark:hover:border-l-crimson-300 transition-all duration-200 hover:-translate-y-0.5 animate-fade-in-up"
            :style="`animation-delay: ${index * 100}ms`"
          >

            <!-- Arrow pattern background - reveals from right on hover -->
            <div class="link-card-arrows">
              <svg class="arrow-parallax-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" :style="arrowParallaxStyle">
                <rect width="100%" height="100%" fill="url(#links-arrows)"/>
              </svg>
              <!-- Blur + opacity overlay -->
              <div class="absolute inset-0 backdrop-blur-[2px] bg-white/80 dark:bg-gray-900/80"/>
            </div>

            <div class="relative z-10 flex items-center">
              <div class="flex-shrink-0 mr-5">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-crimson-400 to-deeppink-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"/>
                  <div class="relative w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors duration-300 mb-1">
                  {{ link.name }}
                </h3>
                <p class="text-base text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {{ link.description }}
                </p>
              </div>

            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { colorVars: arrowColorVars } = useSpecialOccasion()
const { arrowParallaxStyle } = useArrowParallax()

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
.arrow-parallax-svg {
  position: absolute;
  top: -10px;
  left: -14px;
  width: calc(100% + 28px);
  height: calc(100% + 20px);
}

.link-card-arrows {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  mask-image: linear-gradient(to right, transparent 50%, black 80%);
  -webkit-mask-image: linear-gradient(to right, transparent 50%, black 80%);
  mask-size: 200% 100%;
  -webkit-mask-size: 200% 100%;
  mask-position: 0% 0;
  -webkit-mask-position: 0% 0;
  transition: mask-position 0.25s ease-out, -webkit-mask-position 0.25s ease-out;
}

.group:hover .link-card-arrows {
  mask-position: 100% 0;
  -webkit-mask-position: 100% 0;
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