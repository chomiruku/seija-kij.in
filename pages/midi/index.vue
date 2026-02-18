<template>
  <div>
    <!-- Shared arrow pattern definition -->
    <svg class="absolute w-0 h-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="midi-arrows" x="0" y="0" width="600" height="200" patternTransform="rotate(-60) scale(0.25)" patternUnits="userSpaceOnUse">
          <animate attributeName="x" from="0" to="600" dur="30s" repeatCount="indefinite"/>
          <rect width="600" height="200" :fill="arrowColors.background"/>
          <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" stroke-linejoin="miter" transform="translate(-150,-100)"/>
          <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" transform="translate(450,-100)"/>
          <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" transform="translate(-150,100)"/>
          <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.grey" :stroke="arrowColors.grey" stroke-width="1.5" transform="translate(450,100)"/>
          <polygon points="0,50 150,50 150,0 300,100 150,200 150,150 0,150" :fill="arrowColors.white" :stroke="arrowColors.white" stroke-width="1.5" stroke-linejoin="miter"/>
          <polygon points="0,50 150,50 150,0 300,100 150,200 150,150 0,150" :fill="arrowColors.red" :stroke="arrowColors.red" stroke-width="1.5" stroke-linejoin="miter" transform="translate(300,0)"/>
          <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.black" :stroke="arrowColors.black" stroke-width="1.5" stroke-linejoin="miter" transform="translate(150,-100)"/>
          <polygon points="300,50 150,50 150,0 0,100 150,200 150,150 300,150" :fill="arrowColors.black" :stroke="arrowColors.black" stroke-width="1.5" stroke-linejoin="miter" transform="translate(150,100)"/>
        </pattern>
      </defs>
    </svg>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
      <div class="max-w-8xl mx-auto">
        <div class="mb-12 text-center">
          <h1 class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-200 dark:via-pink-200 dark:to-red-200 bg-clip-text text-transparent mb-4">
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
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 relative z-0"
            >
          </div>
        </div>
        
        <!-- MIDI Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div
            v-for="(midi, index) in filteredMidis"
            :key="index"
            class="group relative overflow-hidden p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-600 animate-fade-in-up cursor-pointer"
            :style="`animation-delay: ${index * 50}ms`"
            @click="openMidiDetails(midi)"
          >
            <!-- Arrow pattern background - reveals from right on hover -->
            <div class="midi-card-arrows">
              <svg class="absolute inset-0 w-full h-full" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <rect width="100%" height="100%" fill="url(#midi-arrows)"/>
              </svg>
              <!-- Blur + opacity overlay -->
              <div class="absolute inset-0 backdrop-blur-[2px] bg-white/80 dark:bg-gray-900/80"/>
            </div>

            <div class="relative z-10">
              <h3 class="text-base font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 truncate">
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
                <span v-for="version in midi.versions" :key="version.filename" class="inline-block px-2 py-0.5 text-[10px] font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                  {{ version.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Placeholders -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div
            v-for="n in 9"
            :key="n"
            class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-md p-4 animate-pulse"
          >
            <div class="h-5 bg-gray-300/20 rounded mb-2 w-3/4"/>
            <div class="h-3 bg-gray-300/20 rounded mb-3 w-1/2"/>
            <div class="h-3 bg-gray-300/20 rounded mb-1 w-full"/>
            <div class="h-3 bg-gray-300/20 rounded w-2/3"/>
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
      :title="selectedMidi?.name"
      :description="selectedMidi?.alternativeName"
      :ui="{
        content: 'max-w-7xl'
      }"
    >
        <template #body>
          <div class="space-y-8">
            <!-- YouTube Embed -->
            <div v-if="selectedMidi?.youtubePreview">
              <div class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
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
                    class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors gap-3 sm:gap-0"
                >
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-white">{{ version.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ version.filename }}</div>
                  </div>
                  <UTooltip text="Download MIDI file">
                    <UButton
                        color="purple"
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
const { colors: arrowColors } = useSpecialOccasion()

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
  transition: mask-position 0.5s ease-out, -webkit-mask-position 0.5s ease-out;
}

.group:hover .midi-card-arrows {
  mask-position: 100% 0;
  -webkit-mask-position: 100% 0;
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