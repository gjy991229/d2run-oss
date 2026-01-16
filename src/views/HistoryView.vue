<template>
  <div class="flex flex-col h-full w-full">
    <!-- Header -->
    <header 
      class="p-3 flex items-center justify-between border-b"
      :style="{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-bg-card)' }"
    >
      <h2 class="text-xs font-medium uppercase tracking-widest" :style="{ color: 'var(--theme-accent)' }">
        {{ store.t('LOGS') }}
      </h2>
      
      <div class="flex items-center gap-2">
        <button
          @click="store.openDashboard()"
          class="d2-btn-primary text-xs px-3 py-1.5 flex items-center justify-center"
        >
          <span class="mr-2 opacity-70"><i class="fa-solid fa-chart-line"></i></span>
          {{ store.t('ANALYZE') }}
        </button>
        
        <!-- Grail Button -->
        <button
          @click="store.openDashboard('grail')"
          class="d2-btn-primary text-xs px-3 py-1.5 flex items-center justify-center"
        >
          <span class="mr-2 opacity-70"><i class="fa-solid fa-gem"></i></span>
          {{ store.t('VIEW_GRAIL') }}
        </button>
      </div>
    </header>

    <!-- Filters -->
    <div class="border-b transition-all overflow-hidden" :style="{ borderColor: 'var(--theme-border)' }">
      <button 
        @click="isFilterOpen = !isFilterOpen"
        class="w-full p-2 flex items-center justify-between text-[0.6rem] opacity-70 hover:opacity-100 transition-opacity"
        :style="{ backgroundColor: 'var(--theme-bg-elevated)' }"
      >
        <span>{{ store.t('FILTER_INFO') }}</span>
        <span class="text-xs transition-transform" :class="{ 'rotate-180': !isFilterOpen }">▼</span>
      </button>
      
      <div v-show="isFilterOpen" class="p-3 space-y-2">
        <!-- Scene filter -->
        <select
          v-model="store.historyFilter.sceneId"
          @change="store.loadHistory()"
          class="d2-select text-sm w-full"
        >
          <option value="all">{{ store.t('SCENE_ALL') }}</option>
          <option v-for="s in scenes" :key="s.name" :value="s.name">
            {{ store.getSceneName(s) }}
          </option>
        </select>
  
        <!-- Date filters -->
        <div class="flex gap-2">
          <input
            type="date"
            v-model="store.historyFilter.startStr"
            @change="store.loadHistory()"
            class="d2-input flex-1 text-xs text-center cursor-pointer"
            style="color-scheme: dark"
          />
          <input
            type="date"
            v-model="store.historyFilter.endStr"
            @change="store.loadHistory()"
            class="d2-input flex-1 text-xs text-center cursor-pointer"
            style="color-scheme: dark"
          />
        </div>
      </div>
    </div>

    <!-- Primary Stats Row -->
    <div 
      class="grid grid-cols-3 divide-x py-2 border-b"
      :style="{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-bg-elevated)' }"
    >
      <div class="text-center px-2">
        <p class="d2-label text-[0.55rem] mb-0.5">{{ store.t('RUNS') }}</p>
        <p class="text-lg font-mono font-bold">{{ store.totalRuns }}</p>
      </div>
      <div class="text-center px-2">
        <p class="d2-label text-[0.55rem] mb-0.5">{{ store.t('BEST') }}</p>
        <p class="text-lg font-mono font-bold" :style="{ color: 'var(--theme-success)' }">
          {{ store.formatTime(store.sceneStats.best || 0) }}
        </p>
      </div>
      <div class="text-center px-2">
        <p class="d2-label text-[0.55rem] mb-0.5">{{ store.t('AVG') }}</p>
        <p class="text-lg font-mono font-bold" :style="{ color: 'var(--theme-accent)' }">
          {{ store.formatTime(store.sceneStats.avg || 0) }}
        </p>
      </div>
    </div>

    <!-- Extended Stats Row -->
    <div
      v-if="store.totalRuns > 0"
      class="grid grid-cols-4 divide-x py-1.5 border-b bg-opacity-50"
      :style="{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-bg-card)' }"
    >
      <div class="text-center px-2">
        <p class="d2-label text-[0.5rem] mb-0.5">{{ store.t('GRAIL_COMPLETION') }}</p>
        <p class="text-sm font-mono" :style="{ color: 'var(--theme-warning)' }">
          {{ store.grailStats.collected }}/{{ store.grailStats.total }}
        </p>
      </div>
      <div class="text-center px-2">
        <p class="d2-label text-[0.5rem] mb-0.5">{{ store.t('TOTAL_DROPS') }}</p>
        <p class="text-sm font-mono" :style="{ color: 'var(--theme-secondary)' }">
          {{ store.dropHistory.length }}
        </p>
      </div>
      <div class="text-center px-2">
        <p class="d2-label text-[0.5rem] mb-0.5">{{ store.t('TZ_COLUMN') }}</p>
        <p class="text-sm font-mono" :style="{ color: 'var(--theme-accent-secondary)' }">
          {{ store.detailedStats.tzRuns }}
        </p>
      </div>
      <div class="text-center px-2">
        <p class="d2-label text-[0.5rem] mb-0.5">{{ store.t('TOTAL_TIME') }}</p>
        <p class="text-sm font-mono" :style="{ color: 'var(--theme-info)' }">
          {{ store.formatTime(store.detailedStats.totalTime || 0) }}
        </p>
      </div>
    </div>

    <!-- Content -->
    <main class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
      
      <!-- Valuable Drops Section -->
      <section v-if="store.dropHistory.length > 0">
        <button 
          @click="isDropRecordsOpen = !isDropRecordsOpen"
          class="w-full flex items-center justify-between group mb-2"
        >
          <h3 class="d2-label text-[0.6rem] flex items-center gap-2">
            <span class="w-1 h-3 rounded-full" :style="{ backgroundColor: 'var(--theme-accent)' }"></span>
            {{ store.t('DROP_RECORDS') }}
          </h3>
          <span class="text-xs opacity-40 transition-transform" :class="{ 'rotate-180': !isDropRecordsOpen }">▼</span>
        </button>
        
        <div v-show="isDropRecordsOpen" class="flex flex-wrap gap-1.5">
          <div
            v-for="(drop, i) in store.dropHistory"
            :key="i"
            class="px-2 py-1 rounded text-xs d2-glass"
          >
            <span class="opacity-40 mr-1 font-mono">#{{ drop.runIdx }}</span>
            <span
              class="mr-1 uppercase tracking-tighter text-[0.65rem]"
              :style="{ color: drop.isTz ? 'var(--theme-accent-secondary)' : 'var(--theme-text-muted)' }"
            >[{{ drop.sceneNameZh }}]</span>
            <span :style="{ color: drop.color }">{{ drop.itemName }}</span>
          </div>
        </div>
      </section>

      <!-- All Runs Section -->
      <section>
        <button 
          @click="isAllLogsOpen = !isAllLogsOpen"
          class="w-full flex items-center justify-between group mb-2"
        >
          <h3 class="d2-label text-[0.6rem] flex items-center gap-2">
            <span class="w-1 h-3 rounded-full opacity-50" :style="{ backgroundColor: 'var(--theme-text-muted)' }"></span>
            {{ store.t('ALL_LOGS') }}
          </h3>
          <span class="text-xs opacity-40 transition-transform" :class="{ 'rotate-180': !isAllLogsOpen }">▼</span>
        </button>
        
        <div v-show="isAllLogsOpen" class="space-y-1.5">
          <div
            v-for="(run, index) in store.historyRecords"
            :key="run.id"
            class="p-2 rounded-lg group transition-all d2-card-hover"
            :style="{ 
              backgroundColor: 'var(--theme-bg-card)',
              borderColor: 'var(--theme-border)'
            }"
          >
            <!-- Main row -->
            <div class="flex items-center text-xs">
              <!-- Run number -->
              <span class="w-8 font-mono opacity-40">#{{ store.totalRuns - index }}</span>
              
              <!-- Date -->
              <span class="w-16 text-[0.6rem] font-mono opacity-40">{{ run.date_str }}</span>
              
              <!-- Scene name -->
              <span 
                class="flex-1 font-bold truncate"
                :style="{ color: run.is_tz ? 'var(--theme-accent-secondary)' : 'var(--theme-text)' }"
              >
                {{ store.getSceneName(run.scene_id) }}
              </span>
              
              <!-- Duration -->
              <span 
                class="w-16 text-right font-mono font-medium"
                :style="{ 
                  color: run.duration_ms < store.sceneStats.avg 
                    ? 'var(--theme-success)' 
                    : 'var(--theme-text-muted)' 
                }"
              >
                {{ store.formatTime(run.duration_ms) }}
              </span>
              
              <!-- Delete button -->
              <button
                @click="store.deleteRun(run.id)"
                class="ml-2 px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-red-500/20"
                :style="{ color: 'var(--theme-danger)' }"
              >
                ×
              </button>
            </div>

            <!-- Drops row -->
            <div v-if="run.drops && run.drops.length > 0" class="flex flex-wrap gap-1 mt-1.5 pl-8">
              <span
                v-for="itemId in run.drops"
                :key="itemId"
                class="text-[0.6rem] px-1.5 py-0.5 rounded d2-glass"
                :style="{ color: store.getItem(itemId)?.color }"
              >
                {{ store.getItemName(itemId) }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRunStore } from '@/stores/runStore';
import { SCENES } from '@/shared/data';

const store = useRunStore();
const scenes = SCENES;

// Collapsible states
const isFilterOpen = ref(true);
const isDropRecordsOpen = ref(true);
const isAllLogsOpen = ref(true);
</script>

<style scoped>
.stats-grid {
  --tw-divide-opacity: 1;
  border-color: var(--theme-border);
}

.stats-grid > :not([hidden]) ~ :not([hidden]) {
  border-color: var(--theme-border);
}
</style>

