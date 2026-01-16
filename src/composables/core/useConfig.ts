/**
 * Configuration management composable
 *
 * Handles app configuration, shortcuts recording, and settings persistence.
 */

import { ref, type Ref } from 'vue';
import type { AppConfig, KeyBinding } from '../../shared/types';
import { invoke } from '@tauri-apps/api/core';
import type { UseThemeReturn } from './useTheme';

/** Config composable return interface */
export interface UseConfigReturn {
    /** Application configuration */
    config: Ref<AppConfig | null>;
    /** Currently recording shortcut key */
    recordingKey: Ref<string | null>;
    /** Load configuration from backend */
    loadConfig: (themeComposable: UseThemeReturn) => Promise<void>;
    /** Reset settings to defaults */
    resetSettings: (
        themeComposable: UseThemeReturn,
        tryResize: (view: string) => void,
        currentView: string
    ) => Promise<void>;
    /** Start recording a shortcut key */
    startRecording: (actionKey: string) => Promise<void>;
    /** Apply recorded key binding */
    applyRecordedKey: (binding: KeyBinding) => Promise<void>;
    /** Cancel key recording */
    cancelRecording: () => void;
    /** Save custom view size */
    saveCustomViewSize: (viewName: string, w: number, h: number) => Promise<void>;
}

/**
 * Create config composable instance
 */
export function useConfig(): UseConfigReturn {
    const config = ref<AppConfig | null>(null);
    const recordingKey = ref<string | null>(null);

    /**
     * Load configuration from backend
     */
    async function loadConfig(themeComposable: UseThemeReturn): Promise<void> {
        try {
            config.value = await invoke('get_config');
            if (config.value) {
                // Load theme settings from config via composable
                themeComposable.loadThemeFromConfig(config.value);
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Reset settings to defaults
     */
    async function resetSettings(
        themeComposable: UseThemeReturn,
        tryResize: (view: string) => void,
        currentView: string
    ): Promise<void> {
        try {
            // Preserve premium unlock status - this is a permanent reward
            const wasPremiumUnlocked = themeComposable.premiumUnlocked.value;

            config.value = await invoke('reset_config');
            if (config.value) {
                // Restore premium unlock status before loading theme
                config.value.premiumUnlocked = wasPremiumUnlocked;

                // Reset theme to dark-transparent and opacity to default
                themeComposable.loadThemeFromConfig(config.value);

                // Save the config with preserved premium status
                if (wasPremiumUnlocked) {
                    await invoke('save_config', { config: JSON.parse(JSON.stringify(config.value)) });
                }

                // Resize current view to default size
                tryResize(currentView);
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Start recording a shortcut key
     */
    async function startRecording(actionKey: string): Promise<void> {
        recordingKey.value = actionKey;
        invoke('start_record_key');
    }

    /**
     * Apply recorded key binding
     */
    async function applyRecordedKey(binding: KeyBinding): Promise<void> {
        if (!config.value || !recordingKey.value) return;
        config.value.shortcuts[recordingKey.value] = binding;
        await invoke('stop_record_key');
        await invoke('save_config', { config: JSON.parse(JSON.stringify(config.value)) });
        recordingKey.value = null;
    }

    /**
     * Cancel key recording
     */
    function cancelRecording(): void {
        recordingKey.value = null;
        invoke('stop_record_key');
    }

    /**
     * Save custom window size for a view to config
     */
    async function saveCustomViewSize(viewName: string, w: number, h: number): Promise<void> {
        if (!config.value) return;
        if (!config.value.customViewSizes) {
            config.value.customViewSizes = {};
        }
        config.value.customViewSizes[viewName] = { w, h };
        await invoke('save_config', { config: JSON.parse(JSON.stringify(config.value)) });
    }

    return {
        config,
        recordingKey,
        loadConfig,
        resetSettings,
        startRecording,
        applyRecordedKey,
        cancelRecording,
        saveCustomViewSize
    };
}
