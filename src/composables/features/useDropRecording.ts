/**
 * Drop recording functionality composable
 *
 * Handles item lookup and drop tracking during runs.
 */

import { ref, type Ref } from 'vue';
import type { ItemIndex } from '../../shared/types';
import { ITEMS } from '../../shared/data';
import { QUALITY_CONFIG } from '../../shared/constants';

/** Session drop entry */
export interface SessionDropEntry {
    itemId: string;
    runNumber: number;
}

/** Drop recording composable return interface */
export interface UseDropRecordingReturn {
    /** Drops recorded in current run */
    currentDrops: Ref<string[]>;
    /** All drops in current session with run numbers */
    sessionDrops: Ref<SessionDropEntry[]>;
    /** Get item by ID (supports custom items) */
    getItem: (id: string) => ItemIndex | undefined;
    /** Get localized item name */
    getItemName: (id: string, lang: 'CN' | 'EN') => string;
    /** Add drop to current run and session */
    addDrop: (itemId: string, runNumber: number) => void;
    /** Reset current drops for new run */
    resetCurrentDrops: () => void;
    /** Reset all session drops */
    resetSessionDrops: () => void;
}

/**
 * Create drop recording composable instance
 */
export function useDropRecording(): UseDropRecordingReturn {
    const currentDrops = ref<string[]>([]);
    const sessionDrops = ref<SessionDropEntry[]>([]);

    /**
     * Get item by ID, including support for custom items
     */
    function getItem(id: string): ItemIndex | undefined {
        // Check custom items
        if (id.startsWith('custom:')) {
            const parts = id.split(':');
            const name = parts[1];
            const quality = (parts[2] || '1') as '1' | '2' | '3';
            const qConf = QUALITY_CONFIG[quality];
            return {
                _id: id,
                name,
                name_zh: name,
                rarity: quality,
                color: qConf?.color || '#e4e4e7'
            };
        }

        // For database items, return as-is
        return ITEMS.find((i) => i._id === id);
    }

    /**
     * Get localized item name
     */
    function getItemName(id: string, lang: 'CN' | 'EN'): string {
        const item = getItem(id);
        if (!item) return id;
        return lang === 'CN' ? item.name_zh : item.name;
    }

    /**
     * Add drop to current run and session
     */
    function addDrop(itemId: string, runNumber: number) {
        currentDrops.value.push(itemId);
        sessionDrops.value.unshift({ itemId, runNumber });
    }

    /**
     * Reset current drops for new run
     */
    function resetCurrentDrops() {
        currentDrops.value = [];
    }

    /**
     * Reset all session drops
     */
    function resetSessionDrops() {
        sessionDrops.value = [];
    }

    return {
        currentDrops,
        sessionDrops,
        getItem,
        getItemName,
        addDrop,
        resetCurrentDrops,
        resetSessionDrops
    };
}
