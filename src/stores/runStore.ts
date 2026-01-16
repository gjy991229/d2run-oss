import { defineStore } from 'pinia';
import type { AppViewStr } from '../shared/constants';
import { QUALITY_CONFIG } from '../shared/constants';
import { THEMES } from '../shared/themes';
import { formatTime } from '../shared/utils';
import { invoke } from '@tauri-apps/api/core';

// Composable imports
// Composable imports
import { useTimer } from '@/composables/core/useTimer';
import { useWindow } from '@/composables/core/useWindow';
import { useNavigation } from '@/composables/core/useNavigation';
import { useTheme } from '@/composables/core/useTheme';
import { useCloudSync } from '@/composables/data/useCloudSync';
import { useI18n } from '@/composables/core/useI18n';
import { useScenario } from '@/composables/features/useScenario';
import { useSession } from '@/composables/features/useSession';
import { useDropRecording } from '@/composables/features/useDropRecording';
import { useSearch } from '@/composables/features/useSearch';
import { useConfig } from '@/composables/core/useConfig';
import { useHistory } from '@/composables/data/useHistory';
import { useStats } from '@/composables/data/useStats';
import { useDashboard } from '@/composables/data/useDashboard';
import { useRunLifecycle } from '@/composables/features/useRunLifecycle';

/**
 * Main run store - Composition-based Facade
 * 
 * This store now acts purely as a wiring layer (Composition Root).
 * All logic has been delegated to specialized composables.
 */
