<template>
  <!-- Window resize handles -->
  <div
    class="fixed top-0 right-0 w-1.5 h-full cursor-e-resize z-[991] hover:bg-white/5 transition-colors"
    @mousedown="startResize('e', $event)"
  ></div>
  <div
    class="fixed bottom-0 left-0 w-full h-1.5 cursor-s-resize z-[991] hover:bg-white/5 transition-colors"
    @mousedown="startResize('s', $event)"
  ></div>
  <div
    class="fixed top-0 left-0 w-1.5 h-full cursor-w-resize z-[991] hover:bg-white/5 transition-colors"
    @mousedown="startResize('w', $event)"
  ></div>
  <div
    class="fixed top-0 left-0 w-full h-1.5 cursor-n-resize z-[991] hover:bg-white/5 transition-colors"
    @mousedown="startResize('n', $event)"
  ></div>
  <div
    class="fixed top-0 left-0 w-3 h-3 cursor-nw-resize z-[992]"
    @mousedown="startResize('nw', $event)"
  ></div>
  <div
    class="fixed top-0 right-0 w-3 h-3 cursor-ne-resize z-[992]"
    @mousedown="startResize('ne', $event)"
  ></div>
  <div
    class="fixed bottom-0 left-0 w-3 h-3 cursor-sw-resize z-[992]"
    @mousedown="startResize('sw', $event)"
  ></div>
  <div
    class="fixed bottom-0 right-0 w-3 h-3 cursor-se-resize z-[992]"
    @mousedown="startResize('se', $event)"
  ></div>

  <!-- Main container -->
  <div
    class="app-container w-full h-full flex flex-col overflow-hidden relative rounded-xl"
    :style="{
      backgroundColor: 'var(--theme-bg)',
      backdropFilter: 'blur(var(--theme-backdrop-blur))',
      WebkitBackdropFilter: 'blur(var(--theme-backdrop-blur))',
      color: 'var(--theme-text)',
      boxShadow: 'inset 0 0 0 1px var(--theme-border), 0 8px 32px rgba(0, 0, 0, 0.3)'
    }"
  >
    <!-- Tauri drag region for title bar (transparent overlay) -->
    <div data-tauri-drag-region class="absolute top-0 left-0 w-full h-6 z-[50]"></div>

    <!-- Back button (overlay, only visible on non-home/timer views) -->
    <div 
      v-if="store.view !== 'HOME' && store.view !== 'TIMER'"
      class="absolute top-2 left-2 z-[60] pointer-events-auto"
    >
      <button
        @click="store.goHome()"
        class="flex items-center gap-1 text-[0.65rem] opacity-60 hover:opacity-100 transition-opacity px-2 py-1 rounded-full d2-glass"
        :style="{ color: 'var(--theme-text-muted)' }"
      >
        <span class="text-xs">‹</span>
        <span>{{ store.t('BACK') }}</span>
      </button>
    </div>

    <!-- Scene name display (Timer view only, transparent overlay) -->
    <div
      v-if="store.view === 'TIMER'"
      class="absolute top-1.5 left-1/2 -translate-x-1/2 z-[60] text-[0.65rem] font-medium uppercase tracking-widest"
      :style="{ color: store.isTerrorZone ? 'var(--theme-accent-secondary)' : 'var(--theme-text-muted)' }"
    >
      {{ store.currentScene ? store.getSceneName(store.currentScene) : '' }}
    </div>

    <!-- Main content area with transition -->
    <main 
      class="w-full h-full overflow-hidden relative z-[10] transition-[padding] duration-300"
      :class="store.view !== 'HOME' ? 'pt-10' : ''"
    >
      <Transition name="fade-slide" mode="out-in">
        <HomeView v-if="store.view === 'HOME'" key="home" />
        <SelectionView v-else-if="store.view === 'SELECTION'" key="selection" />
        <TimerView v-else-if="store.view === 'TIMER'" key="timer" />
        <HistoryView v-else-if="store.view === 'HISTORY'" key="history" />
        <SettingsView v-else-if="store.view === 'SETTINGS'" key="settings" />
        <AboutView v-else-if="store.view === 'ABOUT'" key="about" />
      </Transition>
    </main>
  </div>

  <!-- Toast Notifications -->
  <ToastContainer />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRunStore } from './stores/runStore';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
import { MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT } from './shared/constants';
import HomeView from './views/HomeView.vue';
import SelectionView from './views/SelectionView.vue';
import TimerView from './views/TimerView.vue';
import HistoryView from './views/HistoryView.vue';
import SettingsView from './views/SettingsView.vue';
import AboutView from './views/AboutView.vue';
import ToastContainer from './components/ToastContainer.vue';

/** Keyboard event payload from Tauri global-key-press event */
interface KeyEventPayload {
  name: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
}

// Store initialization
const store = useRunStore();

// Global keyboard event handling
let unlistenShortcut: () => void;

/**
 * Handle window resizing via edge dragging
 * @param direction - Resize direction (e, w, s, n, nw, ne, sw, se)
 * @param event - Mouse event from drag start
 */
