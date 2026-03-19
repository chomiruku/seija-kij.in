<template>
  <div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
      <!-- Hero Quote Section -->
      <div class="text-center mb-12">
        <div class="border-l-4 border-crimson-500 dark:border-crimson-400 pl-6 sm:pl-8 py-4 text-left max-w-2xl mx-auto">
          <figure v-if="quote">
            <blockquote class="text-lg sm:text-xl mb-4 italic">
              <p>"{{ quote.text }}"</p>
            </blockquote>
            <figcaption>
              Kijin Seija in <cite class="font-semibold">{{ quote.source }}</cite>
            </figcaption>
          </figure>
          <div v-else class="animate-pulse">
            <div class="h-6 bg-gray-300/20 mb-4"/>
            <div class="h-4 bg-gray-300/20 w-32 mx-auto"/>
          </div>
        </div>
      </div>

      <!-- Main Character Card -->
      <div class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 mb-12">
        <UiCornerBrackets />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Character Info -->
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold text-crimson-500 dark:text-crimson-400 mb-6">
              鬼人 正邪
            </h2>

            <p class="mb-6 leading-relaxed">
              Seija Kijin 鬼人 正邪 is an amanojaku with the power to turn over anything. She is a rebellious youkai that often causes trouble in Gensokyo such as in Double Dealing Character when she tried to overthrow society and make the weak rule over the strong. Seija first appeared in Double Dealing Character as the midboss and boss of Stage 5 as well as the midboss of Stage 6 in the same game. She then became a playable character as the main protagonist of Impossible Spell Card and the minigame Gold Rush.
            </p>

            <ul class="space-y-2 mb-6">
              <li class="flex items-center">
                <span class="w-2 h-2 bg-pink-400 rotate-45 inline-block mr-3"/>
                <span class="font-semibold">Species:</span> <span class="ml-2">Amanojaku</span>
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-purple-400 rotate-45 inline-block mr-3"/>
                <span class="font-semibold">Ability:</span> <span class="ml-2">Turn over anything</span>
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-red-400 rotate-45 inline-block mr-3"/>
                <span class="font-semibold">First Appearance:</span> <span class="ml-2">Double Dealing Character</span>
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-plum-400 rotate-45 inline-block mr-3"/>
                <span class="font-semibold">Location:</span> <span class="ml-2">Unknown</span>
              </li>
            </ul>

            <!-- Personality -->
            <div class="border-s-4 border-pink-400/50 dark:border-purple-400/50 ps-4">
              <h3 class="text-lg font-bold mb-2">Personality</h3>
              <p class="leading-relaxed text-sm">
                Seija always thinks and acts the opposite to those around her. She's disliked and considered a nuisance, but welcomes that hatred towards her. She's more like a rebellious teenager who enjoys being against what everyone else thinks instead of someone who really wants to change things.
              </p>
            </div>
          </div>

          <!-- Seija Mood Index -->
          <div class="text-center">
            <div class="mood-image-wrapper arrow-color-transition inline-block w-auto h-100 sm:h-150" :style="arrowColorVars">
              <div class="mood-arrows-clip absolute inset-0 overflow-hidden">
                <div class="absolute inset-0 z-1 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5),inset_0_-4px_12px_rgba(0,0,0,0.3)] pointer-events-none"/>
                <ArrowPattern pattern-id="arrows-mood" :parallax-style="arrowParallaxStyle"/>
              </div>
              <div v-if="mood" class="mood-image-shadow relative z-10">
                <nuxt-img
                    :src="`https://mood.seija-kij.in${mood.imageUrl}`"
                    :alt="`Kijin Seija feeling ${mood.mood}`"
                    class="w-auto h-100 sm:h-150 mx-auto transition-transform duration-900 hover:scale-105 hover:rotate-180"
                />
              </div>
              <div v-else class="relative z-10 w-80 h-100 sm:h-150 bg-gray-300/20 animate-pulse mx-auto"/>
            </div>
            <p class="mt-4 italic">
              Seija is feeling
              <span class="dreamy-container not-italic">
                <span
                  v-for="(letter, index) in (mood?.mood || '...').split('')"
                  :key="`${mood?.mood}-${index}`"
                  class="float-x"
                  :style="{ animationDelay: `${index * 0.15}s` }"
                >
                  <span
                    class="float-y dreamy-letter"
                    :style="{ animationDelay: `${index * 0.15}s` }"
                  >
                    {{ letter }}
                  </span>
                </span>
              </span>
              today.
            </p>
          </div>
        </div>
      </div>

      <!-- Abilities & Spell Cards -->
      <div class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 mb-5">
        <UiCornerBrackets />
        <h3 class="text-3xl font-bold text-center mb-8">Abilities & Spell Cards</h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Turning Over Ability -->
          <div>
            <h4 class="text-xl font-bold mb-4">Turning Over</h4>
            <p class="mb-4">Can flip anything upside down, including:</p>
            <ul class="space-y-2">
              <li class="flex items-center">
                <span class="w-1.5 h-1.5 bg-deeppink-400 rotate-45 inline-block mr-3"/>
                Physical objects
              </li>
              <li class="flex items-center">
                <span class="w-1.5 h-1.5 bg-deeppink-400 rotate-45 inline-block mr-3"/>
                Directions
              </li>
              <li class="flex items-center">
                <span class="w-1.5 h-1.5 bg-deeppink-400 rotate-45 inline-block mr-3"/>
                Abstract concepts
              </li>
            </ul>
          </div>

          <!-- Spell Cards -->
          <div>
            <h4 class="text-xl font-bold">
              Spell Cards
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-center">
                <span class="w-1.5 h-1.5 bg-orange-400 rotate-45 inline-block mr-3"/>
                欺符「逆さ撃ち」
              </div>
              <div class="flex items-center">
                <span class="w-1.5 h-1.5 bg-orange-400 rotate-45 inline-block mr-3"/>
                逆符「鏡の国の弾幕」
              </div>
              <div class="flex items-center">
                <span class="w-1.5 h-1.5 bg-orange-400 rotate-45 inline-block mr-3"/>
                逆符「イーヴィルインザミラー」
              </div>
              <div class="flex items-center">
                <span class="w-1.5 h-1.5 bg-orange-400 rotate-45 inline-block mr-3"/>
                逆符「天地有用」
              </div>
              <div class="flex items-center">
                <span class="w-1.5 h-1.5 bg-orange-400 rotate-45 inline-block mr-3"/>
                逆符「天下転覆」
              </div>
              <div class="flex items-center">
                <span class="w-1.5 h-1.5 bg-orange-400 rotate-45 inline-block mr-3"/>
                逆弓「天壌夢弓」
              </div>
              <div class="flex items-center">
                <span class="w-1.5 h-1.5 bg-orange-400 rotate-45 inline-block mr-3"/>
                逆弓「天壌夢弓の詔勅」
              </div>
              <div class="flex items-center">
                <span class="w-1.5 h-1.5 bg-orange-400 rotate-45 inline-block mr-3"/>
                逆転「リバースヒエラルキー」
              </div>
              <div class="flex items-center">
                <span class="w-1.5 h-1.5 bg-orange-400 rotate-45 inline-block mr-3"/>
                逆転「チェンジエアブレイブ」
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { colorVars: arrowColorVars } = useSpecialOccasion()
const { arrowParallaxStyle } = useArrowParallax()

