export const ACTION_THROTTLE_MS = 500;
export const MAX_INPUT_LENGTH = 32;
export const SYNC_COOLDOWN_MS = 60 * 1000; // 1 minute

// Application Views
export const VIEW_NAMES = {
    HOME: 'HOME',
    SELECTION: 'SELECTION',
    TIMER: 'TIMER',
    HISTORY: 'HISTORY',
    SETTINGS: 'SETTINGS',
    ABOUT: 'ABOUT'
} as const;

export type AppViewStr = keyof typeof VIEW_NAMES;

// Optimized for 1080p screen
export const BASE_VIEW_SIZES = {
    HOME: { w: 240, h: 370 },
    SELECTION: { w: 250, h: 450 },
    TIMER: { w: 190, h: 220 },
    HISTORY: { w: 300, h: 500 },
    SETTINGS: { w: 300, h: 520 },
    ABOUT: { w: 250, h: 400 }
};

export const QUALITY_CONFIG = {
    '1': { cn: '底材', en: 'Normal', color: '#e4e4e7' },
    '2': { cn: '魔法', en: 'Magic', color: '#3b82f6' },
    '3': { cn: '亮金', en: 'Rare', color: '#facc15' }
};

// Timer and search constants
export const TIMER_INTERVAL_MS = 50;
export const SEARCH_RESULTS_LIMIT = 5;
export const SEARCH_QUERY_MAX_LENGTH = 20;

// Run duration thresholds
export const MIN_RUN_DURATION_MS = 100;
export const SESSION_SAVE_THRESHOLD_MS = 1000;

// Default theme opacity
export const DEFAULT_THEME_OPACITY = 95;

// Window minimum dimensions (pixels)
export const MIN_WINDOW_WIDTH = 200;
export const MIN_WINDOW_HEIGHT = 200;

