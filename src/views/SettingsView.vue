<template>
  <div class="flex flex-col h-full w-full">
    <main class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5" v-if="store.config">
      
      <!-- Language Section -->
      <section class="space-y-2">
        <button
          @click="languageExpanded = !languageExpanded"
          class="w-full flex items-center justify-between group"
        >
          <h3 class="d2-label group-hover:opacity-100 transition-opacity">
            {{ store.t('LANGUAGE') }}
          </h3>
          <span class="text-xs opacity-40 transition-transform" :class="{ 'rotate-180': languageExpanded }">
            ▼
          </span>
        </button>

        <Transition name="fade-slide">
          <div v-show="languageExpanded" class="flex gap-2">
            <button
              @click="setLanguage('CN')"
              class="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              :class="store.currentLang === 'CN' ? 'd2-btn-primary' : 'd2-btn-secondary'"
            >
              中文
            </button>
            <button
              @click="setLanguage('EN')"
              class="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              :class="store.currentLang === 'EN' ? 'd2-btn-primary' : 'd2-btn-secondary'"
            >
              English
            </button>
          </div>
        </Transition>
      </section>

      <!-- Theme Section -->
      <section class="space-y-2">
        <button
          @click="themeExpanded = !themeExpanded"
          class="w-full flex items-center justify-between group"
        >
          <h3 class="d2-label group-hover:opacity-100 transition-opacity">
            {{ store.t('THEME') }}
          </h3>
          <span class="text-xs opacity-40 transition-transform" :class="{ 'rotate-180': themeExpanded }">
            ▼
          </span>
        </button>

        <Transition name="fade-slide">
          <div v-show="themeExpanded" class="space-y-3">
            <!-- Theme Grid -->
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="theme in store.visibleThemes"
                :key="theme.id"
                @click="store.setTheme(theme.id)"
                class="p-3 rounded-lg text-left transition-all flex items-center gap-3 border"
                :style="{
                  backgroundColor: store.currentThemeId === theme.id ? 'var(--theme-bg-elevated)' : 'var(--theme-bg-card)',
                  borderColor: store.currentThemeId === theme.id ? 'var(--theme-border-accent)' : 'var(--theme-border)'
                }"
              >
                <!-- Color preview -->
                <span
                  class="w-4 h-4 rounded-full border-2 shrink-0"
                  :style="{ 
                    backgroundColor: theme.colors.accent,
                    borderColor: 'rgba(255,255,255,0.2)'
                  }"
                ></span>
                <!-- Theme name -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">
                    {{ store.currentLang === 'CN' ? theme.nameCN : theme.nameEN }}
                  </p>
                  <p v-if="theme.descriptionCN" class="text-[0.6rem] opacity-50 truncate">
                    {{ store.currentLang === 'CN' ? theme.descriptionCN : theme.descriptionEN }}
                  </p>
                </div>
                <!-- Premium badge -->
                <span v-if="theme.isPremium" class="text-[0.5rem] px-1.5 py-0.5 rounded d2-badge-accent">
                  ★
                </span>
              </button>
            </div>

            <!-- Opacity Slider -->
            <div class="space-y-2 pt-2">
              <div class="flex items-center justify-between text-xs">
                <span class="opacity-50">{{ store.t('OPACITY') }}</span>
                <span class="font-mono" :style="{ color: 'var(--theme-accent)' }">{{ store.themeOpacity }}%</span>
              </div>
              <input
                ref="opacitySlider"
                type="range"
                min="20"
                max="100"
                :value="store.themeOpacity"
                @input="handleOpacityInput"
                class="opacity-slider w-full h-1.5 rounded-full appearance-none cursor-pointer relative z-20"
                :style="{ '--value': ((store.themeOpacity - 20) / 80) * 100 }"
              />
            </div>
          </div>
        </Transition>
      </section>

      <!-- Cloud Sync Section -->
      <section class="space-y-2">
        <h3 class="d2-label">{{ store.t('CLOUD_SYNC') }}</h3>
        
        <div class="p-4 rounded-lg d2-card text-center">
          <!-- Logged In State -->
          <div v-if="store.cloudState.isLoggedIn" class="space-y-3">
            <div class="flex items-center justify-center gap-3">
              <div class="w-10 h-10 rounded-full overflow-hidden border-2" :style="{ borderColor: 'var(--theme-accent)' }">
                <img 
                  v-if="store.cloudState.userInfo?.avatarUrl" 
                  :src="store.cloudState.userInfo.avatarUrl" 
                  class="w-full h-full object-cover"
                  alt="avatar"
                >
                <span v-else class="w-full h-full flex items-center justify-center text-lg">🧙‍♂️</span>
              </div>
              <div class="text-left">
                <p class="text-[0.6rem] opacity-50">{{ store.t('LOGGED_IN') }}</p>
                <p class="font-bold truncate max-w-[8rem]" :style="{ color: 'var(--theme-accent)' }">
                  {{ store.cloudState.userInfo?.nickName || 'Nephalem' }}
                </p>
              </div>
            </div>

            <div class="flex gap-2 justify-center">
              <button
                @click="store.syncData()"
                class="d2-btn-primary py-2 px-4 text-xs min-w-[5rem]"
                :disabled="store.cloudState.isSyncing || store.syncCooldownRemaining > 0"
                :class="{ 'opacity-50 cursor-not-allowed': store.cloudState.isSyncing || store.syncCooldownRemaining > 0 }"
              >
                <span v-if="store.cloudState.isSyncing" class="animate-spin inline-block">⏳</span>
                <span v-else-if="store.syncCooldownRemaining > 0" class="font-mono">
                  {{ Math.floor(store.syncCooldownRemaining / 60) }}m {{ store.syncCooldownRemaining % 60 }}s
                </span>
                <span v-else>{{ store.t('SYNC_NOW') }}</span>
              </button>
              <button
                @click="store.logoutCloud()"
                class="d2-btn-danger py-2 px-4 text-xs"
              >
                {{ store.t('LOGOUT_BTN') }}
              </button>
            </div>
          </div>

          <!-- QR Code State -->
          <div v-else-if="store.cloudState.qrCodeUrl" class="flex flex-col items-center gap-3 py-2">
            <img 
              :src="store.cloudState.qrCodeUrl" 
              class="w-28 h-28 rounded-lg shadow-lg animate-pulse-glow"
              :style="{ backgroundColor: 'white', padding: '8px' }"
              alt="QR Code"
            />
            <p class="text-xs opacity-50 animate-pulse">{{ store.t('LOGIN_TIP') }}</p>
          </div>

          <!-- Not Logged In State -->
          <div v-else class="py-2">
            <button
              v-if="store.isCloudEnabled()"
              @click="store.startCloudLogin()"
              class="d2-btn-secondary py-2 px-6 text-xs"
              :disabled="store.cloudState.isLoading"
            >
              {{ store.cloudState.isLoading ? 'Loading...' : store.t('LOGIN_BTN') }}
            </button>
            <p v-else class="text-xs opacity-40">{{ store.t('CLOUD_UNAVAILABLE') }}</p>
          </div>
        </div>
      </section>

      <!-- Shortcuts Section -->
      <section class="space-y-2">
        <button
          @click="shortcutsExpanded = !shortcutsExpanded"
          class="w-full flex items-center justify-between group"
        >
          <h3 class="d2-label group-hover:opacity-100 transition-opacity">
            {{ store.t('SHORTCUTS') }}
          </h3>
          <span class="text-xs opacity-40 transition-transform" :class="{ 'rotate-180': shortcutsExpanded }">
            ▼
          </span>
        </button>

        <Transition name="fade-slide">
          <div v-show="shortcutsExpanded" class="space-y-2">
            <div
              v-for="item in shortcutList"
              :key="item.action"
              class="flex items-center justify-between p-3 rounded-lg d2-card"
            >
              <span class="text-sm">{{ store.t(item.key) }}</span>
              <button
                @click="store.startRecording(item.action)"
                class="min-w-[5rem] text-center px-3 py-1.5 rounded-md text-xs font-mono transition-all"
                :class="store.recordingKey === item.action 
                  ? 'animate-pulse border-2' 
                  : 'd2-btn-secondary'"
                :style="store.recordingKey === item.action ? {
                  borderColor: 'var(--theme-accent)',
                  backgroundColor: 'var(--theme-accent-glow)',
                  color: 'var(--theme-accent)'
                } : {}"
              >
                {{ store.recordingKey === item.action ? store.t('PRESS_KEY') : formatKey(store.config.shortcuts[item.action]) }}
              </button>
            </div>
          </div>
        </Transition>
      </section>

      <!-- Reset Button -->
      <div class="pt-4 text-center">
        <button
          @click="store.resetSettings()"
          class="d2-btn-danger py-2 px-6 text-xs"
        >
          {{ store.t('RESET') }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRunStore } from '@/stores/runStore';

