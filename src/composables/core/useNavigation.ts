/**
 * Navigation composable for the D2Run application.
 *
 * Handles view state and navigation between application screens.
 */

import { ref, type Ref } from 'vue';
import type { AppViewStr } from '../../shared/constants';

export interface UseNavigationReturn {
    view: Ref<AppViewStr>;
    goHome: (cleanup?: () => void) => void;
    goSelection: () => void;
    goHistory: () => void;
    goSettings: () => void;
    goAbout: () => void;
    goTimer: () => void;
    goBack: (cleanup?: () => void) => void;
}

export function useNavigation(): UseNavigationReturn {
    const view = ref<AppViewStr>('HOME');

    /**
     * Navigate to home view.
     * @param cleanup - Optional cleanup function to call before navigation
     */
    function goHome(cleanup?: () => void) {
        if (cleanup) cleanup();
        view.value = 'HOME';
    }

    /**
     * Navigate to scene selection view.
     */
    function goSelection() {
        view.value = 'SELECTION';
    }

    /**
     * Navigate to history view.
     */
    function goHistory() {
        view.value = 'HISTORY';
    }

    /**
     * Navigate to settings view.
     */
    function goSettings() {
        view.value = 'SETTINGS';
    }

    /**
     * Navigate to about view.
     */
    function goAbout() {
        view.value = 'ABOUT';
    }

    /**
     * Navigate to timer view.
     */
    function goTimer() {
        view.value = 'TIMER';
    }

    /**
     * Navigate back (to home if not on timer).
     * @param cleanup - Optional cleanup function
     */
    function goBack(cleanup?: () => void) {
        if (view.value !== 'TIMER' && view.value !== 'HOME') {
            goHome(cleanup);
        }
    }

    return {
        view,
        goHome,
        goSelection,
        goHistory,
        goSettings,
        goAbout,
        goTimer,
        goBack
    };
}
