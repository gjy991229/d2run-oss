/**
 * Theme management composable for the D2Run application.
 *
 * Handles theme state, switching, and DOM application of theme variables.
 * Part of the D2Run Design System.
 */

import { ref, computed } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { THEMES, getTheme, DEFAULT_THEME_ID, type Theme } from '../../shared/themes';
import { DEFAULT_THEME_OPACITY } from '../../shared/constants';
import type { AppConfig } from '../../shared/types';

export function useTheme() {
    // Theme state
    const currentThemeId = ref<string>(DEFAULT_THEME_ID);
    const currentTheme = computed<Theme>(() => getTheme(currentThemeId.value));
    const premiumUnlocked = ref(false);
    const themeOpacity = ref(DEFAULT_THEME_OPACITY);

    // Filter themes based on premium unlock status
    const visibleThemes = computed(() =>
        THEMES.filter(t => !t.isPremium || premiumUnlocked.value)
    );

    /**
     * Apply opacity adjustment to a color string
     * @param color - Color string (hex, rgba, etc.)
     * @param opacity - Opacity percentage (0-100)
     */
    function applyOpacityToColor(color: string, opacity: number): string {
        const factor = opacity / 100;

        // Handle rgba format
        if (color.startsWith('rgba')) {
            return color.replace(/,\s*([\d.]+)\)$/, (_, alpha) => {
                const newAlpha = Math.min(1, parseFloat(alpha) * factor);
                return `, ${newAlpha.toFixed(3)})`;
            });
        }

        // Handle rgb format - convert to rgba
        if (color.startsWith('rgb(')) {
            return color.replace('rgb(', 'rgba(').replace(')', `, ${factor})`);
        }

        // Handle hex format - convert to rgba
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            let r: number, g: number, b: number;

            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else {
                r = parseInt(hex.slice(0, 2), 16);
                g = parseInt(hex.slice(2, 4), 16);
                b = parseInt(hex.slice(4, 6), 16);
            }

            return `rgba(${r}, ${g}, ${b}, ${factor})`;
        }

        return color;
    }

    /**
     * Apply current theme to DOM via CSS variables.
     * Applies all design tokens from the current theme.
     */
    function applyThemeToDOM() {
        const theme = currentTheme.value;
        const root = document.documentElement;
        const opacity = themeOpacity.value;

        // Background colors with opacity adjustment
        root.style.setProperty('--theme-bg', applyOpacityToColor(theme.colors.bg, opacity));
        root.style.setProperty('--theme-bg-card', applyOpacityToColor(theme.colors.bgCard, Math.min(opacity + 10, 100)));
        root.style.setProperty('--theme-bg-elevated', applyOpacityToColor(theme.colors.bgElevated, Math.min(opacity + 15, 100)));
        root.style.setProperty('--theme-bg-overlay', 'rgba(0, 0, 0, 0.85)');

        // Text colors
        root.style.setProperty('--theme-text', theme.colors.text);
        root.style.setProperty('--theme-text-muted', theme.colors.textMuted);
        root.style.setProperty('--theme-text-subtle', theme.colors.textSubtle);

        // Accent colors
        root.style.setProperty('--theme-accent', theme.colors.accent);
        root.style.setProperty('--theme-accent-hover', theme.colors.accentHover);
        root.style.setProperty('--theme-accent-glow', theme.colors.accentGlow);
        root.style.setProperty('--theme-accent-secondary', theme.colors.accentSecondary);
        root.style.setProperty('--theme-accent-secondary-glow', theme.colors.accentSecondaryGlow);

        // Border colors
        root.style.setProperty('--theme-border', theme.colors.border);
        root.style.setProperty('--theme-border-highlight', theme.colors.borderHighlight);
        root.style.setProperty('--theme-border-accent', theme.colors.borderAccent);

        // Semantic colors
        root.style.setProperty('--theme-danger', theme.colors.danger);
        root.style.setProperty('--theme-danger-glow', theme.colors.dangerGlow);
        root.style.setProperty('--theme-success', theme.colors.success);
        root.style.setProperty('--theme-success-glow', theme.colors.successGlow);
        root.style.setProperty('--theme-warning', theme.colors.warning);
        root.style.setProperty('--theme-info', theme.colors.info);

        // Effects
        root.style.setProperty('--theme-backdrop-blur', `${theme.backdropBlur || 12}px`);
        root.style.setProperty('--theme-opacity', `${opacity}%`);

        // Apply text color to body
        document.body.style.color = theme.colors.text;

        // Handle transparent vs solid background
        if (theme.isTransparent) {
            document.body.style.backgroundColor = 'transparent';
        } else {
            document.body.style.backgroundColor = applyOpacityToColor(theme.colors.bg, opacity);
        }
    }

    /**
     * Set the current theme and save to config.
     * @param themeId - Theme identifier
     * @param config - App config ref to update
     */
    async function setTheme(themeId: string, config: { value: AppConfig | null }) {
        const theme = getTheme(themeId);
        currentThemeId.value = theme.id;
        applyThemeToDOM();

        if (config.value) {
            config.value.theme = theme.id;
            await invoke('save_config', { config: JSON.parse(JSON.stringify(config.value)) });
        }
    }

    /**
     * Set theme opacity and save to config.
     * @param opacity - Opacity percentage (0-100)
     * @param config - App config ref to update
     */
    async function setOpacity(opacity: number, config: { value: AppConfig | null }) {
        themeOpacity.value = Math.max(0, Math.min(100, opacity));
        applyThemeToDOM();

        if (config.value) {
            config.value.themeOpacity = themeOpacity.value;
            await invoke('save_config', { config: JSON.parse(JSON.stringify(config.value)) });
        }
    }

    /**
     * Unlock premium themes and auto-switch to golden legend.
     * @param config - App config ref to update
     */
    async function unlockPremium(config: { value: AppConfig | null }) {
        premiumUnlocked.value = true;

        if (config.value) {
            config.value.premiumUnlocked = true;
            await invoke('save_config', { config: JSON.parse(JSON.stringify(config.value)) });
        }

        // Auto-switch to the premium theme
        await setTheme('diablo-lightning', config);
    }

    /**
     * Load theme settings from config.
     * Resets to defaults if values are null/undefined (e.g., after settings reset).
     * @param config - App config to read from
     */
    function loadThemeFromConfig(config: AppConfig | null) {
        if (config) {
            // Reset theme to default if null, otherwise use config value
            currentThemeId.value = config.theme || DEFAULT_THEME_ID;

            // Reset premium status (only unlock if explicitly true)
            premiumUnlocked.value = config.premiumUnlocked === true;

            // Reset opacity to default if null/undefined
            themeOpacity.value = config.themeOpacity !== undefined && config.themeOpacity !== null
                ? config.themeOpacity
                : DEFAULT_THEME_OPACITY;
        } else {
            // No config, reset to all defaults
            currentThemeId.value = DEFAULT_THEME_ID;
            premiumUnlocked.value = false;
            themeOpacity.value = DEFAULT_THEME_OPACITY;
        }

        // Apply the theme to DOM after loading
        applyThemeToDOM();
    }

    return {
        // State
        themes: THEMES,
        visibleThemes,
        currentThemeId,
        currentTheme,
        premiumUnlocked,
        themeOpacity,
        // Methods
        applyThemeToDOM,
        setTheme,
        setOpacity,
        unlockPremium,
        loadThemeFromConfig
    };
}

/** Return type for useTheme composable */
export type UseThemeReturn = ReturnType<typeof useTheme>;