const store = useRunStore();

// Collapsible section states
const languageExpanded = ref(false);
const themeExpanded = ref(false);
const shortcutsExpanded = ref(true);

/**
 * Set language directly
 */
async function setLanguage(lang: 'CN' | 'EN') {
  if (store.currentLang !== lang) {
    await store.toggleLanguage();
  }
}

// Debounce timer for opacity slider
let opacityTimer: number | null = null;

/**
 * Keyboard shortcut configuration for display
 */
const shortcutList = [
  { key: 'KEY_NEXT', action: 'NEXT_RUN' },
  { key: 'KEY_PAUSE', action: 'TOGGLE_PAUSE' },
  { key: 'KEY_SEARCH', action: 'OPEN_SEARCH' },
  { key: 'KEY_FINISH', action: 'FINISH_SESSION' }
];

/**
 * Format key binding to human-readable string
 * @param binding - Key binding object with ctrl, alt, shift, name properties
 * @returns Formatted key string like "Ctrl + A"
 */
function formatKey(binding: { ctrl?: boolean; alt?: boolean; shift?: boolean; name?: string } | undefined): string {
  if (!binding || !binding.name) return '...';
  const parts: string[] = [];
  if (binding.ctrl) parts.push('Ctrl');
  if (binding.alt) parts.push('Alt');
  if (binding.shift) parts.push('Shift');
  let name = binding.name;
  if (name.startsWith('Key')) name = name.substring(3);
  if (name === 'BackQuote') name = '~';
  if (name === 'Return') name = 'Enter';
  parts.push(name);
  return parts.join(' + ');
}

