//! Tauri command handlers for the D2Run application.
//!
//! This module contains all the IPC commands that can be invoked from the frontend.
//! Commands are organized into categories: Run Management, Configuration, and Window Control.

use crate::models::{AppConfig, HistoryFilter, RunRecord};
use crate::utils::{get_cloud_runs_path, get_config_path, get_runs_path, AppState};
use std::fs;
use tauri::{PhysicalPosition, PhysicalSize};

// ============================================================================
// Run Management Commands
// ============================================================================

/// Retrieves run records with optional filtering.
///
/// # Arguments
/// * `filter` - Optional filter criteria for date range and scene.
/// * `state` - Application state containing the data directory path.
///
/// # Returns
/// A vector of run records matching the filter criteria.
#[tauri::command]
pub fn get_runs(filter: Option<HistoryFilter>, state: tauri::State<AppState>) -> Vec<RunRecord> {
    let path = get_runs_path(&state.app_data_dir);
    if !path.exists() {
        return Vec::new();
    }

    let data = fs::read_to_string(path).unwrap_or_else(|_| "[]".to_string());
    let runs: Vec<RunRecord> = serde_json::from_str(&data).unwrap_or_default();

    match filter {
        Some(f) => runs
            .into_iter()
            .filter(|r| {
                // Filter by scene ID
                if let Some(ref sid) = f.sceneId {
                    if sid != "all" && &r.scene_id != sid {
                        return false;
                    }
                }
                // Filter by start date
                if let Some(ref s) = f.startStr {
                    if &r.date_str < s {
                        return false;
                    }
                }
                // Filter by end date
                if let Some(ref e) = f.endStr {
                    if &r.date_str > e {
                        return false;
                    }
                }
                true
            })
            .collect(),
        None => runs,
    }
}

/// Saves a new run record to the database.
///
/// # Arguments
/// * `run` - The run record to save.
/// * `state` - Application state containing the data directory path.
#[tauri::command]
pub fn save_run(run: RunRecord, state: tauri::State<AppState>) {
    let path = get_runs_path(&state.app_data_dir);
    let mut runs: Vec<RunRecord> = if path.exists() {
        serde_json::from_str(&fs::read_to_string(&path).unwrap_or_else(|_| "[]".to_string()))
            .unwrap_or_default()
    } else {
        Vec::new()
    };

    runs.push(run);
    let _ = fs::write(path, serde_json::to_string_pretty(&runs).unwrap());
}

/// Deletes a run record by its ID.
///
/// # Arguments
/// * `id` - The unique identifier of the run to delete.
/// * `state` - Application state containing the data directory path.
#[tauri::command]
pub fn delete_run(id: String, state: tauri::State<AppState>) {
    let path = get_runs_path(&state.app_data_dir);
    if !path.exists() {
        return;
    }

    let mut runs: Vec<RunRecord> =
        serde_json::from_str(&fs::read_to_string(&path).unwrap_or_else(|_| "[]".to_string()))
            .unwrap_or_default();

    if let Some(idx) = runs.iter().position(|r| r.id == id) {
        runs.remove(idx);
        let _ = fs::write(path, serde_json::to_string_pretty(&runs).unwrap());
    }
}

/// Clears all run records from local storage.
///
/// This is used after syncing data to the cloud.
///
/// # Arguments
/// * `state` - Application state containing the data directory path.
#[tauri::command]
pub fn clear_runs(state: tauri::State<AppState>) {
    let path = get_runs_path(&state.app_data_dir);
    if path.exists() {
        // Write empty array to clear all runs
        let _ = fs::write(path, "[]");
    }
}

/// Retrieves cloud run records from the local cache file.
///
/// # Arguments
/// * `state` - Application state containing the data directory path.
///
/// # Returns
/// A vector of run records from the cloud cache.
#[tauri::command]
pub fn get_cloud_runs(state: tauri::State<AppState>) -> Vec<RunRecord> {
    let path = get_cloud_runs_path(&state.app_data_dir);
    if !path.exists() {
        return Vec::new();
    }

    let data = fs::read_to_string(path).unwrap_or_else(|_| "[]".to_string());
    serde_json::from_str(&data).unwrap_or_default()
}

/// Saves cloud run records to the local cache file.
///
/// # Arguments
/// * `runs` - The run records to save.
/// * `state` - Application state containing the data directory path.
#[tauri::command]
pub fn save_cloud_runs(runs: Vec<RunRecord>, state: tauri::State<AppState>) {
    let path = get_cloud_runs_path(&state.app_data_dir);
    let _ = fs::write(path, serde_json::to_string_pretty(&runs).unwrap());
}

// ============================================================================
// Configuration Commands
// ============================================================================

