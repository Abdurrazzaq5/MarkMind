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
        // Register global-shortcut plugin (only once)
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        // Other plugins
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        // All invoke handlers in one place
        .invoke_handler(tauri::generate_handler![
            open_file,
            save_file,
            create_file,
            save_api_key,
            load_api_key,
            delete_api_key,
            has_api_key,
        ])
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

use keyring::Entry;

const SERVICE_NAME: &str = "MarkMind";
const KEY_NAME: &str = "gemini_api_key";

#[tauri::command]
fn save_api_key(api_key: String) -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, KEY_NAME)
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;

    entry
        .set_password(&api_key)
        .map_err(|e| format!("Failed to save API Key: {}", e))?;

    Ok(())
}

#[tauri::command]
fn load_api_key() -> Result<String, String> {
    let entry = Entry::new(SERVICE_NAME, KEY_NAME)
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;

    entry
        .get_password()
        .map_err(|e| format!("Failed to load API key: {}", e))
}

#[tauri::command]
fn delete_api_key() -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, KEY_NAME)
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;

    entry
        .delete_credential()
        .map_err(|e| format!("Failed to delete API key: {}", e))?;

    Ok(())
}

#[tauri::command]
fn has_api_key() -> Result<bool, String> {
    let entry = Entry::new(SERVICE_NAME, KEY_NAME)
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;

    match entry.get_password() {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}
