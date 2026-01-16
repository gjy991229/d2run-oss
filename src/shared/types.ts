/**
 * Type definitions for the D2Run application.
 *
 * This module contains all TypeScript interfaces used throughout
 * the application for type safety and documentation.
 */

/**
 * Keyboard shortcut binding configuration.
 */
export interface KeyBinding {
  /** Windows virtual key code */
  keycode: number;
  /** Whether Alt key is required */
  alt: boolean;
  /** Whether Ctrl key is required */
  ctrl: boolean;
  /** Whether Shift key is required */
  shift: boolean;
  /** Key name as returned by rdev */
  name: string;
}

/**
 * Application configuration stored persistently.
 */
export interface AppConfig {
  /** UI language code ('CN' for Chinese, 'EN' for English) */
  language?: 'CN' | 'EN';
  /** Theme identifier */
  theme?: string;
  /** Whether premium themes are unlocked */
  premiumUnlocked?: boolean;
  /** Theme opacity (0-100, percentage) */
  themeOpacity?: number;
  /** Last sync timestamp for cloud sync cooldown (Encrypted string or legacy number) */
  lastSyncTime?: string | number;
  /** Map of action names to keyboard bindings */
  shortcuts: {
    [key: string]: KeyBinding;
  };
  /** Cloud sync configuration */
  cloud?: {
    userInfo?: any;
  };
  // secure_sync_time removed in favor of encrypting lastSyncTime directly
  /** User-customized window sizes per view (overrides defaults) */
  customViewSizes?: {
    [viewName: string]: { w: number; h: number };
  };
}

/**
 * A single run record stored in the database.
 */
export interface RunRecord {
  /** Unique identifier for this run */
  id: string;
  /** Unix timestamp (milliseconds) when the run started */
  timestamp: number;
  /** Human-readable date string (YYYY-MM-DD format) */
  date_str: string;
  /** Scene identifier (scene name) */
  scene_id: string;
  /** Run duration in milliseconds */
  duration_ms: number;
  /** List of item/rune drop identifiers */
  drops: string[];
  /** Whether this was a Terror Zone run */
  is_tz: boolean;
}

/**
 * Scene definition for Diablo II locations.
 */
export interface Scene {
  /** Internal scene name identifier */
  name: string;
  /** Display label for the scene */
  label: string;
  /** English scene name */
  name_en?: string;
  /** English display label */
  label_en?: string;
}

/**
 * Item index entry for drop recording.
 */
export interface ItemIndex {
  /** Unique item identifier */
  _id: string;
  /** English item name */
  name: string;
  /** Chinese item name */
  name_zh: string;
  /** Item rarity category */
  rarity: string;
  /** Display color for the item */
  color: string;
}

/**
 * Filter parameters for querying run history.
 */
export interface HistoryFilter {
  /** Start date filter (inclusive, YYYY-MM-DD format) */
  startStr?: string;
  /** End date filter (inclusive, YYYY-MM-DD format) */
  endStr?: string;
  /** Scene ID filter ('all' for no filter) */
  sceneId?: string;
}

/**
 * Cloud sync daily run record structure.
 */
export interface CloudDailyRun {
  /** User's open ID for cloud identification */
  _openid: string;
  /** Date key in YYYY-MM-DD format */
  dateKey: string;
  /** Array of runs for this day */
  runs: {
    timestamp: number;
    location: string;
    duration: number;
    isTz: boolean;
    dropIds: string[];
    dropSnapshots: { name: string; realId?: string; rarityClass?: string; type: 'warehouse' | 'template' }[];
    index: number;
  }[];
  /** Record creation timestamp */
  createTime: string;
  /** Record last update timestamp */
  updateTime: string;
}
