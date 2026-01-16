/**
 * History management composable
 *
 * Handles run history loading, filtering, and deletion.
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type { RunRecord, HistoryFilter } from '../../shared/types';
import { invoke } from '@tauri-apps/api/core';
import type { UseCloudSyncReturn } from './useCloudSync';
import { ensureCloudReady } from './useCloudSync';

/** History composable return interface */
export interface UseHistoryReturn {
    /** Local records from database */
    localRecords: Ref<RunRecord[]>;
    /** History filter state */
    historyFilter: Ref<HistoryFilter>;
    /** Merged history records (local + cloud, deduplicated) */
    historyRecords: ComputedRef<RunRecord[]>;
    /** Load history with current filter */
    loadHistory: () => Promise<void>;
    /** Delete a run by ID */
    deleteRun: (id: string) => Promise<void>;
    /** Clear local records (for refresh) */
    clearLocalRecords: () => void;
}

/**
 * Create history composable instance
 * @param cloudSync - Cloud sync composable for cloud records integration
 */
export function useHistory(cloudSync: UseCloudSyncReturn): UseHistoryReturn {
    const localRecords = ref<RunRecord[]>([]);
    const historyFilter = ref<HistoryFilter>({ startStr: '', endStr: '', sceneId: 'all' });

    // Merge local and cloud records for history display
    const historyRecords = computed(() => {
        const all = [...localRecords.value, ...cloudSync.cloudRecords.value];
        // Dedupe by timestamp (cloud records take priority)
        const unique = new Map<number, RunRecord>();
        all.forEach(r => {
            if (!unique.has(r.timestamp) || r.id.startsWith('cloud_')) {
                unique.set(r.timestamp, r);
            }
        });
        return Array.from(unique.values()).sort((a, b) => b.timestamp - a.timestamp);
    });

    /**
     * Load history with current filter
     */
    async function loadHistory(): Promise<void> {
        // Ensure cloud implementation is loaded before accessing cloud records
        await ensureCloudReady();

        // Get the current cloudSync instance (may now be impl instead of fallback)
        const { useCloudSync } = await import('./useCloudSync');
        const currentCloudSync = useCloudSync();

        const filter = { ...historyFilter.value };
        // Convert 'all' to undefined for backend
        if (filter.sceneId === 'all') filter.sceneId = undefined;
        if (!filter.startStr) filter.startStr = undefined;
        if (!filter.endStr) filter.endStr = undefined;

        try {
            const [localRuns, cloudRunList] = await Promise.all([
                invoke('get_runs', { filter }),
                currentCloudSync.getCloudRecords({ ...filter })
            ]);
            localRecords.value = localRuns as RunRecord[];
            // Update cloudRecords on the correct instance
            currentCloudSync.cloudRecords.value = cloudRunList;
            // Also sync back to passed-in cloudSync for reactivity
            cloudSync.cloudRecords.value = cloudRunList;
        } catch (e) {
            console.error('Failed to load history', e);
        }
    }

    /**
     * Delete a run by ID
     */
    async function deleteRun(id: string): Promise<void> {
        try {
            await invoke('delete_run', { id });
            await loadHistory(); // Refresh immediately after deletion
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Clear local records (for refresh)
     */
    function clearLocalRecords(): void {
        localRecords.value = [];
    }

    return {
        localRecords,
        historyFilter,
        historyRecords,
        loadHistory,
        deleteRun,
        clearLocalRecords
    };
}
