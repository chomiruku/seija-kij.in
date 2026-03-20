<template>
  <div class="arrow-color-transition" :style="arrowColorVars">
    <ArrowPatternDefs pattern-id="links-arrows"/>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
      <div class="max-w-4xl mx-auto">

        <!-- Header -->
        <div class="mb-10">
          <h1 class="navbar-brand text-5xl sm:text-7xl text-crimson-500 dark:text-crimson-500 leading-none mb-1">
            links
          </h1>
          <p class="font-mono text-xs text-deeppink-500/70 dark:text-deeppink-400/70 tracking-widest uppercase">
            places chomilk can be found on the internet
          </p>
        </div>

        <!-- Links List -->
        <div class="space-y-0 border border-gray-200 dark:border-gray-800">
          <!-- Featured: Booth -->
          <a
            :href="featuredLink.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative overflow-hidden flex items-center gap-5 px-6 py-5 border-b border-gray-200 dark:border-gray-800 hover:bg-crimson-500/5 transition-colors duration-200 animate-fade-in-up block"
          >
            <div class="link-card-arrows">
              <svg class="arrow-parallax-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" :style="arrowParallaxStyle">
                <rect width="100%" height="100%" fill="url(#links-arrows)"/>
              </svg>
              <div class="absolute inset-0 backdrop-blur-[2px] bg-white/80 dark:bg-gray-900/80"/>
            </div>
            <div class="relative z-10 flex items-center gap-5 w-full">
              <img :src="featuredLink.image" :alt="featuredLink.name" class="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div class="flex-1 min-w-0">
                <div class="font-mono text-[10px] text-crimson-500/60 tracking-widest uppercase mb-0.5">{{ featuredLink.category }}</div>
                <h2 class="navbar-brand text-2xl sm:text-3xl text-gray-900 dark:text-white group-hover:text-crimson-500 dark:group-hover:text-crimson-400 transition-colors duration-200 leading-none">{{ featuredLink.name }}</h2>
                <p class="font-mono text-xs text-gray-500 dark:text-gray-400 mt-1 tracking-wide">{{ featuredLink.description }}</p>
              </div>
              <span class="font-mono text-sm text-crimson-500/30 group-hover:text-crimson-500 transition-colors duration-200 shrink-0">→</span>
            </div>
          </a>

          <!-- Secondary Links -->
          <a
            v-for="(link, index) in secondaryLinks"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative overflow-hidden flex items-center gap-5 px-6 py-4 border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-crimson-500/5 transition-colors duration-200 animate-fade-in-up block"
            :style="`animation-delay: ${(index + 1) * 60}ms`"
          >
            <div class="link-card-arrows">
              <svg class="arrow-parallax-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" :style="arrowParallaxStyle">
                <rect width="100%" height="100%" fill="url(#links-arrows)"/>
              </svg>
              <div class="absolute inset-0 backdrop-blur-[2px] bg-white/80 dark:bg-gray-900/80"/>
            </div>
            <div class="relative z-10 flex items-center gap-5 w-full">
              <img :src="link.image" :alt="link.name" class="w-7 h-7 object-contain shrink-0 group-hover:scale-110 transition-transform duration-200">
              <div class="flex-1 min-w-0">
                <h3 class="font-mono text-sm font-bold text-gray-900 dark:text-white group-hover:text-crimson-500 dark:group-hover:text-crimson-400 transition-colors duration-200 truncate">{{ link.name }}</h3>
                <p class="font-mono text-xs text-gray-400 dark:text-gray-600 truncate mt-0.5">{{ link.description }}</p>
              </div>
              <span class="font-mono text-xs text-crimson-500/20 group-hover:text-crimson-500/60 transition-colors duration-200 shrink-0">→</span>
            </div>
          </a>
        </div>

        <!-- Memorial Link -->
        <a
          :href="memorialLink.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-5 px-6 py-3 mt-2 border border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 animate-fade-in-up block"
          style="animation-delay: 420ms"
        >
          <div class="flex items-center gap-5 w-full opacity-40 group-hover:opacity-70 transition-opacity duration-200">
            <img :src="memorialLink.image" :alt="memorialLink.name" class="w-5 h-5 object-contain shrink-0 grayscale">
            <div class="flex-1 min-w-0">
              <h3 class="font-mono text-xs text-gray-500 dark:text-gray-500 truncate">{{ memorialLink.name }}</h3>
              <p class="font-mono text-xs text-gray-400 dark:text-gray-600 italic truncate mt-0.5">{{ memorialLink.description }}</p>
            </div>
            <span class="font-mono text-xs text-gray-400 dark:text-gray-600 tracking-widest shrink-0">rip</span>
          </div>
        </a>

      </div>
    </div>
  </div>
</template>

<script setup>
const { colorVars: arrowColorVars } = useSpecialOccasion()
const { arrowParallaxStyle } = useArrowParallax()

const title = 'Links';
const description = 'my links :)';

const featuredLink = {
  name: 'Booth',
  url: 'https://chomilk.booth.pm/',
  image: '/icons/booth.png',
  description: 'chomilk store — vrc stuff and whatever else',
  category: 'store',
}

const secondaryLinks = [
  {
    name: 'Twitter',
    url: 'https://x.com/MintBIRDIE69',
    description: 'twitter profile',
    image: '/icons/Logo_of_Twitter.svg',
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
    name: 'Steam',
    url: 'https://steamcommunity.com/id/whyareyouaspy/',
    description: 'steam profile',
    image: '/icons/Steam_icon_logo.svg',
  },
]

const memorialLink = {
  name: 'Old Website',
  url: 'http://cirnodik.xara.hosting/',
  description: 'the before times',
  image: '/icons/a-master-favicon.ico',
}

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
</style>
