<template>
  <div class="index-root">
    <!-- ══ HERO QUOTE ══ -->
    <section class="quote-section">
      <div class="quote-slash-bg" aria-hidden="true">
        <span class="quote-slash-text">天邪鬼</span>
      </div>
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div class="quote-figure">
          <span class="quote-mark" :class="quote ? 'opacity-90' : 'opacity-0'" aria-hidden="true">"</span>
          <figure v-if="quote" class="animate-fade-in-up">
            <blockquote class="quote-body">
              <p>{{ quote.text }}</p>
            </blockquote>
            <figcaption class="quote-caption">
              <span class="quote-dash">—</span>
              Kijin Seija in <cite class="quote-source">{{ quote.source }}</cite>
            </figcaption>
          </figure>
          <div v-else class="animate-pulse opacity-30">
            <div class="h-8 bg-crimson-500/20 mb-4 w-3/4"/>
            <div class="h-5 bg-crimson-500/10 w-48"/>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ MAIN CHARACTER CARD ══ -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div class="char-card relative animate-fade-in-up" style="animation-delay: 0.1s">
        <UiCornerBrackets size="lg" color="crimson" />

        <!-- Kanji watermark -->
        <div class="kanji-watermark" aria-hidden="true">正邪</div>

        <!-- HUD top bar -->
        <div class="hud-bar">
          <span class="hud-label">SUBJECT</span>
          <span class="hud-divider">◈</span>
          <span class="hud-value">鬼人 正邪 // KIJIN SEIJA</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <!-- LEFT: Info -->
          <div class="char-info-col">
            <h1 class="char-name">
              <span class="char-name-jp">鬼人 正邪</span>
              <span class="char-name-en">KIJIN SEIJA</span>
            </h1>

            <p class="char-desc">
              An amanojaku with the power to turn over anything. She is a rebellious youkai that often causes trouble in Gensokyo such as in Double Dealing Character when she tried to overthrow society and make the weak rule over the strong. Seija first appeared in Double Dealing Character as the midboss and boss of Stage 5 as well as the midboss of Stage 6 in the same game. She then became a playable character as the main protagonist of Impossible Spell Card and the minigame Gold Rush.
            </p>

            <!-- Stat readout -->
            <div class="stat-grid">
              <div class="stat-row">
                <span class="stat-key">SPECIES</span>
                <span class="stat-bar-track"><span class="stat-bar" style="width: 100%; background: var(--color-deeppink-500)"/></span>
                <span class="stat-val" style="color: var(--color-deeppink-500)">Amanojaku</span>
              </div>
              <div class="stat-row">
                <span class="stat-key">ABILITY</span>
                <span class="stat-bar-track"><span class="stat-bar" style="width: 85%; background: var(--color-blueviolet-500)"/></span>
                <span class="stat-val" style="color: var(--color-blueviolet-500)">Turn over anything</span>
              </div>
              <div class="stat-row">
                <span class="stat-key">DEBUT</span>
                <span class="stat-bar-track"><span class="stat-bar" style="width: 70%; background: var(--color-crimson-500)"/></span>
                <span class="stat-val" style="color: var(--color-crimson-500)">Double Dealing Character</span>
              </div>
              <div class="stat-row">
                <span class="stat-key">LOCATION</span>
                <span class="stat-bar-track"><span class="stat-bar" style="width: 40%; background: var(--color-plum-500)"/></span>
                <span class="stat-val" style="color: var(--color-plum-500)">Unknown</span>
              </div>
            </div>

            <!-- Personality -->
            <div class="personality-block">
              <div class="personality-header">
                <span class="personality-tag clip-chevron">PERSONALITY</span>
              </div>
              <p class="personality-text">
                Seija always thinks and acts the opposite to those around her. She's disliked and considered a nuisance, but welcomes that hatred towards her. She's more like a rebellious teenager who enjoys being against what everyone else thinks instead of someone who really wants to change things.
              </p>
            </div>
          </div>

          <!-- RIGHT: Mood + image -->
          <div class="mood-col">
            <div
              class="mood-image-wrapper arrow-color-transition"
              :style="arrowColorVars"
            >
              <div class="mood-arrows-clip absolute inset-0 overflow-hidden">
                <div class="absolute inset-0 z-1 shadow-[inset_0_4px_24px_rgba(0,0,0,0.7),inset_0_-4px_24px_rgba(0,0,0,0.5)] pointer-events-none"/>
                <ArrowPattern pattern-id="arrows-mood" :parallax-style="arrowParallaxStyle"/>
              </div>
              <div v-if="mood" class="mood-image-shadow relative z-10">
                <nuxt-img
                  :src="`https://mood.seija-kij.in${mood.imageUrl}`"
                  :alt="`Kijin Seija feeling ${mood.mood}`"
                  class="w-auto h-100 sm:h-150 mx-auto transition-transform duration-900 hover:rotate-180"
                />
              </div>
              <div v-else class="relative z-10 w-80 h-100 sm:h-150 bg-gray-300/20 animate-pulse mx-auto"/>
            </div>

            <p class="mood-label">
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
    </section>

    <!-- ══ ABILITIES + SPELL CARDS ══ -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="abilities-grid">
        <!-- Abilities -->
        <div class="ability-card animate-fade-in-up relative" style="animation-delay: 0.2s">
          <UiCornerBrackets color="pink" />
          <div class="ability-hud-bar">
            <span class="hud-label">ABILITY</span>
            <span class="hud-divider">◈</span>
            <span class="hud-value">TURN OVER ANYTHING</span>
          </div>
          <div class="ability-body">
            <div class="ability-target-list">
              <div class="ability-target">
                <span class="ability-index">01</span>
                <span class="ability-name">Physical Objects</span>
                <span class="ability-bar-fill" style="width: 95%"/>
              </div>
              <div class="ability-target">
                <span class="ability-index">02</span>
                <span class="ability-name">Directions</span>
                <span class="ability-bar-fill" style="width: 80%"/>
              </div>
              <div class="ability-target">
                <span class="ability-index">03</span>
                <span class="ability-name">Abstract Concepts</span>
                <span class="ability-bar-fill" style="width: 65%"/>
              </div>
              <div class="ability-target ability-target--clickable" @click="toggleFlip">
                <span class="ability-index">04</span>
                <span class="ability-name">Your Screen</span>
                <span class="ability-bar-fill" style="width: 100%"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Spell cards -->
        <div class="spell-card animate-fade-in-up relative" style="animation-delay: 0.3s">
          <UiCornerBrackets color="blue" />
          <div class="ability-hud-bar">
            <span class="hud-label">SPELL CARDS</span>
            <span class="hud-divider">◈</span>
            <span class="hud-value">SELECTION INDEX</span>
          </div>
          <ol class="spell-list">
            <li v-for="(spell, i) in spells" :key="i" class="spell-entry">
              <span class="spell-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="spell-text">{{ spell }}</span>
              <span class="spell-accent" aria-hidden="true"/>
            </li>
          </ol>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { colorVars: arrowColorVars } = useSpecialOccasion()
