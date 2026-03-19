<template>
  <div class="arrow-color-transition" :style="arrowColorVars">
    <!-- Hidden arrow pattern definition for card backgrounds -->
    <ArrowPatternDefs pattern-id="midi-arrows"/>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
      <div class="max-w-8xl mx-auto">
        <div class="mb-12 text-center">
          <h1 class="text-4xl sm:text-5xl font-bold text-blueviolet-500 dark:text-plum-400 mb-4">
            midis
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
            rip cirnodik
          </p>
          
          <!-- Search Bar -->
          <div class="relative max-w-md mx-auto mb-8">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search MIDI files by name..."
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 border-l-2 border-l-blueviolet-500 leading-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blueviolet-500 focus:border-transparent transition-all duration-200 relative z-0 font-mono"
            >
          </div>
        </div>
        
        <!-- MIDI Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div
            v-for="(midi, index) in filteredMidis"
            :key="index"
            class="group relative overflow-hidden p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blueviolet-400 dark:hover:border-blueviolet-500 transition-colors duration-150 animate-fade-in-up cursor-pointer"
            :style="`animation-delay: ${index * 50}ms`"
            @click="openMidiDetails(midi)"
          >
            <!-- Arrow pattern background - reveals from right on hover -->
            <div class="midi-card-arrows">
              <svg class="arrow-parallax-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" :style="arrowParallaxStyle">
                <rect width="100%" height="100%" fill="url(#midi-arrows)"/>
              </svg>
              <!-- Blur + opacity overlay -->
              <div class="absolute inset-0 backdrop-blur-[2px] bg-white/80 dark:bg-gray-900/80"/>
            </div>

            <div class="relative z-10">
              <h3 class="text-base font-bold text-gray-900 dark:text-white group-hover:text-blueviolet-600 dark:group-hover:text-blueviolet-400 transition-colors duration-300 truncate">
                {{ midi.name }}
              </h3>
              <p v-if="midi.alternativeName" class="text-xs text-gray-500 dark:text-gray-400 italic truncate mt-0.5">
                {{ midi.alternativeName }}
              </p>
              <div class="text-xs text-gray-600 dark:text-gray-300 mt-2 space-y-0.5">
                <p v-if="midi.originalArtist" class="truncate">
                  <span class="font-medium">Artist:</span> {{ midi.originalArtist }}<span v-if="midi.Circle"> ({{ midi.Circle }})</span>
                </p>
                <p v-if="midi.midiArranger" class="truncate">
                  <span class="font-medium">MIDI by:</span> {{ midi.midiArranger }}
                </p>
              </div>
              <div v-if="midi.versions?.length" class="flex flex-wrap gap-1 mt-2">
                <UiAngularTag v-for="version in midi.versions" :key="version.filename" :label="version.name" variant="blue" />
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Placeholders -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div
            v-for="n in 9"
            :key="n"
            class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3 animate-pulse"
          >
            <div class="h-5 bg-gray-300/20 mb-2 w-3/4"/>
            <div class="h-3 bg-gray-300/20 mb-3 w-1/2"/>
            <div class="h-3 bg-gray-300/20 mb-1 w-full"/>
            <div class="h-3 bg-gray-300/20 w-2/3"/>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="text-center py-6">
          <h1 class="text-4xl font-bold mb-6">
            oof
          </h1>
          <nuxt-img src="/seijaflustered.png" alt="seija-kij.in" class="mx-auto h-48 w-auto mb-2"/>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">couldn't load the midi files</h3>
          <p class="text-gray-800 dark:text-gray-400">the server might be having issues, try refreshing</p>
        </div>

        <!-- No Results Message -->
        <div v-else-if="filteredMidis.length === 0 && searchQuery" class="text-center py-2">
          <h1 class="text-4xl font-bold mb-6">
            huh?
          </h1>
          <nuxt-img src="/seijaflustered.png" alt="seija-kij.in" class="mx-auto h-48 w-auto mb-2"/>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">what the hell is {{searchQuery}}</h3>
          <p class="text-gray-800 dark:text-gray-400">there is no midi named {{ searchQuery }}</p>
        </div>
      </div>
    </div>

    <!-- MIDI Details Modal -->
    <UModal
      v-model:open="showModal"
      :ui="{
        content: 'max-w-7xl',
        header: 'relative overflow-hidden'
      }"
    >
        <template #header>
          <div class="modal-header-arrows">
            <ArrowPattern pattern-id="midi-arrows-modal" :parallax-style="arrowParallaxStyle"/>
            <div class="absolute inset-0 backdrop-blur-xs bg-white/90 dark:bg-gray-900/90 z-1"/>
          </div>
          <div class="relative z-10 flex items-center justify-between w-full">
            <div class="min-w-0 flex-1 mr-3">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white truncate">{{ selectedMidi?.name }}</h2>
              <p v-if="selectedMidi?.alternativeName" class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ selectedMidi.alternativeName }}</p>
            </div>
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="neutral"
              size="sm"
              aria-label="Close modal"
              class="shrink-0"
              @click="showModal = false"
            />
          </div>
        </template>

        <template #body>
          <div class="space-y-8">
            <!-- YouTube Embed -->
            <div v-if="selectedMidi?.youtubePreview">
              <div class="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <iframe
                    :src="`https://www.youtube.com/embed/${getYouTubeVideoId(selectedMidi.youtubePreview)}`"
                    class="absolute inset-0 w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen/>
              </div>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Original Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">Original Information</h3>

                <div v-if="selectedMidi?.originalTheme">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Original Theme</dt>
                  <dd class="text-gray-900 dark:text-white">{{ selectedMidi.originalTheme }}</dd>
                </div>

                <div v-if="selectedMidi?.originalComposer">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Original Composer</dt>
                  <dd class="text-gray-900 dark:text-white">{{ selectedMidi.originalComposer }}</dd>
                </div>

                <div v-if="selectedMidi?.originalArtist">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Original Artist</dt>
                  <dd class="text-gray-900 dark:text-white">{{ selectedMidi.originalArtist }}</dd>
                </div>

                <div v-if="selectedMidi?.Circle">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Circle</dt>
                  <dd class="text-gray-900 dark:text-white">{{ selectedMidi.Circle }}</dd>
                </div>
              </div>

              <!-- MIDI Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">MIDI Information</h3>

                <div v-if="selectedMidi?.midiArranger">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">MIDI Arranger</dt>
                  <dd class="text-gray-900 dark:text-white">{{ selectedMidi.midiArranger }}</dd>
                </div>

                <div v-if="selectedMidi?.midiEditor">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">MIDI Editor</dt>
                  <dd class="text-gray-900 dark:text-white">{{ selectedMidi.midiEditor }}</dd>
                </div>
              </div>
            </div>

            <!-- Download Versions -->
            <div v-if="selectedMidi?.versions?.length">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Versions</h3>
              <div class="grid gap-3">
                <div
                    v-for="version in selectedMidi.versions"
                    :key="version.filename"
                    class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors gap-3 sm:gap-0"
                >
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-white">{{ version.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ version.filename }}</div>
                  </div>
                  <UTooltip text="Download MIDI file">
                    <UButton
                        color="blueviolet"
                        variant="solid"
                        icon="i-heroicons-arrow-down-tray"
                        @click="downloadMidi(selectedMidi, version)"
                    >
                      <span class="hidden sm:inline">Download</span>
                      <span class="sm:hidden">DL</span>
                    </UButton>
                  </UTooltip>
                </div>
              </div>
            </div>
          </div>
        </template>


    </UModal>
  </div>
