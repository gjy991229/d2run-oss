/**
 * Dashboard management composable
 *
 * Handles generating and opening the run dashboard.
 */

import { invoke } from '@tauri-apps/api/core';
import type { ComputedRef } from 'vue';
import type { RunRecord } from '../../shared/types';
import { SCENES, ITEMS } from '../../shared/data';
import { DASHBOARD_HTML } from '../../shared/dashboardTemplate';

/** Dashboard composable return interface */
export interface UseDashboardReturn {
    /** Open dashboard window */
    openDashboard: (initialView?: string) => Promise<void>;
}

/**
 * Create dashboard composable instance
 * 
 * @param historyRecords - Computed ref to history records
 * @param loadHistory - Function to ensure history is loaded
 */
export function useDashboard(
    historyRecords: ComputedRef<RunRecord[]>,
    loadHistory: () => Promise<void>
): UseDashboardReturn {

    async function openDashboard(initialView = 'report') {
        const allRuns = [...historyRecords.value];
        // If no records, try loading content first (though caller usually handles this)
        if (allRuns.length === 0) {
            await loadHistory();
        }

        // Re-fetch to get latest if loaded
        const currentRuns = [...historyRecords.value];

        const dataContent = `
      const RUN_DATA = {
          runs: ${JSON.stringify(currentRuns)},
          scenes: ${JSON.stringify(SCENES)},
          items: ${JSON.stringify(ITEMS)},
          initialView: '${initialView}'
      };
    `;

        try {
            await invoke('save_and_open_dashboard', {
                htmlContent: DASHBOARD_HTML,
                dataContent: dataContent
            });
        } catch (e) {
            console.error('Failed to open dashboard:', e);
        }
    }

    return {
        openDashboard
    };
}
