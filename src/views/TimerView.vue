<template>
  <div class="flex flex-col relative h-full w-full">
    
    <!-- Search overlay -->
    <Transition name="fade-slide">
      <div
        v-if="store.isSearchOpen"
        class="absolute inset-0 z-50 flex flex-col p-4"
        :style="{
          backgroundColor: 'var(--theme-bg-overlay)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <h3 class="d2-label" :style="{ color: 'var(--theme-accent)' }">
            {{ store.t('RECORD_DROP') }}
          </h3>
          <button 
            @click="store.closeSearch()"
            class="d2-btn-icon text-xs opacity-50 hover:opacity-100"
          >
            ✕
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative">
          <input
            ref="searchInput"
            type="text"
            v-model="store.searchQuery"
            @input="store.performSearch(($event.target as HTMLInputElement).value)"
            @keydown.up.prevent="store.navigateSearch(-1)"
            @keydown.down.prevent="store.navigateSearch(1)"
            @keydown.enter.prevent="handleSearchConfirm()"
            @keydown.esc="store.closeSearch()"
            class="d2-input text-sm pr-10"
            :placeholder="store.t('SEARCH_PH')"
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-30">
            ⌘
          </span>
        </div>

        <!-- Quality selector (for custom items) -->
        <div v-if="store.searchQuery && store.searchResults.length === 0" class="mt-3 space-y-2">
          <p class="text-xs opacity-50">{{ store.t('QUALITY_SELECT') }}:</p>
          <div class="flex gap-1 p-1 rounded-lg" :style="{ backgroundColor: 'var(--theme-bg-card)' }">
            <button
              v-for="(config, q) in store.qualityConfig"
              :key="q"
              @click="handleQualityClick(q)"
              class="flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all"
              :class="store.selectedQuality === q ? 'shadow-md' : 'opacity-60 hover:opacity-100'"
              :style="{
                color: config.color,
                backgroundColor: store.selectedQuality === q ? 'var(--theme-bg-elevated)' : 'transparent'
              }"
            >
              {{ store.currentLang === 'CN' ? config.cn : config.en }}
            </button>
          </div>
        </div>

        <!-- Search Results -->
        <div class="flex-1 overflow-y-auto custom-scrollbar mt-3 space-y-1">
          <!-- Custom item hint -->
          <div
            v-if="store.searchResults.length === 0 && store.searchQuery"
            class="p-3 rounded-lg text-center text-sm d2-glass"
          >
            <p class="opacity-50">{{ store.t('CUSTOM_TIP') }}</p>
            <p class="mt-1 font-medium" :style="{ color: 'var(--theme-accent)' }">
              "{{ store.searchQuery }}"
            </p>
          </div>

          <!-- Result items -->
          <button
            v-for="(item, idx) in store.searchResults"
            :key="item._id"
            class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center justify-between transition-all"
            :class="idx === store.searchIndex ? 'border-l-2' : 'opacity-70 hover:opacity-100'"
            :style="{
              backgroundColor: idx === store.searchIndex ? 'var(--theme-bg-elevated)' : 'transparent',
              borderLeftColor: idx === store.searchIndex ? item.color : 'transparent'
            }"
            @click="store.confirmDrop(item)"
          >
            <span :style="{ color: item.color }">{{ store.getItemName(item._id) }}</span>
            <span v-if="idx === store.searchIndex" class="text-xs opacity-40">Enter ↵</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Timer Section -->
    <div class="flex-1 flex flex-col">
      <!-- Run counter -->
      <div class="text-center pt-2 pb-1">
        <span class="d2-badge" :style="{ borderColor: 'var(--theme-border)', color: 'var(--theme-text-muted)' }">
          {{ store.t('RUNS') }} #{{ store.dailyRunCount }}
        </span>
      </div>

      <!-- Main Timer Display -->
      <div class="flex-1 flex items-center justify-center relative">
        <!-- Timer value -->
        <div
          class="text-5xl font-bold tracking-tight tabular-nums transition-all duration-200"
          :class="store.isEffectivePaused ? 'opacity-40 blur-[2px]' : ''"
          :style="{ 
            fontFamily: 'var(--font-mono)',
            color: 'var(--theme-text)',
            textShadow: store.isEffectivePaused ? 'none' : '0 0 30px rgba(255,255,255,0.1)'
          }"
        >
          {{ store.formatTime(store.elapsedTime) }}
        </div>

        <!-- Paused overlay -->
        <Transition name="fade-slide">
          <div 
            v-if="store.isEffectivePaused" 
            class="absolute inset-0 flex items-center justify-center"
          >
            <span
              class="px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] animate-pulse rounded"
              :style="{
                color: 'var(--theme-danger)',
                backgroundColor: 'var(--theme-bg-card)',
                borderTop: '1px solid var(--theme-danger-glow)',
                borderBottom: '1px solid var(--theme-danger-glow)'
              }"
            >
              {{ store.t('PAUSED') }}
            </span>
          </div>
        </Transition>
      </div>

      <!-- Stats Row -->
      <div class="flex justify-center gap-8 py-3">
        <div class="text-center">
          <p class="d2-label text-[0.6rem] mb-0.5">{{ store.t('BEST') }}</p>
          <p class="text-lg font-mono font-bold" :style="{ color: 'var(--theme-success)' }">
            {{ store.formatTime(store.sessionBest) }}
          </p>
        </div>
        <div class="text-center">
          <p class="d2-label text-[0.6rem] mb-0.5">{{ store.t('AVG') }}</p>
          <p class="text-lg font-mono font-bold" :style="{ color: 'var(--theme-info)' }">
            {{ store.formatTime(store.sessionAvg) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Session Drops -->
    <div 
      class="h-16 border-t p-2 overflow-y-auto custom-scrollbar"
      :style="{ 
        borderColor: 'var(--theme-border)',
        backgroundColor: 'var(--theme-bg-card)'
      }"
    >
      <!-- Empty state -->
      <div v-if="store.sessionDrops.length === 0" class="h-full flex items-center justify-center">
        <span class="text-xs opacity-30 italic">{{ store.t('NO_DROPS') }}</span>
      </div>

      <!-- Drop items -->
      <div v-else class="flex flex-wrap gap-1.5 content-start">
        <div
          v-for="(drop, idx) in store.sessionDrops"
          :key="idx"
          class="inline-flex items-center px-2 py-1 rounded d2-glass"
        >
          <span class="text-[0.6rem] font-mono opacity-40 mr-1.5">#{{ drop.runNumber }}</span>
          <span class="text-xs font-medium" :style="{ color: store.getItem(drop.itemId)?.color }">
            {{ store.getItemName(drop.itemId) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useRunStore } from '@/stores/runStore';
import { invoke } from '@tauri-apps/api/core';

const store = useRunStore();
const searchInput = ref<HTMLInputElement | null>(null);

/**
 * Handle quality selection click
 * If searching and no results (custom item mode), save immediately with selected quality
 */
function handleQualityClick(q: any) {
  store.selectedQuality = q;
  if (store.searchQuery && store.searchResults.length === 0) {
    store.createCustomItem(store.searchQuery, q);
  }
}

/**
 * Handle search confirm - check if there are results or create custom item
 */
function handleSearchConfirm() {
  if (store.searchResults.length > 0) {
    store.confirmDrop();
  } else {
    store.createCustomItem(store.searchQuery, store.selectedQuality);
  }
}

// Auto-focus search input when opened using Rust backend force activate
watch(
  () => store.isSearchOpen,
  async (val) => {
    if (val) {
      // 1. Force backend to activate window (bypass some OS restrictions)
      await invoke('force_activate');
      // 2. Wait for DOM update
      nextTick(() => {
        // 3. Focus input
        searchInput.value?.focus();
      });
    }
  }
);
</script>
