<template>
  <div class="flex flex-col h-full w-full">
    <!-- Header with Terror Zone toggle -->
    <header class="px-3 py-2 flex items-center justify-between border-b" :style="{ borderColor: 'var(--theme-border)' }">
      <h2 class="text-xs font-medium uppercase tracking-widest opacity-60">
        {{ store.t('SELECT_SCENE') || '选择场景' }}
      </h2>
      
      <!-- Terror Zone Toggle -->
      <button
        @click="store.toggleTerrorZone()"
        class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
        :class="store.isTerrorZone 
          ? 'border shadow-lg' 
          : 'd2-glass opacity-60 hover:opacity-100'"
        :style="store.isTerrorZone ? {
          borderColor: 'var(--theme-accent-secondary)',
          backgroundColor: 'rgba(163, 53, 238, 0.15)',
          color: 'var(--theme-accent-secondary)',
          boxShadow: '0 0 20px var(--theme-accent-secondary-glow)'
        } : {}"
      >
        <span 
          class="w-2 h-2 rounded-full transition-colors"
          :style="{ backgroundColor: store.isTerrorZone ? 'var(--theme-accent-secondary)' : 'var(--theme-text-subtle)' }"
        ></span>
        {{ store.isTerrorZone ? store.t('TZ_ON') : store.t('TZ_OFF') }}
      </button>
    </header>

    <!-- Scene Grid -->
    <main class="flex-1 overflow-y-auto custom-scrollbar p-3">
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="scene in scenes"
          :key="scene.name"
          @click="store.selectScene(scene.name)"
          class="scene-card group relative p-3 rounded-lg text-left transition-all duration-300 d2-card-hover"
          :style="{
            backgroundColor: 'var(--theme-bg-card)',
            borderColor: 'var(--theme-border)'
          }"
        >
          <!-- Hover glow -->
          <div 
            class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            :style="{ 
              background: `radial-gradient(ellipse at center, var(--theme-accent-glow) 0%, transparent 70%)`
            }"
          ></div>
          
          <!-- Content -->
          <div class="relative">
            <!-- Scene name -->
            <h3 
              class="text-sm font-bold mb-0.5 group-hover:text-glow transition-all"
              :style="{ color: 'var(--theme-text)' }"
            >
              {{ store.getSceneName(scene) }}
            </h3>
            
            <!-- Scene label/description -->
            <p 
              class="text-xs opacity-50 group-hover:opacity-70 transition-opacity"
              :style="{ color: 'var(--theme-text-muted)' }"
            >
              {{ store.getSceneLabel(scene) }}
            </p>
          </div>
          
          <!-- Arrow indicator -->
          <span 
            class="absolute right-3 top-1/2 -translate-y-1/2 text-lg opacity-0 group-hover:opacity-40 transition-all transform group-hover:translate-x-1"
            :style="{ color: 'var(--theme-accent)' }"
          >
            ›
          </span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRunStore } from '@/stores/runStore';
import { SCENES } from '@/shared/data';

const store = useRunStore();
const scenes = SCENES;
</script>

<style scoped>
.scene-card {
  border: 1px solid var(--theme-border);
}

.scene-card:hover {
  border-color: var(--theme-border-accent);
  transform: translateY(-2px);
}
</style>