/// Retrieves the application configuration.
///
/// If no configuration file exists, returns the default configuration.
/// If the shortcuts map is empty, populates it with defaults.
///
/// # Arguments
/// * `state` - Application state containing the data directory path.
///
/// # Returns
/// The current application configuration.
#[tauri::command]
pub fn get_config(state: tauri::State<AppState>) -> AppConfig {
    let path = get_config_path(&state.app_data_dir);

    if path.exists() {
        let content = fs::read_to_string(&path).unwrap_or_else(|_| "{}".to_string());

        let mut config: AppConfig = serde_json::from_str(&content).unwrap_or_default();

        // Ensure shortcuts are populated
        if config.shortcuts.is_empty() {
            config.shortcuts = AppConfig::default().shortcuts;
        }

        config
    } else {
        AppConfig::default()
    }
}

/// Saves the application configuration to disk.
///
/// # Arguments
/// * `config` - The configuration to save.
/// * `state` - Application state containing the data directory path.
#[tauri::command]
pub fn save_config(config: AppConfig, state: tauri::State<AppState>) {
    let path = get_config_path(&state.app_data_dir);

    let json = serde_json::to_string_pretty(&config).unwrap();
    let _ = fs::write(&path, &json);
}

/// Resets the configuration to defaults and saves it.
///
/// # Arguments
/// * `state` - Application state containing the data directory path.
///
/// # Returns
/// The new default configuration.
#[tauri::command]
pub fn reset_config(state: tauri::State<AppState>) -> AppConfig {
    let config = AppConfig::default();
    save_config(config.clone(), state);
    config
}

// ============================================================================
// Window Control Commands
// ============================================================================

/// Resizes the application window.
///
/// # Arguments
/// * `width` - New window width in pixels.
/// * `height` - New window height in pixels.
/// * `window` - Reference to the Tauri window.
#[tauri::command]
pub async fn resize_window(width: f64, height: f64, window: tauri::Window) {
    let _ = window.set_size(PhysicalSize::new(width, height));
}

/// Resizes and repositions the application window.
///
/// # Arguments
/// * `width` - New window width in pixels.
/// * `height` - New window height in pixels.
/// * `x` - New window X position.
/// * `y` - New window Y position.
/// * `window` - Reference to the Tauri window.
#[tauri::command]
pub async fn resize_window_custom(width: f64, height: f64, x: f64, y: f64, window: tauri::Window) {
    let _ = window.set_size(PhysicalSize::new(width, height));
    let _ = window.set_position(PhysicalPosition::new(x, y));
}

/// Exits the application.
///
/// # Arguments
/// * `app` - The Tauri application handle.
#[tauri::command]
pub fn quit_app(app: tauri::AppHandle) {
    app.exit(0);
}

// ============================================================================
// Keyboard Recording Commands
// ============================================================================

/// Signals the start of keyboard shortcut recording mode.
///
/// Note: This is intentionally a no-op. Keyboard events are captured
/// globally via rdev in main.rs and emitted to the frontend.
/// This command serves as a state signal for the frontend to know
/// when to interpret key events as shortcut bindings.
#[tauri::command]
pub fn start_record_key() {
    // Intentionally empty - keyboard capture happens via global rdev listener
}

/// Signals the end of keyboard shortcut recording mode.
///
/// Note: This is intentionally a no-op. See start_record_key for details.
#[tauri::command]
pub fn stop_record_key() {
    // Intentionally empty - serves as state signal only
}

// ============================================================================
// Focus and Dashboard Commands
// ============================================================================

/// Forces the window to activate and gain focus.
///
/// # Arguments
/// * `window` - Reference to the Tauri window.
#[tauri::command]
pub fn force_activate(window: tauri::Window) {
    let _ = window.show();
    let _ = window.set_focus();
}

/// Saves dashboard HTML and data files, then opens the dashboard in the default browser.
///
/// # Arguments
/// * `html_content` - The HTML content for the dashboard page.
/// * `data_content` - The JavaScript data file content.
/// * `state` - Application state containing the data directory path.
///
/// # Returns
/// `Ok(())` on success, or an error message string on failure.
#[tauri::command]
pub fn save_and_open_dashboard(
    html_content: String,
    data_content: String,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let dashboard_dir = state.app_data_dir.join("dashboard");

    if !dashboard_dir.exists() {
        fs::create_dir_all(&dashboard_dir).map_err(|e| e.to_string())?;
    }

    let html_path = dashboard_dir.join("index.html");
    let data_path = dashboard_dir.join("data.js");

    fs::write(&html_path, html_content).map_err(|e| e.to_string())?;
    fs::write(&data_path, data_content).map_err(|e| e.to_string())?;

    open::that(&html_path).map_err(|e| e.to_string())?;

    Ok(())
}