const { arrowParallaxStyle } = useArrowParallax()
const { toggle: toggleFlip } = useSeijaFlip()

const { data: quote } = useFetch('https://mood.seija-kij.in/quote', {
  default: () => null,
  server: false,
})
const { data: mood } = useFetch('https://mood.seija-kij.in/mood', {
  default: () => null,
  server: false,
})

const spells = [
  '欺符「逆さ撃ち」',
  '逆符「鏡の国の弾幕」',
  '逆符「イーヴィルインザミラー」',
  '逆符「天地有用」',
  '逆符「天下転覆」',
  '逆弓「天壌夢弓」',
  '逆弓「天壌夢弓の詔勅」',
  '逆転「リバースヒエラルキー」',
  '逆転「チェンジエアブレイブ」',
]

useHead({
  title: 'Kijin Seija - 鬼人 正邪 | seija-kij.in',
  meta: [
    { name: 'keywords', content: 'touhou, seija kijin, kijin seija, seija, kijin, seija-kij.in, booru, vrchat, chomilk, 鬼人 正邪, 鬼人, 正邪' },
  ],
  htmlAttrs: [
    { lang: 'en' },
  ],
})
</script>

<style scoped>
/* ── Index root ── */
.index-root {
  padding-bottom: 2rem;
}

/* ── Quote section ── */
.quote-section {
  position: relative;
  overflow: hidden;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-crimson-500) 20%, transparent);
}

.quote-slash-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
  z-index: 0;
}

.quote-slash-text {
  font-size: clamp(8rem, 10vw, 18rem);
  font-family: var(--font-y1vectura, 'Y1Vectura', sans-serif);
  font-weight: 900;
  color: var(--color-crimson-500);
  opacity: 0.04;
  line-height: 1;
  user-select: none;
  transform: skewX(-8deg);
  padding-right: 2rem;
}

.dark .quote-slash-text {
  opacity: 0.07;
}

.quote-figure {
  max-width: 42rem;
  position: relative;
}