const { data: quote } = useFetch('https://mood.seija-kij.in/quote', {
  default: () => null,
  server: false,
})
const { data: mood } = useFetch('https://mood.seija-kij.in/mood', {
  default: () => null,
  server: false,
})

useHead({
  title: 'Kijin Seija - 鬼人 正邪 | seija-kij.in',
  meta: [
    { name: 'keywords', content: 'touhou, seija kijin, kijin seija, seija, kijin, seija-kij.in, booru, vrchat, chomilk, 鬼人 正邪, 鬼人, 正邪' },
  ],
  htmlAttrs: [
    {lang: 'en'},
  ]
})
</script>

<style scoped>
.mood-image-wrapper {
  position: relative;
}

.mood-image-shadow {
  filter: drop-shadow(6px 6px 12px rgba(0, 0, 0, 1));
}

.dreamy-container {
  @apply inline-block;
}

.float-x {
  @apply inline-block;
  animation: letterFloatX 4.543s ease-in-out infinite;
}

.float-y {
  @apply inline-block;
}

.dreamy-letter {
  @apply inline-block;
  background: linear-gradient(45deg, #4c1d95, #5b21b6, #7c3aed, #8b5cf6, #a855f7, #c084fc);
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: letterFloatY 3.813s ease-in-out infinite, letterGlow 2.5s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.2));
  transform-origin: center bottom;
}

.dark .dreamy-letter {
  background: linear-gradient(45deg, #f8fafc, #e0e7ff, #c7d2fe, #a5b4fc, #818cf8, #6366f1);
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.4));
  transform-origin: center bottom;
}

@keyframes letterFloatY {
  0%, 100% {
    transform: translateY(0px) scale(1) rotateZ(0deg);
  }
  25% {
    transform: translateY(-4px) scale(1.5) rotateZ(-10deg);
  }
  50% {
    transform: translateY(5px) scale(1.02) rotateZ(5deg);
  }
  75% {
    transform: translateY(-5px) scale(1.08) rotateZ(-5deg);
  }
}

@keyframes letterFloatX {
  0%, 100% {
    transform: translateX(0px) scale(1) rotateZ(0deg);
  }
  25% {
    transform: translateX(-2px) scale(1.05) rotateZ(-1deg);
  }
  50% {
    transform: translateX(6px) scale(1.02) rotateZ(0deg);
  }
  75% {
    transform: translateX(-4px) scale(1.08) rotateZ(1deg);
  }
}

@keyframes letterGlow {
  0% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.2)) brightness(0.9);
  }
  50% {
    background-position: 100% 100%;
    filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6)) brightness(1.2);
  }
  100% {
    background-position: 0% 0%;
    filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.4)) brightness(1.1);
  }
}
</style>