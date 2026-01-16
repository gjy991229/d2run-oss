/**
 * Statistics calculation composable
 *
 * Provides computed statistics for run history including totals,
 * scene breakdown, and grail/collection progress.
 */

import { computed, type Ref, type ComputedRef } from 'vue';
import type { RunRecord, Scene, ItemIndex } from '../../shared/types';
import { SCENES, ITEMS } from '../../shared/data';

/** Drop history entry for display */
export interface DropHistoryEntry {
    runIdx: number;
    itemName: string;
    itemNameZh: string;
    color: string;
    sceneNameZh: string;
    isTz: boolean;
}

/** Scene breakdown statistics */
export interface SceneBreakdownEntry {
    name: string;
    count: number;
    drops: number;
    totalTime: number;
    avgTime: number;
}

/** Detailed run statistics */
export interface DetailedStats {
    totalRuns: number;
    totalTime: number;
    best: number;
    worst: number;
    avg: number;
    totalDrops: number;
    tzRuns: number;
    runPerDay: string;
}

/** Grail/collection progress */
export interface GrailStats {
    total: number;
    collected: number;
    percentage: number;
}

/** Statistics composable return interface */
export interface UseStatsReturn {
    /** Total number of runs */
    totalRuns: ComputedRef<number>;
    /** Scene-level best and average stats */
    sceneStats: ComputedRef<{ best: number; avg: number }>;
    /** Detailed statistics for all runs */
    detailedStats: ComputedRef<DetailedStats>;
    /** Statistics broken down by scene */
    sceneBreakdown: ComputedRef<SceneBreakdownEntry[]>;
    /** Drop history with item details */
    dropHistory: ComputedRef<DropHistoryEntry[]>;
    /** Set of all collected item IDs */
    collectedItemsSet: ComputedRef<Set<string>>;
    /** Grail/collection progress stats */
    grailStats: ComputedRef<GrailStats>;
}

/**
 * Create statistics composable instance
 *
 * @param historyRecords - Ref to history records array
 * @param currentLang - Ref to current language ('CN' | 'EN')
 * @param getSceneName - Function to get localized scene name
 * @param getItem - Function to get item by ID
 */
export function useStats(
    historyRecords: Ref<RunRecord[]>,
    currentLang: Ref<'CN' | 'EN'>,
    getSceneName: (scene: Scene | string) => string,
    getItem: (id: string) => ItemIndex | undefined
): UseStatsReturn {

    const totalRuns = computed(() => historyRecords.value.length);

    const sceneStats = computed(() => {
        const runs = historyRecords.value;
        if (runs.length === 0) return { best: Infinity, avg: 0 };
        let sum = 0,
            best = Infinity;
        runs.forEach((r) => {
            sum += r.duration_ms;
            if (r.duration_ms < best) best = r.duration_ms;
        });
        return { best, avg: Math.floor(sum / runs.length) };
    });

    const detailedStats = computed<DetailedStats>(() => {
        const runs = historyRecords.value;
        if (runs.length === 0)
            return {
                totalRuns: 0,
                totalTime: 0,
                best: Infinity,
                avg: 0,
                worst: 0,
                totalDrops: 0,
                runPerDay: '0',
                tzRuns: 0
            };

        let totalTime = 0,
            best = Infinity,
            worst = 0,
            totalDrops = 0,
            tzRuns = 0;

        runs.forEach((r) => {
            totalTime += r.duration_ms;
            if (r.duration_ms < best) best = r.duration_ms;
            if (r.duration_ms > worst) worst = r.duration_ms;
            totalDrops += r.drops?.length || 0;
            if (r.is_tz) tzRuns++;
        });

        const avg = Math.floor(totalTime / runs.length);

        return {
            totalRuns: runs.length,
            totalTime,
            best,
            worst,
            avg,
            totalDrops,
            tzRuns,
            runPerDay: (runs.length / 1).toFixed(1)
        };
    });

    const sceneBreakdown = computed<SceneBreakdownEntry[]>(() => {
        const map = new Map<string, { count: number; drops: number; totalTime: number }>();

        historyRecords.value.forEach((run) => {
            const sceneName = run.scene_id;
            if (!map.has(sceneName)) {
                map.set(sceneName, { count: 0, drops: 0, totalTime: 0 });
            }
            const stat = map.get(sceneName)!;
            stat.count++;
            stat.drops += run.drops?.length || 0;
            stat.totalTime += run.duration_ms;
        });

        return Array.from(map.entries()).map(([name, stat]) => ({
            name,
            count: stat.count,
            drops: stat.drops,
            totalTime: stat.totalTime,
            avgTime: Math.floor(stat.totalTime / stat.count)
        }));
    });

    const dropHistory = computed<DropHistoryEntry[]>(() => {
        const list: DropHistoryEntry[] = [];
        const sorted = [...historyRecords.value].sort((a, b) => a.timestamp - b.timestamp);
        sorted.forEach((run, idx) => {
            if (run.drops && run.drops.length) {
                const scene = SCENES.find((s) => s.name === run.scene_id);
                const sceneDisplay = scene ? getSceneName(scene) : run.scene_id || '?';

                run.drops.forEach((id) => {
                    const item = getItem(id);
                    if (item) {
                        list.push({
                            runIdx: idx + 1,
                            itemName: currentLang.value === 'CN' ? item.name_zh : item.name,
                            itemNameZh: item.name_zh,
                            color: item.color,
                            sceneNameZh: sceneDisplay,
                            isTz: !!run.is_tz
                        });
                    }
                });
            }
        });
        return list.reverse();
    });

    const collectedItemsSet = computed(() => {
        const set = new Set<string>();
        historyRecords.value.forEach(run => {
            if (run.drops && run.drops.length) {
                run.drops.forEach(id => set.add(id));
            }
        });
        return set;
    });

    const grailStats = computed<GrailStats>(() => {
        const total = ITEMS.length;
        const collected = collectedItemsSet.value.size;
        return {
            total,
            collected,
            percentage: total > 0 ? Math.round((collected / total) * 100) : 0
        };
    });

    return {
        totalRuns,
        sceneStats,
        detailedStats,
        sceneBreakdown,
        dropHistory,
        collectedItemsSet,
        grailStats
    };
}
