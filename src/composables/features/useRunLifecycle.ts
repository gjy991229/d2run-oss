/**
 * Run lifecycle management composable
 *
 * Orchestrates the main run loop: starting, stopping, pausing,
 * saving, and scene transitions. It delegates specific tasks to
 * other specialized composables.
 */

import { ref, computed, watch, type ComputedRef } from 'vue';
import { ACTION_THROTTLE_MS } from '../../shared/constants';
import type { UseTimerReturn } from '../core/useTimer';
import type { UseSessionReturn } from './useSession';
import type { UseDropRecordingReturn } from './useDropRecording';
import type { UseScenarioReturn } from './useScenario';
import type { UseHistoryReturn } from '../data/useHistory';
import type { UseSearchReturn } from './useSearch';
import type { UseNavigationReturn } from '../core/useNavigation';
import type { UseWindowReturn } from '../core/useWindow';

/** Run lifecycle composable return interface */
export interface UseRunLifecycleReturn {
    /** Whether the run is effectively paused (user paused or search open) */
    isEffectivePaused: ComputedRef<boolean>;
    /** Start a new run immediately */
    startNewRun: () => void;
    /** Finish current run and start next one */
    nextRun: () => Promise<void>;
    /** Finish current session and return to home */
    finishSession: () => Promise<void>;
    /** Toggle user pause state */
    togglePause: () => void;
    /** Select a scene and prepare for run */
    selectScene: (sceneName: string) => Promise<void>;
}

/**
 * Create run lifecycle composable instance
 */
export function useRunLifecycle(
    timer: UseTimerReturn,
    session: UseSessionReturn,
    drops: UseDropRecordingReturn,
    scenario: UseScenarioReturn,
    history: UseHistoryReturn,
    search: UseSearchReturn,
    navigation: UseNavigationReturn,
    windowMgr: UseWindowReturn
): UseRunLifecycleReturn {

    const lastActionTimestamp = ref(0);

    // Computed: effective pause state
    const isEffectivePaused = computed(() => {
        return timer.isUserPaused.value || search.isSearchOpen.value;
    });

    // === Throttle Helper ===
    function checkThrottle(): boolean {
        const now = Date.now();
        if (now - lastActionTimestamp.value < ACTION_THROTTLE_MS) return false;
        lastActionTimestamp.value = now;
        return true;
    }

    // Pause timing watcher
    watch(isEffectivePaused, (newVal, oldVal) => {
        if (!timer.isRunning.value) return;
        if (newVal && !oldVal) {
            timer.pauseStartTime.value = Date.now();
        } else if (!newVal && oldVal && timer.pauseStartTime.value > 0) {
            timer.totalPausedTime.value += Date.now() - timer.pauseStartTime.value;
        }
    });

    /**
     * Start a new run
     */
    function startNewRun() {
        timer.stop();
        timer.isUserPaused.value = false;
        search.closeSearch();
        drops.resetCurrentDrops();

        timer.start();
        // Pass function to check paused state
        timer.startTicker(() => isEffectivePaused.value);
    }

    /**
     * Finish current run and start next one
     */
    async function nextRun() {
        if (!scenario.currentScene.value || !timer.isRunning.value) return;
        if (!checkThrottle()) return;

        const duration = timer.elapsedTime.value;

        // If run is too short, just restart without saving
        if (!session.isValidRunDuration(duration)) {
            startNewRun();
            return;
        }

        session.updateSessionStats(duration);
        session.incrementDailyRunCount();

        const record = session.createRunRecord(
            scenario.currentScene.value.name,
            duration,
            drops.currentDrops.value,
            scenario.isTerrorZone.value
        );

        try {
            await session.saveRun(record);
            await history.loadHistory();
        } catch (e) {
            console.error(e);
        }

        startNewRun();
    }

    /**
     * Finish current session and return to home
     */
    async function finishSession() {
        if (!checkThrottle()) return;

        // Save current run if it's substantial
        if (timer.isRunning.value && session.meetsSessionSaveThreshold(timer.elapsedTime.value)) {
            const record = session.createRunRecord(
                scenario.currentScene.value?.name || '',
                timer.elapsedTime.value,
                drops.currentDrops.value,
                scenario.isTerrorZone.value
            );
            try {
                await session.saveRun(record);
                await history.loadHistory();
            } catch (e) {
                console.error(e);
            }
        }

        timer.stop();
        navigation.goHome();

        // Resize window for Home view
        // Note: tryResize logic is currently in runStore (handling custom sizes).
        // For now we delegate to windowMgr but runStore wrapper might need to handle custom config.
        // We will expose a resizing need or call a passed callback?
        // Let's assume the runStore will handle the complexity of "tryResize" by wrapping/passing 
        // the correct resize function to windowMgr or handling it itself.
        // Or better: useRunLifecycle doesn't need to know about "custom sizes" directly, 
        // but it does trigger the navigation which requires resize.

        // Ideally, runStore should listen to navigation changes or we assume standard resize here.
        // Let's call resizeForView from windowMgr directly here.
        // If runStore has custom override logic, it should probably override this or we pass a 'resize' function.
        // To keep it simple, we'll let runStore handle the specific "Home Resize" logic if possible, 
        // but here we just coordinate the flow.

        // Actually, looking at runStore `goHome` called `tryResize('HOME')`.
        // We will call the simple resize here. If we need custom sizes, we might need to inject `tryResize`.
        // Let's stick to what we have:
        windowMgr.resizeForView('HOME');
    }

    /**
     * Toggle user pause state
     */
    function togglePause() {
        if (!checkThrottle()) return;
        if (timer.isRunning.value) {
            timer.isUserPaused.value = !timer.isUserPaused.value;
        }
    }

    /**
     * Select a scene and prepare for run
     */
    async function selectScene(sceneName: string) {
        const scene = scenario.selectSceneByName(sceneName);
        if (!scene) return;

        navigation.goTimer();
        windowMgr.resizeForView('TIMER');

        session.resetSessionStats();
        drops.resetSessionDrops();

        await session.loadDailyRunCount(scene.name);
        startNewRun();
    }

    return {
        isEffectivePaused,
        startNewRun,
        nextRun,
        finishSession,
        togglePause,
        selectScene
    };
}
