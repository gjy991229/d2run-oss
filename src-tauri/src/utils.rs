//! Utility functions and shared application state.
//!
//! This module provides file system helpers and the global application state
//! used across all Tauri commands.

use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// Global application state managed by Tauri.
///
/// This struct holds paths and configuration that need to be accessed
/// by multiple commands throughout the application lifecycle.
pub struct AppState {
    /// Path to the application data directory where runs and config are stored.
    pub app_data_dir: PathBuf,
}

/// Returns the path to the runs data file.
///
/// # Arguments
/// * `dir` - The application data directory path.
///
/// # Returns
/// The full path to `runs.json`.
pub fn get_runs_path(dir: &PathBuf) -> PathBuf {
    dir.join("runs.json")
}

/// Returns the path to the configuration file.
///
/// # Arguments
/// * `dir` - The application data directory path.
///
/// # Returns
/// The full path to `config.json`.
pub fn get_config_path(dir: &PathBuf) -> PathBuf {
    dir.join("config.json")
}

/// Returns the path to the cloud runs data file.
///
/// # Arguments
/// * `dir` - The application data directory path.
///
/// # Returns
/// The full path to `runs_cloud.json`.
pub fn get_cloud_runs_path(dir: &PathBuf) -> PathBuf {
    dir.join("runs_cloud.json")
}

/// Ensures the application data directory exists, creating it if necessary.
///
/// # Arguments
/// * `app_handle` - Reference to the Tauri application handle.
///
/// # Returns
/// The path to the application data directory.
///
/// # Panics
/// Panics if the app data directory cannot be determined.
pub fn ensure_dir(app_handle: &AppHandle) -> PathBuf {
    let dir = app_handle
        .path()
        .app_data_dir()
        .expect("failed to get app data dir");
    if !dir.exists() {
        let _ = fs::create_dir_all(&dir);
    }
    dir
}
