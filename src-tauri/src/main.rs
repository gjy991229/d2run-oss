//! D2Run Lite - Diablo II Speedrun Timer
//!
//! A lightweight desktop application for tracking Diablo II speedruns
//! with real-time drop recording and statistics.
//!
//! Built with Tauri, Vue 3, and TypeScript.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod models;
mod utils;

use crate::models::KeyEventPayload;
use crate::utils::{ensure_dir, AppState};
use rdev::{listen, EventType, Key};
use std::thread;
use tauri::{Emitter, Manager};

/// Application entry point.
///
/// Initializes the Tauri application with:
/// - Application state management
/// - Global keyboard listener for shortcuts
/// - IPC command handlers
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Initialize application data directory
            let app_dir = ensure_dir(app.handle());
            app.manage(AppState {
                app_data_dir: app_dir,
            });

            let handle = app.handle().clone();

            // Spawn global keyboard listener thread
            // This enables shortcuts to work even when the app is not focused
            thread::spawn(move || {
                let mut ctrl = false;
                let mut alt = false;
                let mut shift = false;

                let _ = listen(move |event| match event.event_type {
                    EventType::KeyPress(key) => match key {
                        // Track modifier key states
                        Key::ControlLeft | Key::ControlRight => ctrl = true,
                        Key::ShiftLeft | Key::ShiftRight => shift = true,
                        Key::Alt | Key::AltGr => alt = true,
                        Key::MetaLeft | Key::MetaRight => {}
                        // Emit key press events for regular keys
                        _ => {
                            let key_name = format!("{:?}", key);
                            let payload = KeyEventPayload {
                                name: key_name,
                                ctrl,
                                alt,
                                shift,
                            };
                            let _ = handle.emit("global-key-press", payload);
                        }
                    },
                    EventType::KeyRelease(key) => match key {
                        // Reset modifier key states on release
                        Key::ControlLeft | Key::ControlRight => ctrl = false,
                        Key::ShiftLeft | Key::ShiftRight => shift = false,
                        Key::Alt | Key::AltGr => alt = false,
                        _ => {}
                    },
                    _ => {}
                });
            });

            // Show the main window
            let main_window = app.get_webview_window("main").unwrap();
            main_window.show().unwrap();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Run management
            commands::get_runs,
            commands::save_run,
            commands::delete_run,
            commands::clear_runs,
            commands::get_cloud_runs,
            commands::save_cloud_runs,
            // Configuration
            commands::get_config,
            commands::save_config,
            commands::reset_config,
            // Window control
            commands::resize_window,
            commands::resize_window_custom,
            commands::force_activate,
            commands::quit_app,
            // Keyboard recording
            commands::start_record_key,
            commands::stop_record_key,
            // Dashboard
            commands::save_and_open_dashboard,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
