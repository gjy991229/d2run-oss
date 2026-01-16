/**
 * Internationalization composable
 *
 * Handles language state and translation functions for the D2Run application.
 */

import { ref, type Ref } from 'vue';
import { I18N, type LocaleDict } from '../../shared/locales';
import { invoke } from '@tauri-apps/api/core';
import type { AppConfig } from '../../shared/types';

/** Supported languages */
export type Language = 'CN' | 'EN';

/** I18n composable return interface */
export interface UseI18nReturn {
    /** Current language */
    currentLang: Ref<Language>;
    /** Translate a key to current language */
    t: (key: string) => string;
    /** Toggle between CN and EN */
    toggleLanguage: (config: Ref<AppConfig | null>) => Promise<void>;
    /** Set language from config */
    loadLanguageFromConfig: (config: AppConfig | null) => void;
}

/**
 * Create i18n composable instance
 */
export function useI18n(): UseI18nReturn {
    const currentLang = ref<Language>('CN');

    /**
     * Translate a key to current language
     */
    function t(key: string): string {
        const dict: LocaleDict = currentLang.value === 'CN' ? I18N.CN : I18N.EN;
        return dict[key] || key;
    }

    /**
     * Toggle between CN and EN languages
     */
    async function toggleLanguage(config: Ref<AppConfig | null>): Promise<void> {
        currentLang.value = currentLang.value === 'CN' ? 'EN' : 'CN';
        if (config.value) {
            config.value.language = currentLang.value;
            await invoke('save_config', { config: JSON.parse(JSON.stringify(config.value)) });
        }
    }

    /**
     * Load language setting from config
     */
    function loadLanguageFromConfig(config: AppConfig | null): void {
        if (config?.language) {
            currentLang.value = config.language as Language;
        }
    }

    return {
        currentLang,
        t,
        toggleLanguage,
        loadLanguageFromConfig
    };
}
