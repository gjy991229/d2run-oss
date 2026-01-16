//! Data models for the D2Run application.
//!
//! This module defines all the data structures used for serialization,
//! configuration, and communication between the frontend and backend.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// ============================================================================
// Keyboard Configuration
// ============================================================================

/// Represents a keyboard shortcut binding.
///
/// Stores the key identifier along with modifier key states (Alt, Ctrl, Shift).
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct KeyBinding {
    /// Optional Windows virtual key code.
    pub keycode: Option<u32>,
    /// Whether Alt key is required.
    pub alt: bool,
    /// Whether Ctrl key is required.
    pub ctrl: bool,
    /// Whether Shift key is required.
    pub shift: bool,
    /// The key name as returned by rdev (e.g., "KeyD", "Return").
    pub name: String,
}

/// Application configuration stored persistently.
///
/// Contains user preferences such as language, theme, and keyboard shortcuts.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AppConfig {
    /// UI language code ("CN" for Chinese, "EN" for English).
    pub language: String,
    /// Theme identifier (e.g., "dark-transparent", "diablo-fire").
    pub theme: Option<String>,
    /// Whether premium themes are unlocked.
    #[serde(rename = "premiumUnlocked")]
    pub premium_unlocked: Option<bool>,
    /// Theme opacity percentage (0-100).
    #[serde(rename = "themeOpacity")]
    pub theme_opacity: Option<i32>,
    /// Map of action names to their keyboard bindings.
    pub shortcuts: HashMap<String, KeyBinding>,
    /// Timestamp of last successful cloud sync.
    /// Can be a number (legacy) or an encrypted string.
    #[serde(rename = "lastSyncTime")]
    pub last_sync_time: Option<serde_json::Value>,
    /// Cloud configuration and user info.
    /// Stored as a raw JSON value to be flexible with frontend structure.
    pub cloud: Option<serde_json::Value>,
    /// User-customized window sizes per view.
    /// Keys are view names (e.g., "HOME", "SETTINGS"), values are {w, h} objects.
    #[serde(rename = "customViewSizes")]
    pub custom_view_sizes: Option<HashMap<String, ViewSize>>,
}

/// Window size dimensions.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ViewSize {
    pub w: i32,
    pub h: i32,
}

impl Default for AppConfig {
    /// Creates a default configuration with preset shortcuts.
    fn default() -> Self {
        let mut shortcuts = HashMap::new();

        // Default shortcut: BackQuote (`) for next run
        shortcuts.insert(
            "NEXT_RUN".to_string(),
            KeyBinding {
                keycode: None,
                alt: false,
                ctrl: false,
                shift: false,
                name: "BackQuote".to_string(),
            },
        );

        // Default shortcut: Alt+P to toggle pause
        shortcuts.insert(
            "TOGGLE_PAUSE".to_string(),
            KeyBinding {
                keycode: None,
                alt: true,
                ctrl: false,
                shift: false,
                name: "KeyP".to_string(),
            },
        );

        // Default shortcut: Alt+D to open drop search
        shortcuts.insert(
            "OPEN_SEARCH".to_string(),
            KeyBinding {
                keycode: None,
                alt: true,
                ctrl: false,
                shift: false,
                name: "KeyD".to_string(),
            },
        );

        // Default shortcut: Alt+Enter to finish session
        shortcuts.insert(
            "FINISH_SESSION".to_string(),
            KeyBinding {
                keycode: None,
                alt: true,
                ctrl: false,
                shift: false,
                name: "Return".to_string(),
            },
        );

        Self {
            language: "CN".to_string(),
            theme: None,
            premium_unlocked: None,
            theme_opacity: None,
            shortcuts,
            last_sync_time: None,
            cloud: None,
            custom_view_sizes: None,
        }
    }
}

// ============================================================================
// Event Payloads
// ============================================================================

/// Payload for global keyboard events emitted to the frontend.
#[derive(Clone, Serialize)]
pub struct KeyEventPayload {
    /// The key name as returned by rdev.
    pub name: String,
    /// Whether Alt key was pressed.
    pub alt: bool,
    /// Whether Ctrl key was pressed.
    pub ctrl: bool,
    /// Whether Shift key was pressed.
    pub shift: bool,
}

// ============================================================================
// Run Data
// ============================================================================

/// A single run record stored in the runs database.
///
/// Each run captures timing information, the scene played, and any drops recorded.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RunRecord {
    /// Unique identifier for this run.
    pub id: String,
    /// Unix timestamp (milliseconds) when the run started.
    pub timestamp: i64,
    /// Human-readable date string (YYYY-MM-DD format).
    pub date_str: String,
    /// Scene identifier (e.g., "the_pit", "countess").
    pub scene_id: String,
    /// Run duration in milliseconds.
    pub duration_ms: i64,
    /// List of item/rune drop identifiers recorded during this run.
    pub drops: Vec<String>,
    /// Whether this was a Terror Zone run.
    pub is_tz: bool,
}

/// Filter parameters for querying run history.
///
/// Uses camelCase field names to match frontend JavaScript conventions.
#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct HistoryFilter {
    /// Start date filter (inclusive, YYYY-MM-DD format).
    pub startStr: Option<String>,
    /// End date filter (inclusive, YYYY-MM-DD format).
    pub endStr: Option<String>,
    /// Scene ID filter ("all" for no filter).
    pub sceneId: Option<String>,
}
