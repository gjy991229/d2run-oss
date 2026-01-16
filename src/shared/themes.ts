/**
 * Theme definitions for the D2Run application.
 *
 * This module contains theme interfaces, preset themes, and utility functions
 * for managing application themes. Part of the D2Run Design System.
 */

/**
 * Theme color configuration with extended semantic colors.
 */
export interface ThemeColors {
    /** Primary background color (main container) */
    bg: string;
    /** Secondary background color (cards, panels) */
    bgCard: string;
    /** Elevated background (modals, dropdowns) */
    bgElevated: string;
    /** Primary text color */
    text: string;
    /** Secondary/muted text color */
    textMuted: string;
    /** Subtle/disabled text color */
    textSubtle: string;
    /** Primary accent color (gold, buttons) */
    accent: string;
    /** Accent hover state */
    accentHover: string;
    /** Accent glow effect */
    accentGlow: string;
    /** Secondary accent color (purple, special) */
    accentSecondary: string;
    /** Secondary accent glow */
    accentSecondaryGlow: string;
    /** Border color */
    border: string;
    /** Highlighted border */
    borderHighlight: string;
    /** Accent border */
    borderAccent: string;
    /** Danger/error color */
    danger: string;
    /** Danger glow */
    dangerGlow: string;
    /** Success color */
    success: string;
    /** Success glow */
    successGlow: string;
    /** Warning color */
    warning: string;
    /** Info color */
    info: string;
}

/**
 * Complete theme definition with extended properties.
 */
export interface Theme {
    /** Unique theme identifier */
    id: string;
    /** Display name in Chinese */
    nameCN: string;
    /** Display name in English */
    nameEN: string;
    /** Theme color configuration */
    colors: ThemeColors;
    /** Whether background is transparent (for overlay mode) */
    isTransparent: boolean;
    /** Backdrop blur amount (px) for transparent themes */
    backdropBlur?: number;
    /** Whether this theme requires unlock (premium) */
    isPremium?: boolean;
    /** Theme description for UI */
    descriptionCN?: string;
    descriptionEN?: string;
}


/**
 * Preset themes for the application.
 */
