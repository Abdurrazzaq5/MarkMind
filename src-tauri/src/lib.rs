// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use tauri::Emitter;
use tauri::Manager;
use tauri_plugin_global_shortcut::GlobalShortcutExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build()) // Only once!
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_file, save_file, create_file])
        .setup(|app| {
            // Register Ctrl+S / Cmd+S using `on_shortcut`
            let gs = app.global_shortcut();
            if let Err(e) = gs.on_shortcut("CmdOrCtrl+S", move |app_handle, _shortcut, _event| {
                // emit the save event to the frontend
                let _ = app_handle.emit("save-triggered", ());
            }) {
                eprintln!(
                    "warning: failed to register global shortcut 'CmdOrCtrl+S': {}",
                    e
                );
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::fs;
use std::path::PathBuf;

#[tauri::command]
fn open_file(path: String) -> Result<String, String> {
    fs::read_to_string(PathBuf::from(path)).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_file(path: String, content: String) -> Result<(), String> {
    fs::write(PathBuf::from(path), content).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_file(path: String) -> Result<(), String> {
    fs::write(PathBuf::from(path), "").map_err(|e| e.to_string())
}
