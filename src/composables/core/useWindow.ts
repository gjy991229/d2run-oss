import { reactive } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { BASE_VIEW_SIZES } from '../../shared/constants';

export interface UseWindowReturn {
    viewSizes: Record<string, { w: number; h: number }>;
    updateViewSize: (viewName: string, w: number, h: number) => void;
    resizeForView: (viewName: string) => void;
}

export function useWindow(): UseWindowReturn {
    /**
     * Calculate scale factor based on current screen resolution
     */
    function getScaleFactor(): number {
        const screenHeight = window.screen.height;
        const stdScreen = 1080;
        return screenHeight / stdScreen;
    }

    /**
     * Get scaled view sizes for current screen resolution
     */
    function getScaledViewSizes() {
        const scale = getScaleFactor();
        const scaled: Record<string, { w: number; h: number }> = {};

        for (const [key, size] of Object.entries(BASE_VIEW_SIZES)) {
            scaled[key] = {
                w: Math.round(size.w * scale),
                h: Math.round(size.h * scale)
            };
        }
        return scaled;
    }

    const viewSizes = reactive(getScaledViewSizes());

    function updateViewSize(viewName: string, w: number, h: number) {
        viewSizes[viewName] = { w, h };
    }

    function resizeForView(viewName: string) {
        const s = viewSizes[viewName];
        if (s) {
            invoke('resize_window', { width: s.w, height: s.h }).catch(console.error);
        }
    }

    return {
        viewSizes,
        updateViewSize,
        resizeForView
    };
}