export const THEMES: Theme[] = [
    {
        id: 'dark-transparent',
        nameCN: '暗黑',
        nameEN: 'Dark Abyss',
        descriptionCN: '经典暗黑风格',
        descriptionEN: 'Classic dark theme',
        isTransparent: true,
        backdropBlur: 12,
        colors: {
            bg: 'rgba(0, 0, 0, 0.95)',
            bgCard: 'rgba(24, 24, 27, 0.9)',
            bgElevated: 'rgba(39, 39, 42, 0.98)',
            text: '#e5dcc5',
            textMuted: 'rgba(229, 220, 197, 0.6)',
            textSubtle: 'rgba(229, 220, 197, 0.4)',
            accent: '#d4af37',
            accentHover: '#e5c04a',
            accentGlow: 'rgba(212, 175, 55, 0.3)',
            accentSecondary: '#a335ee',
            accentSecondaryGlow: 'rgba(163, 53, 238, 0.3)',
            border: 'rgba(229, 220, 197, 0.1)',
            borderHighlight: 'rgba(229, 220, 197, 0.2)',
            borderAccent: 'rgba(212, 175, 55, 0.4)',
            danger: '#dc2626',
            dangerGlow: 'rgba(220, 38, 38, 0.3)',
            success: '#22c55e',
            successGlow: 'rgba(34, 197, 94, 0.3)',
            warning: '#f59e0b',
            info: '#3b82f6'
        }
    },
    {
        id: 'diablo-fire',
        nameCN: '火焰',
        nameEN: 'Hellfire',
        descriptionCN: '燃烧地狱深处',
        descriptionEN: 'From the depths of hell',
        isTransparent: true,
        backdropBlur: 12,
        colors: {
            bg: 'rgba(20, 10, 5, 0.95)',
            bgCard: 'rgba(40, 20, 10, 0.9)',
            bgElevated: 'rgba(60, 30, 15, 0.98)',
            text: '#ffd9b3',
            textMuted: 'rgba(255, 217, 179, 0.6)',
            textSubtle: 'rgba(255, 217, 179, 0.4)',
            accent: '#ff6b35',
            accentHover: '#ff8a5c',
            accentGlow: 'rgba(255, 107, 53, 0.35)',
            accentSecondary: '#ff4500',
            accentSecondaryGlow: 'rgba(255, 69, 0, 0.3)',
            border: 'rgba(255, 107, 53, 0.15)',
            borderHighlight: 'rgba(255, 107, 53, 0.25)',
            borderAccent: 'rgba(255, 107, 53, 0.5)',
            danger: '#ff0000',
            dangerGlow: 'rgba(255, 0, 0, 0.3)',
            success: '#22c55e',
            successGlow: 'rgba(34, 197, 94, 0.3)',
            warning: '#ff6b35',
            info: '#ffa500'
        }
    },
    {
        id: 'diablo-ice',
        nameCN: '冰霜',
        nameEN: 'Frost Queen',
        descriptionCN: '冰封怒焰',
        descriptionEN: 'Frozen wrath',
        isTransparent: true,
        backdropBlur: 12,
        colors: {
            bg: 'rgba(5, 15, 25, 0.95)',
            bgCard: 'rgba(10, 30, 50, 0.9)',
            bgElevated: 'rgba(15, 45, 75, 0.98)',
            text: '#e0f4ff',
            textMuted: 'rgba(224, 244, 255, 0.6)',
            textSubtle: 'rgba(224, 244, 255, 0.4)',
            accent: '#00bfff',
            accentHover: '#33ccff',
            accentGlow: 'rgba(0, 191, 255, 0.35)',
            accentSecondary: '#7dd3fc',
            accentSecondaryGlow: 'rgba(125, 211, 252, 0.3)',
            border: 'rgba(0, 191, 255, 0.15)',
            borderHighlight: 'rgba(0, 191, 255, 0.25)',
            borderAccent: 'rgba(0, 191, 255, 0.5)',
            danger: '#ff4444',
            dangerGlow: 'rgba(255, 68, 68, 0.3)',
            success: '#22c55e',
            successGlow: 'rgba(34, 197, 94, 0.3)',
            warning: '#f59e0b',
            info: '#00bfff'
        }
    },
    {
        id: 'diablo-lightning',
        nameCN: '闪电',
        nameEN: 'Golden Legend',
        descriptionCN: '传说降临',
        descriptionEN: 'Legendary power',
        isTransparent: true,
        backdropBlur: 12,
        isPremium: true,
        colors: {
            bg: 'rgba(30, 25, 15, 0.95)',
            bgCard: 'rgba(50, 42, 25, 0.9)',
            bgElevated: 'rgba(70, 58, 35, 0.98)',
            text: '#fef3c7',
            textMuted: 'rgba(254, 243, 199, 0.6)',
            textSubtle: 'rgba(254, 243, 199, 0.4)',
            accent: '#fbbf24',
            accentHover: '#fcd34d',
            accentGlow: 'rgba(251, 191, 36, 0.4)',
            accentSecondary: '#f59e0b',
            accentSecondaryGlow: 'rgba(245, 158, 11, 0.3)',
            border: 'rgba(251, 191, 36, 0.15)',
            borderHighlight: 'rgba(251, 191, 36, 0.25)',
            borderAccent: 'rgba(251, 191, 36, 0.5)',
            danger: '#dc2626',
            dangerGlow: 'rgba(220, 38, 38, 0.3)',
            success: '#22c55e',
            successGlow: 'rgba(34, 197, 94, 0.3)',
            warning: '#fbbf24',
            info: '#3b82f6'
        }
    },
    {
        id: 'diablo-poison',
        nameCN: '毒素',
        nameEN: 'Poison Spread',
        descriptionCN: '毒雾弥漫',
        descriptionEN: 'Toxic corruption',
        isTransparent: true,
        backdropBlur: 12,
        colors: {
            bg: 'rgba(5, 15, 5, 0.95)',
            bgCard: 'rgba(15, 30, 15, 0.9)',
            bgElevated: 'rgba(25, 50, 25, 0.98)',
            text: '#d4ffb3',
            textMuted: 'rgba(212, 255, 179, 0.6)',
            textSubtle: 'rgba(212, 255, 179, 0.4)',
            accent: '#4ade80',
            accentHover: '#6ee7a0',
            accentGlow: 'rgba(74, 222, 128, 0.35)',
            accentSecondary: '#22c55e',
            accentSecondaryGlow: 'rgba(34, 197, 94, 0.3)',
            border: 'rgba(74, 222, 128, 0.15)',
            borderHighlight: 'rgba(74, 222, 128, 0.25)',
            borderAccent: 'rgba(74, 222, 128, 0.5)',
            danger: '#dc2626',
            dangerGlow: 'rgba(220, 38, 38, 0.3)',
            success: '#4ade80',
            successGlow: 'rgba(74, 222, 128, 0.3)',
            warning: '#f59e0b',
            info: '#3b82f6'
        }
    },
    {
        id: 'light-minimal',
        nameCN: '明亮',
        nameEN: 'Light Sanctuary',
        descriptionCN: '圣光庇护',
        descriptionEN: 'Blessed by light',
        isTransparent: false,
        backdropBlur: 8,
        colors: {
            bg: 'rgba(250, 250, 250, 0.95)',
            bgCard: 'rgba(255, 255, 255, 0.9)',
            bgElevated: 'rgba(255, 255, 255, 0.98)',
            text: '#1e293b',
            textMuted: 'rgba(30, 41, 59, 0.6)',
            textSubtle: 'rgba(30, 41, 59, 0.4)',
            accent: '#b8860b',
            accentHover: '#d4a017',
            accentGlow: 'rgba(184, 134, 11, 0.2)',
            accentSecondary: '#7c3aed',
            accentSecondaryGlow: 'rgba(124, 58, 237, 0.2)',
            border: 'rgba(0, 0, 0, 0.08)',
            borderHighlight: 'rgba(0, 0, 0, 0.12)',
            borderAccent: 'rgba(184, 134, 11, 0.4)',
            danger: '#dc2626',
            dangerGlow: 'rgba(220, 38, 38, 0.2)',
            success: '#16a34a',
            successGlow: 'rgba(22, 163, 74, 0.2)',
            warning: '#d97706',
            info: '#2563eb'
        }
    }
];

