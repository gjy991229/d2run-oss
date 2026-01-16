/**
 * Toast notification composable for the D2Run application.
 * 
 * Provides a reactive toast notification system with support for
 * success, error, warning, and info message types.
 */

import { ref, readonly } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
}

// Shared state across all components
const toasts = ref<Toast[]>([]);
let toastId = 0;

export function useToast() {
    /**
     * Show a toast notification
     * @param message - Message to display
     * @param type - Toast type (success, error, warning, info)
     * @param duration - Duration in ms (default: 3000)
     */
    function show(message: string, type: ToastType = 'info', duration: number = 3000) {
        const id = ++toastId;
        const toast: Toast = { id, message, type, duration };

        toasts.value.push(toast);

        // Auto remove after duration
        setTimeout(() => {
            remove(id);
        }, duration);

        return id;
    }

    /**
     * Show success toast
     */
    function success(message: string, duration?: number) {
        return show(message, 'success', duration);
    }

    /**
     * Show error toast
     */
    function error(message: string, duration?: number) {
        return show(message, 'error', duration);
    }

    /**
     * Show warning toast
     */
    function warning(message: string, duration?: number) {
        return show(message, 'warning', duration);
    }

    /**
     * Show info toast
     */
    function info(message: string, duration?: number) {
        return show(message, 'info', duration);
    }

    /**
     * Remove a toast by id
     */
    function remove(id: number) {
        const index = toasts.value.findIndex(t => t.id === id);
        if (index > -1) {
            toasts.value.splice(index, 1);
        }
    }

    /**
     * Clear all toasts
     */
    function clear() {
        toasts.value = [];
    }

    return {
        toasts: readonly(toasts),
        show,
        success,
        error,
        warning,
        info,
        remove,
        clear
    };
}