export const useRunStore = defineStore('run', () => {
  // 1. Initialize Base Composables
  const timer = useTimer();
  const windowMgr = useWindow();
  const navigation = useNavigation();
  const themeComposable = useTheme();
  const i18n = useI18n();
  const cloudSyncComposable = useCloudSync();
  const configComposable = useConfig();

  // 2. Initialize Data & Logic Composables
  const scenario = useScenario();
  const session = useSession();
  const drops = useDropRecording();
  const search = useSearch();

  // History needs Cloud
  const historyComposable = useHistory(cloudSyncComposable);

  // Stats needs History & Helpers
  const statsComposable = useStats(
    historyComposable.historyRecords,
    i18n.currentLang,
    (s) => scenario.getSceneName(s, i18n.currentLang.value),
    drops.getItem
  );

  // 3. Define Helper Functions (Glues)

  // Custom resize logic that respects config
  function tryResize(targetView: AppViewStr) {
    const customSizes = configComposable.config.value?.customViewSizes;
    if (customSizes?.[targetView]) {
      const custom = customSizes[targetView];
      invoke('resize_window', { width: custom.w, height: custom.h }).catch(console.error);
    } else {
      windowMgr.resizeForView(targetView);
    }
  }

  // Wrapper for config operations that need dependencies
  async function loadConfig() {
    await configComposable.loadConfig(themeComposable);
  }

  async function resetSettings() {
    await configComposable.resetSettings(themeComposable, (v) => tryResize(v as AppViewStr), navigation.view.value);
  }

  async function toggleLanguage() {
    await i18n.toggleLanguage(configComposable.config);
  }

  async function setTheme(themeId: string) {
    await themeComposable.setTheme(themeId, configComposable.config);
  }

  async function setOpacity(opacity: number) {
    await themeComposable.setOpacity(opacity, configComposable.config);
  }

  async function unlockPremium() {
    await themeComposable.unlockPremium(configComposable.config);
  }

  // 4. Initialize Lifecycle & Dashboard

  const dashboardComposable = useDashboard(
    historyComposable.historyRecords,
    historyComposable.loadHistory
  );

  // Create a wrapped Window Manager that uses tryResize instead of raw resizeForView
  const wrappedWindowMgr = {
    ...windowMgr,
    resizeForView: (view: string) => tryResize(view as AppViewStr) // Cast safe as we control calls
  };

  const lifecycle = useRunLifecycle(
    timer,
    session,
    drops,
    scenario,
    historyComposable,
    search,
    navigation,
    wrappedWindowMgr
  );

  // 5. Navigation Helpers (combining nav + resize + stops)

  function goHome() {
    lifecycle.finishSession(); // finishSession handles stop, nav, and resize(HOME)
  }

  function goSelection() {
    navigation.goSelection();
    tryResize('SELECTION');
    scenario.resetScenario();
  }

  async function goHistory() {
    navigation.goHistory();
    tryResize('HISTORY');
    historyComposable.historyFilter.value.startStr = '';
    historyComposable.historyFilter.value.endStr = '';
    await historyComposable.loadHistory();
  }

  function goSettings() {
    navigation.goSettings();
    tryResize('SETTINGS');
  }

  function goAbout() {
    navigation.goAbout();
    tryResize('ABOUT');
  }

  function goBack() {
    navigation.goBack(timer.stop);
    if (navigation.view.value === 'HOME') tryResize('HOME');
  }

  // Search Helpers
  function createCustomItem(name: string, quality?: string) {
    search.createCustomItem(name, quality, i18n.t, (itemId) => {
      drops.currentDrops.value.push(itemId);
      drops.sessionDrops.value.unshift({ itemId, runNumber: session.dailyRunCount.value });
    });
  }

  function confirmDrop(item?: any) {
    search.confirmDrop(item, (itemId) => {
      drops.currentDrops.value.push(itemId);
      drops.sessionDrops.value.unshift({ itemId, runNumber: session.dailyRunCount.value });
    });
  }

  // Cloud Helpers
  function calcCooldown() {
    return cloudSyncComposable.calcCooldown(configComposable.config.value);
  }

  // 6. Public API Export
  return {
    // View & Window
    view: navigation.view,
    viewSizes: windowMgr.viewSizes,
    updateCurrentViewSize: (w: number, h: number) => {
      windowMgr.updateViewSize(navigation.view.value, w, h);
    },
    saveCustomViewSize: configComposable.saveCustomViewSize,
    tryResize,

    // Timer & Run State
    isRunning: timer.isRunning,
    isUserPaused: timer.isUserPaused,
    elapsedTime: timer.elapsedTime,
    startTime: timer.startTime,
    totalPausedTime: timer.totalPausedTime,
    pauseStartTime: timer.pauseStartTime,

    // Lifecycle
    isEffectivePaused: lifecycle.isEffectivePaused,
    startNewRun: lifecycle.startNewRun,
    nextRun: lifecycle.nextRun,
    finishSession: lifecycle.finishSession,
    togglePause: lifecycle.togglePause,
    selectScene: lifecycle.selectScene,
    toggleTerrorZone: scenario.toggleTerrorZone,

    // Data State
    currentScene: scenario.currentScene,
    isTerrorZone: scenario.isTerrorZone,
    currentDrops: drops.currentDrops,
    sessionDrops: drops.sessionDrops,
    dailyRunCount: session.dailyRunCount,
    sessionBest: session.sessionBest,
    sessionAvg: session.sessionAvg,

    // Stats & History
    historyFilter: historyComposable.historyFilter,
    historyRecords: historyComposable.historyRecords,
    loadHistory: historyComposable.loadHistory,
    deleteRun: historyComposable.deleteRun,
    totalRuns: statsComposable.totalRuns,
    sceneStats: statsComposable.sceneStats,
    detailedStats: statsComposable.detailedStats,
    sceneBreakdown: statsComposable.sceneBreakdown,
    dropHistory: statsComposable.dropHistory,
    collectedItemsSet: statsComposable.collectedItemsSet,
    grailStats: statsComposable.grailStats,

    // Search
    isSearchOpen: search.isSearchOpen,
    searchQuery: search.searchQuery,
    searchResults: search.searchResults,
    searchIndex: search.searchIndex,
    selectedQuality: search.selectedQuality,
    openSearch: search.openSearch,
    closeSearch: search.closeSearch,
    performSearch: search.performSearch,
    navigateSearch: search.navigateSearch,
    createCustomItem,
    confirmDrop,
    qualityConfig: QUALITY_CONFIG,

    // Config & Settings
    config: configComposable.config,
    recordingKey: configComposable.recordingKey,
    loadConfig,
    resetSettings,
    startRecording: configComposable.startRecording,
    applyRecordedKey: configComposable.applyRecordedKey,
    cancelRecording: configComposable.cancelRecording,

    // Theme
    themes: THEMES,
    visibleThemes: themeComposable.visibleThemes,
    currentThemeId: themeComposable.currentThemeId,
    currentTheme: themeComposable.currentTheme,
    premiumUnlocked: themeComposable.premiumUnlocked,
    themeOpacity: themeComposable.themeOpacity,
    setTheme,
    setOpacity,
    unlockPremium,
    applyThemeToDOM: themeComposable.applyThemeToDOM,

    // I18n
    currentLang: i18n.currentLang,
    t: i18n.t,
    toggleLanguage,

    // Navigation
    goHome,
    goSelection,
    goHistory,
    goSettings,
    goAbout,
    goBack,
    openDashboard: dashboardComposable.openDashboard,

    // Cloud - Use dynamic calls to get the correct instance after initialization
    // Use getters to ensure we always access the current instance's state
    get cloudState() { return useCloudSync().cloudState; },
    get cloudRecords() { return useCloudSync().cloudRecords; },
    get syncCooldownRemaining() { return useCloudSync().syncCooldownRemaining; },
    isCloudEnabled: () => useCloudSync().isCloudEnabled(),
    startCloudLogin: () => useCloudSync().startCloudLogin(configComposable.config, i18n.t),
    logoutCloud: () => useCloudSync().logoutCloud(configComposable.config, i18n.t),
    syncData: () => useCloudSync().syncData(configComposable.config, historyComposable.historyFilter, i18n.t, async () => {
      historyComposable.clearLocalRecords();
      await historyComposable.loadHistory();
    }),
    checkCloudLogin: () => useCloudSync().checkCloudLogin(configComposable.config.value),
    clearAuthFlow: () => useCloudSync().clearAuthFlow(),
    calcCooldown,

    // Helpers
    getItem: drops.getItem,
    getItemName: (id: string) => {
      const item = drops.getItem(id);
      return item ? (i18n.currentLang.value === 'CN' ? item.name_zh : item.name) : id;
    },
    getSceneName: (s: any) => scenario.getSceneName(s, i18n.currentLang.value),
    getSceneLabel: (s: any) => scenario.getSceneLabel(s, i18n.currentLang.value),
    formatTime,
  };
});