/**
 * Get theme by ID.
 * @param id - Theme identifier
 * @returns Theme object, defaults to first theme if not found
 */
export function getTheme(id: string): Theme {
    return THEMES.find(t => t.id === id) || THEMES[0];
}

/**
 * Default theme ID.
 */
export const DEFAULT_THEME_ID = 'dark-transparent';

/**
 * Apply theme colors to CSS custom properties
 * @param theme - Theme to apply
 * @param opacity - Opacity override (0-100)
 */
export function applyThemeToCSSVars(theme: Theme, opacity: number = 100): void {
    const root = document.documentElement;
    const opacityFactor = opacity / 100;

    // Helper to adjust opacity in rgba strings
    const adjustOpacity = (color: string): string => {
        if (color.startsWith('rgba')) {
            return color.replace(/,\s*([\d.]+)\)$/, (_, alpha) =>
                `, ${parseFloat(alpha) * opacityFactor})`);
        }
        return color;
    };

    // Apply all theme colors
    root.style.setProperty('--theme-bg', adjustOpacity(theme.colors.bg));
    root.style.setProperty('--theme-bg-card', adjustOpacity(theme.colors.bgCard));
    root.style.setProperty('--theme-bg-elevated', adjustOpacity(theme.colors.bgElevated));
    root.style.setProperty('--theme-bg-overlay', 'rgba(0, 0, 0, 0.85)');

    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-muted', theme.colors.textMuted);
    root.style.setProperty('--theme-text-subtle', theme.colors.textSubtle);

    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-accent-hover', theme.colors.accentHover);
    root.style.setProperty('--theme-accent-glow', theme.colors.accentGlow);
    root.style.setProperty('--theme-accent-secondary', theme.colors.accentSecondary);
    root.style.setProperty('--theme-accent-secondary-glow', theme.colors.accentSecondaryGlow);

    root.style.setProperty('--theme-border', theme.colors.border);
    root.style.setProperty('--theme-border-highlight', theme.colors.borderHighlight);
    root.style.setProperty('--theme-border-accent', theme.colors.borderAccent);

    root.style.setProperty('--theme-danger', theme.colors.danger);
    root.style.setProperty('--theme-danger-glow', theme.colors.dangerGlow);
    root.style.setProperty('--theme-success', theme.colors.success);
    root.style.setProperty('--theme-success-glow', theme.colors.successGlow);
    root.style.setProperty('--theme-warning', theme.colors.warning);
    root.style.setProperty('--theme-info', theme.colors.info);

    root.style.setProperty('--theme-backdrop-blur', `${theme.backdropBlur || 12}px`);
}
