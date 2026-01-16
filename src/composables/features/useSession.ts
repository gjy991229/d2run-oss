/**
 * Session management composable
 *
 * Handles current session state, run lifecycle, and session statistics.
 */

import { ref, type Ref } from 'vue';
import type { RunRecord } from '../../shared/types';
import { invoke } from '@tauri-apps/api/core';
import { MIN_RUN_DURATION_MS, SESSION_SAVE_THRESHOLD_MS } from '../../shared/constants';

/** Session composable return interface */
export interface UseSessionReturn {
    /** Current run number for the day */
    dailyRunCount: Ref<number>;
    /** Best time in current session */
    sessionBest: Ref<number>;
    /** Average time in current session */
    sessionAvg: Ref<number>;
    /** Number of runs in current session */
    sessionRunCount: Ref<number>;
    /** Total time spent in current session */
    sessionTotalTime: Ref<number>;
    /** Reset session stats for new scene */
    resetSessionStats: () => void;
    /** Load daily run count for scene */
    loadDailyRunCount: (sceneName: string) => Promise<void>;
    /** Update session stats after completing a run */
    updateSessionStats: (duration: number) => void;
    /** Check if duration is valid for saving */
    isValidRunDuration: (duration: number) => boolean;
    /** Check if duration meets session save threshold */
    meetsSessionSaveThreshold: (duration: number) => boolean;
    /** Create a run record */
    createRunRecord: (
        sceneId: string,
        duration: number,
        drops: string[],
        isTz: boolean
    ) => RunRecord;
    /** Save a run record */
    saveRun: (record: RunRecord) => Promise<void>;
    /** Increment daily run count */
    incrementDailyRunCount: () => void;
}

/**
 * Create session composable instance
 */
export function useSession(): UseSessionReturn {
    const dailyRunCount = ref(1);
    const sessionBest = ref(Infinity);
    const sessionAvg = ref(0);
    const sessionRunCount = ref(0);
    const sessionTotalTime = ref(0);

    /**
     * Reset session stats for new scene
     */
    function resetSessionStats(): void {
        sessionBest.value = Infinity;
        sessionAvg.value = 0;
        sessionRunCount.value = 0;
        sessionTotalTime.value = 0;
    }

    /**
     * Load daily run count for a specific scene
     */
    async function loadDailyRunCount(sceneName: string): Promise<void> {
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const runs: RunRecord[] = await invoke('get_runs', {
                filter: { startStr: todayStr, endStr: todayStr, sceneId: sceneName }
            });
            dailyRunCount.value = runs.length + 1;
        } catch {
            dailyRunCount.value = 1;
        }
    }

    /**
     * Update session stats after completing a run
     */
    function updateSessionStats(duration: number): void {
        sessionRunCount.value++;
        sessionTotalTime.value += duration;
        sessionAvg.value = Math.floor(sessionTotalTime.value / sessionRunCount.value);
        if (duration < sessionBest.value) {
            sessionBest.value = duration;
        }
    }

    /**
     * Check if duration is valid for saving
     */
    function isValidRunDuration(duration: number): boolean {
        return duration >= MIN_RUN_DURATION_MS;
    }

    /**
     * Check if duration meets session save threshold
     */
    function meetsSessionSaveThreshold(duration: number): boolean {
        return duration > SESSION_SAVE_THRESHOLD_MS;
    }

    /**
     * Create a run record
     */
    function createRunRecord(
        sceneId: string,
        duration: number,
        drops: string[],
        isTz: boolean
    ): RunRecord {
        return {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            date_str: new Date().toISOString().split('T')[0],
            scene_id: sceneId,
            duration_ms: duration,
            drops: [...drops],
            is_tz: isTz
        };
    }

    /**
     * Save a run record to database
     */
    async function saveRun(record: RunRecord): Promise<void> {
        await invoke('save_run', { run: record });
    }

    /**
     * Increment daily run count
     */
    function incrementDailyRunCount(): void {
        dailyRunCount.value++;
    }

    return {
        dailyRunCount,
        sessionBest,
        sessionAvg,
        sessionRunCount,
        sessionTotalTime,
        resetSessionStats,
        loadDailyRunCount,
        updateSessionStats,
        isValidRunDuration,
        meetsSessionSaveThreshold,
        createRunRecord,
        saveRun,
        incrementDailyRunCount
    };
}