</template>

<script setup>
const { colorVars: arrowColorVars } = useSpecialOccasion()
const { arrowParallaxStyle } = useArrowParallax()

const title = 'MIDIs';
const description = 'my midis :)';

const route = useRoute();
const router = useRouter();

const searchQuery = ref(route.query.search || '');
const selectedMidi = ref(null);
const showModal = ref(false);

// Watch for changes in searchQuery and update URL
watch(searchQuery, (newQuery) => {
  const query = { ...route.query };
  if (newQuery.trim()) {
    query.search = newQuery.trim();
  } else {
    delete query.search;
  }

  router.replace({ query });
}, { immediate: false });

const { data: midiData, status: midiStatus } = useFetch('https://samba.seija-kij.in/public/midis/midis.json', {
  default: () => null,
  server: false,
});
const isLoading = computed(() => midiStatus.value === 'idle' || midiStatus.value === 'pending');
const hasError = computed(() => midiStatus.value === 'error');

// Computed property for filtered MIDIs
const filteredMidis = computed(() => {
  if (!midiData.value?.midis) {
    return [];
  }
  
  if (!searchQuery.value) {
    return midiData.value.midis;
  }
  
  const query = searchQuery.value.toLowerCase();
  return midiData.value.midis.filter(midi => 
    midi.name.toLowerCase().includes(query) ||
    (midi.alternativeName && midi.alternativeName.toLowerCase().includes(query)) ||
    (midi.originalTheme && midi.originalTheme.toLowerCase().includes(query)) ||
    (midi.originalArtist && midi.originalArtist.toLowerCase().includes(query)) ||
    (midi.Circle && midi.Circle.toLowerCase().includes(query))
  );
});

// Open MIDI details modal
const openMidiDetails = (midi) => {
  selectedMidi.value = midi;
  showModal.value = true;
};

// Extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/ |.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  return match ? match[1] : null;
};

// Download function
const downloadMidi = (midi, version) => {
  if (!import.meta.client) return;
  
  const baseUrl = 'https://samba.seija-kij.in/public/midis/';
  const link = document.createElement('a');
  link.href = baseUrl + version.filename;
  link.download = version.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// UModal handles escape key and scroll management automatically

useHead({
  title: `${title} | seija-kij.in`,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: 'midi, music, touhou, seija kijin, kijin seija, seija, kijin, seija-kij.in' },
    { name: 'robots', content: 'index, follow' },

    { property: 'og:title', content: `${title} | seija-kij.in` },
    { property: 'og:description', content: description },
    { property: 'og:url', content: 'https://seija-kij.in/midi' },

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

.midi-card-arrows {
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

.group:hover .midi-card-arrows {
  mask-position: 100% 0;
  -webkit-mask-position: 100% 0;
}

.modal-header-arrows {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #a855f7, #ec4899);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #9333ea, #db2777);
}
</style>