function startResize(direction: string, event: MouseEvent) {
  event.preventDefault();
  const startX = event.screenX;
  const startY = event.screenY;
  const win = getCurrentWindow();

  win.outerPosition().then((pos) => {
    win.outerSize().then((size) => {
      const startW = size.width;
      const startH = size.height;
      const startWinX = pos.x;
      const startWinY = pos.y;

      const onMouseMove = (e: MouseEvent) => {
        const deltaX = e.screenX - startX;
        const deltaY = e.screenY - startY;
        let newW = startW;
        let newH = startH;
        let newX = startWinX;
        let newY = startWinY;

        // Apply resize deltas based on direction
        if (direction.includes('e')) newW = startW + deltaX;
        if (direction.includes('w')) {
          newW = startW - deltaX;
          newX = startWinX + deltaX;
        }
        if (direction.includes('s')) newH = startH + deltaY;
        if (direction.includes('n')) {
          newH = startH - deltaY;
          newY = startWinY + deltaY;
        }

        // Enforce minimum window size
        if (newW < MIN_WINDOW_WIDTH) {
          if (direction.includes('w')) newX = startWinX + (startW - MIN_WINDOW_WIDTH);
          newW = MIN_WINDOW_WIDTH;
        }
        if (newH < MIN_WINDOW_HEIGHT) {
          if (direction.includes('n')) newY = startWinY + (startH - MIN_WINDOW_HEIGHT);
          newH = MIN_WINDOW_HEIGHT;
        }

        invoke('resize_window_custom', { width: newW, height: newH, x: newX, y: newY });
      };

      const onMouseUp = async () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        // Save the final size to config for the current view
        const finalSize = await win.outerSize();
        if (store.view) {
          await store.saveCustomViewSize(store.view, finalSize.width, finalSize.height);
        }
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });
}

/**
 * Handle global keyboard events and trigger shortcut actions
 * @param rawKey - Raw key name from system
 * @param modifiers - Object with ctrl, alt, shift flags
 */
function handleKeyPress(
  rawKey: string,
  modifiers: { ctrl: boolean; alt: boolean; shift: boolean }
) {
  // Escape key: close search or go back
  if (rawKey === 'Escape') {
    if (store.isSearchOpen) store.closeSearch();
    else if (store.view !== 'TIMER') store.goBack();
    return;
  }

  // Normalize key names
  let normalizedKey = rawKey;
  if (normalizedKey === 'Enter' || normalizedKey === 'NumpadEnter') normalizedKey = 'Return';
  if (normalizedKey === 'Backquote') normalizedKey = 'BackQuote';

  // If recording a shortcut key, apply it and return
  if (store.recordingKey) {
    store.applyRecordedKey({
      keycode: 0,
      alt: modifiers.alt,
      ctrl: modifiers.ctrl,
      shift: modifiers.shift,
      name: normalizedKey
    });
    return;
  }

  // Check if key matches any configured shortcut
  if (store.config && store.config.shortcuts) {
    for (const [action, binding] of Object.entries(store.config.shortcuts) as [string, any][]) {
      // Normalize key names for comparison (strip "Key" prefix if present)
      // This ensures compatibility between:
      // - Tauri backend sending "KeyP" vs fallback sending "P"
      // - Default configs using "KeyP" vs user configs using "P"
      let keyToMatch = normalizedKey;
      if (keyToMatch.startsWith('Key')) keyToMatch = keyToMatch.substring(3);
      if (keyToMatch === 'KpReturn' || keyToMatch === 'NumEnter') keyToMatch = 'Return';

      const normalizedBindingName = binding.name.startsWith('Key') 
        ? binding.name.substring(3) 
        : binding.name;
      let isMatch = normalizedBindingName === keyToMatch;
      if (isMatch) {
        if (binding.ctrl !== modifiers.ctrl) isMatch = false;
        if (binding.alt !== modifiers.alt) isMatch = false;
        if (binding.shift !== modifiers.shift) isMatch = false;
      }

      if (isMatch) {
        switch (action) {
          case 'NEXT_RUN':
            if (store.view === 'TIMER') store.nextRun();
            break;
          case 'FINISH_SESSION':
            if (store.view === 'TIMER') store.finishSession();
            break;
          case 'OPEN_SEARCH':
            if (store.view === 'TIMER') {
              store.isSearchOpen ? store.closeSearch() : store.openSearch();
            }
            break;
          case 'TOGGLE_PAUSE':
            if (store.view === 'TIMER') store.togglePause();
            break;
        }
        return;
      }
    }
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Load configuration and history on mount
  await store.loadConfig();
  store.checkCloudLogin();
  await store.loadHistory();
  store.applyThemeToDOM();
  store.tryResize('HOME');

  // Set up Tauri global key listener
  unlistenShortcut = await listen<KeyEventPayload>('global-key-press', (event) => {
    const payload = event.payload;
    handleKeyPress(payload.name, { ctrl: payload.ctrl, alt: payload.alt, shift: payload.shift });
  });

  // Global keydown listener as fallback
  const handleGlobalKeydown = (e: KeyboardEvent) => {
    // For input fields, only check shortcuts with modifiers
    if ((e.target as HTMLElement).tagName === 'INPUT') {
      if (!e.ctrlKey && !e.altKey) return;
    }
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;

    let rdevName = e.code;
    if (rdevName.startsWith('Key')) rdevName = rdevName.substring(3);
    if (e.key === 'Escape') rdevName = 'Escape';
    else if (e.code === 'Backquote') rdevName = 'BackQuote';
    else if (e.code === 'Enter') rdevName = 'Return';

    handleKeyPress(rdevName, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
  };

  window.addEventListener('keydown', handleGlobalKeydown, true);
});

onUnmounted(() => {
  if (unlistenShortcut) unlistenShortcut();
});
</script>

<style scoped>
.app-container {
  font-family: var(--font-sans);
}
</style>
