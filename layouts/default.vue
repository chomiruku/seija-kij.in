<template>
  <div class="seija-flip-wrapper min-h-screen flex flex-col bg-gradient-to-br from-white dark:from-blue-200/10 via-orange-200 dark:via-red-600/10 to-purple-400 dark:to-red-900/10 w-full">
    <LayoutNavbar/>
    <LayoutTimeBanner/>

    <!-- Main Content -->
    <main class="flex-1 mx-auto w-full">
      <slot />
    </main>

    <LayoutFooter/>
  </div>
</template>

<script setup>
useSeijaFlip()
</script>

<style>
@reference "tailwindcss";

/* Register arrow color custom properties so browsers can interpolate them */
@property --arrow-bg {
  syntax: '<color>';
  inherits: true;
  initial-value: #111111;
}
@property --arrow-grey {
  syntax: '<color>';
  inherits: true;
  initial-value: #424242;
}
@property --arrow-white {
  syntax: '<color>';
  inherits: true;
  initial-value: #ffffff;
}
@property --arrow-red {
  syntax: '<color>';
  inherits: true;
  initial-value: #cc0000;
}
@property --arrow-black {
  syntax: '<color>';
  inherits: true;
  initial-value: #111111;
}

@font-face {
  font-family: "Y1Vectura";
  src: url('/assets/fonts/Y1Vectura.otf') format('opentype');
  font-display: swap;
}

@font-face {
  font-family: "Azonix-1VB0";
  src: url('/assets/fonts/Azonix-1VB0.otf') format('opentype');
  font-display: swap;
}

.navbar a[class*="router-link-active"] {
  @apply text-red-500 dark:text-red-400;
}

.navbar a:hover {
  @apply text-red-600 dark:text-red-300;
}

.navbar-brand {
  font-family: "Y1Vectura", monospace;
  text-transform: lowercase;
}

.time-banner-text {
  font-family: "Azonix-1VB0", cursive;
}

.navbar-arrows {
  overflow: hidden;
  transition:
    --arrow-bg 2s ease,
    --arrow-grey 2s ease,
    --arrow-white 2s ease,
    --arrow-red 2s ease,
    --arrow-black 2s ease;
}

/* Navbar blur zones - single blur per group, no seams between links */
.navbar-blur-zone {
  position: relative;
  display: flex;
  align-items: stretch;
  overflow: visible;
}

.navbar-blur-zone::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  backdrop-filter: blur(4px);
  background: rgb(255 255 255 / 0.9);
  z-index: 0;
}

.dark .navbar-blur-zone::before {
  background: rgb(17 24 39 / 0.9);
}

/* Brand: opaque over text, fade out past the right edge */
.navbar-brand-fade::before {
  left: 0;
  right: -3rem;
  mask-image: linear-gradient(to right, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to right, black 70%, transparent);
}

/* Links: opaque over text, fade out past the left edge */
.navbar-links-fade::before {
  left: -3rem;
  right: 0;
  mask-image: linear-gradient(to left, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to left, black 85%, transparent);
}

/* Mobile: uniform blur across entire navbar */
.navbar-mobile-blur {
  backdrop-filter: blur(4px);
  background: rgb(255 255 255 / 0.9);
}

.dark .navbar-mobile-blur {
  background: rgb(17 24 39 / 0.9);
}

html.seija-flipped .seija-flip-wrapper {
  transform: rotate(180deg);
}

html.seija-flip-transition .seija-flip-wrapper {
  transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