/**
 * Handle opacity slider change with debounce
 */
/**
 * Handle opacity slider input event
 * Updates the CSS variable immediately for smooth UI
 * Debounces the store update for performance
 */
function handleOpacityInput(e: Event) {
  const value = parseInt((e.target as HTMLInputElement).value);
  // Calculate percentage: (value - min) / (max - min) * 100
  // min = 20, max = 100, range = 80
  const percentage = ((value - 20) / 80) * 100;
  
  // Update CSS variable for the fill effect
  (e.target as HTMLElement).style.setProperty('--value', percentage.toString());
  
  // Clear previous timer
  if (opacityTimer) {
    clearTimeout(opacityTimer);
  }
  
  // Debounce the save operation
  opacityTimer = window.setTimeout(() => {
    store.setOpacity(value);
  }, 100);
}
</script>

<style scoped>
.opacity-slider {
  -webkit-appearance: none;
  appearance: none;
  background-color: var(--theme-bg-card);
  position: relative;
  z-index: 50;
  cursor: pointer;
  /* Critical for Electron/Tauri */
  -webkit-app-region: no-drag; 
  app-region: no-drag;
}

.opacity-slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    var(--theme-accent) 0%,
    var(--theme-accent) calc(var(--value, 50) * 1%),
    var(--theme-bg-card) calc(var(--value, 50) * 1%)
  );
  background-color: var(--theme-bg-card);
}

.opacity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--theme-accent);
  cursor: grab;
  margin-top: -5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  /* Removed transition for smoother dragging */
}

.opacity-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 12px var(--theme-accent-glow);
}

.opacity-slider::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.15);
}

.opacity-slider::-moz-range-track {
  height: 6px;
  border-radius: 3px;
  background-color: var(--theme-bg-card);
}

.opacity-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--theme-accent);
  cursor: grab;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>