.quote-mark {
  display: block;
  font-size: clamp(3rem, 7vw, 5rem);
  line-height: 0.6;
  color: var(--color-crimson-500);
  font-family: Georgia, serif;
  margin-bottom: 0.4rem;
  transition: opacity 0.5s ease;
}

.quote-body {
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.6;
  font-style: italic;
  color: inherit;
  margin-bottom: 0.75rem;
}

.quote-caption {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.quote-dash {
  margin-right: 0.4em;
  color: var(--color-crimson-500);
}

.quote-source {
  font-style: normal;
  font-weight: 700;
  color: var(--color-crimson-400);
}

/* ── Character card ── */
.char-card {
  background: white;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  overflow: hidden;
}

.dark .char-card {
  background: var(--color-gray-900, #111827);
  border-color: var(--color-gray-800, #1f2937);
}

.kanji-watermark {
  position: absolute;
  bottom: -1rem;
  right: -1rem;
  font-size: clamp(6rem, 15vw, 12rem);
  font-family: var(--font-y1vectura, 'Y1Vectura', sans-serif);
  font-weight: 900;
  color: var(--color-crimson-500);
  opacity: 0.04;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  transform: skewX(-4deg);
}

.dark .kanji-watermark {
  opacity: 0.06;
}

/* HUD bar */
.hud-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1.25rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-crimson-500) 25%, transparent);
  background: color-mix(in srgb, var(--color-crimson-500) 5%, transparent);
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.dark .hud-bar {
  background: color-mix(in srgb, var(--color-crimson-500) 8%, transparent);
}

.hud-label {
  color: var(--color-crimson-500);
  font-weight: 700;
}

.hud-divider {
  color: var(--color-crimson-500);
  opacity: 0.5;
  font-size: 0.6rem;
}

.hud-value {
  opacity: 0.8;
  letter-spacing: 0.15em;
}

.hud-spacer {
  flex: 1;
}

.hud-status {
  color: var(--color-deeppink-500);
  font-size: 0.65rem;
  opacity: 0.9;
}

/* Info column */
.char-info-col {
  padding: 1.75rem 2rem 2rem;
  position: relative;
  z-index: 1;
  border-right: 1px solid transparent;
}

@media (min-width: 1024px) {
  .char-info-col {
    border-right-color: color-mix(in srgb, var(--color-gray-200, #e5e7eb) 100%, transparent);
  }
  .dark .char-info-col {
    border-right-color: color-mix(in srgb, var(--color-gray-800, #1f2937) 100%, transparent);
  }
}

/* Character name */
.char-name {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
  gap: 0;
}

.char-name-jp {
  font-size: clamp(2rem, 6vw, 3.25rem);
  font-weight: 900;
  color: var(--color-crimson-500);
  line-height: 1;
  letter-spacing: -0.02em;
}

.char-name-en {
  font-family: var(--font-y1vectura, 'Y1Vectura', sans-serif);
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--color-crimson-500);
  opacity: 0.6;
  margin-top: 0.15rem;
}

.char-desc {
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  opacity: 0.85;
  border-left: 2px solid color-mix(in srgb, var(--color-crimson-500, #ff3342) 30%, transparent);
  padding-left: 0.75rem;
}

/* Stat grid — HUD readout style */
.stat-grid {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--color-gray-300, #d1d5db) 50%, transparent);
  background: color-mix(in srgb, var(--color-gray-100, #f3f4f6) 60%, transparent);
}

.dark .stat-grid {
  border-color: color-mix(in srgb, var(--color-gray-700, #374151) 60%, transparent);
  background: color-mix(in srgb, var(--color-gray-800, #1f2937) 40%, transparent);
}

.stat-row {
  display: grid;
  grid-template-columns: 5.5rem 1fr auto;
  align-items: center;
  gap: 0.6rem;
}

.stat-key {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.5;
}

.stat-bar-track {
  height: 2px;
  background: color-mix(in srgb, currentColor 15%, transparent);
  position: relative;
  overflow: hidden;
}

.stat-bar {
  display: block;
  position: absolute;
  inset: 0;
  height: 100%;
  background: var(--color-crimson-500);
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.stat-val {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* Personality */
.personality-block {
  border-left: 3px solid var(--color-deeppink-500);
  padding-left: 1rem;
}

.personality-header {
  margin-bottom: 0.5rem;
}

.personality-tag {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  background: var(--color-deeppink-500);
  color: white;
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 700;
}

.personality-text {
  font-size: 0.85rem;
  line-height: 1.6;
  opacity: 0.8;
}

/* Mood column */
.mood-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  position: relative;
  z-index: 1;
}

.mood-image-wrapper {
  position: relative;
  display: inline-block;
  width: auto;
  height: 25rem;
}

@media (min-width: 640px) {
  .mood-image-wrapper {
    height: 37.5rem;
  }
}

.mood-arrows-clip {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.mood-image-shadow {
  filter: drop-shadow(6px 6px 16px rgba(0, 0, 0, 1)) drop-shadow(0 0 30px rgba(255, 51, 66, 0.15));
}

.mood-label {
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: 0.8;
  font-style: italic;
  text-align: center;
}

/* ── Abilities + Spell grid ── */
.abilities-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 1024px) {
  .abilities-grid {
    grid-template-columns: 1fr 1.4fr;
  }
}

.ability-card,
.spell-card {
  background: white;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  overflow: hidden;
}

.dark .ability-card,
.dark .spell-card {
  background: var(--color-gray-900, #111827);
  border-color: var(--color-gray-800, #1f2937);
}

.ability-hud-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.45rem 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-deeppink-500) 25%, transparent);
  background: color-mix(in srgb, var(--color-deeppink-500) 6%, transparent);
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ability-card .hud-label {
  color: var(--color-deeppink-500);
}
.ability-card .hud-divider {
  color: var(--color-deeppink-500);
  opacity: 0.5;
}

.spell-card .ability-hud-bar {
  border-bottom-color: color-mix(in srgb, var(--color-royalblue-500) 25%, transparent);
  background: color-mix(in srgb, var(--color-royalblue-500) 6%, transparent);
}
.spell-card .hud-label {
  color: var(--color-royalblue-500);
}
.spell-card .hud-divider {
  color: var(--color-royalblue-500);
  opacity: 0.5;
}

.ability-body {
  padding: 1.25rem 1.25rem;
}

/* Ability targets */
.ability-target-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.ability-target {
  display: grid;
  grid-template-columns: 2rem 1fr 6rem;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid transparent;
  transition: border-color 0.15s, background 0.15s;
  cursor: default;
  position: relative;
}

.ability-target:hover {
  border-color: color-mix(in srgb, var(--color-deeppink-500) 30%, transparent);
  background: color-mix(in srgb, var(--color-deeppink-500) 5%, transparent);
}

.ability-target.ability-target--clickable {
  cursor: pointer;
}

.ability-index {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  color: var(--color-deeppink-500);
  opacity: 0.7;
  font-weight: 700;
}

.ability-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.ability-bar-fill {
  display: block;
  height: 3px;
  background: var(--color-deeppink-500);
  clip-path: polygon(0 0, 100% 0, calc(100% - 3px) 100%, 0 100%);
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Spell list */
.spell-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.spell-entry {
  display: grid;
  grid-template-columns: 2.5rem 1fr 0.5rem;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1.25rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-gray-200, #e5e7eb) 60%, transparent);
  transition: background 0.12s;
  cursor: default;
  position: relative;
}

.dark .spell-entry {
  border-bottom-color: color-mix(in srgb, var(--color-gray-800, #1f2937) 80%, transparent);
}

.spell-entry:last-child {
  border-bottom: none;
}

.spell-entry:hover {
  background: color-mix(in srgb, var(--color-royalblue-500) 6%, transparent);
}

.spell-entry:hover .spell-accent {
  opacity: 1;
  transform: scaleX(1);
}

.spell-num {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  color: var(--color-royalblue-500);
  font-weight: 700;
  opacity: 0.8;
}

.spell-text {
  font-size: 0.9rem;
  letter-spacing: 0.02em;
}

.spell-accent {
  display: block;
  width: 4px;
  height: 4px;
  background: var(--color-royalblue-500);
  transform: rotate(45deg) scaleX(0);
  transition: opacity 0.15s, transform 0.15s;
  opacity: 0;
  justify-self: center;
}

/* ── Dreamy mood text (preserved from original) ── */
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
}

@keyframes letterFloatY {
  0%, 100% { transform: translateY(0px) scale(1) rotateZ(0deg); }
  25% { transform: translateY(-4px) scale(1.5) rotateZ(-10deg); }
  50% { transform: translateY(5px) scale(1.02) rotateZ(5deg); }
  75% { transform: translateY(-5px) scale(1.08) rotateZ(-5deg); }
}

@keyframes letterFloatX {
  0%, 100% { transform: translateX(0px) scale(1) rotateZ(0deg); }
  25% { transform: translateX(-2px) scale(1.05) rotateZ(-1deg); }
  50% { transform: translateX(6px) scale(1.02) rotateZ(0deg); }
  75% { transform: translateX(-4px) scale(1.08) rotateZ(1deg); }
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
