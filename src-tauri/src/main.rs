// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use anyhow;
use surrealdb::engine::local::{Db, RocksDb};
use surrealdb::Surreal;

// Import
mod entity;
mod presenter;
mod repository;
mod seed;
use entity::major::Major;
use presenter::command::{semester, set, setting, term};
use repository::major::get_major;
use seed::seed;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn greet(db: tauri::State<'_, Surreal<Db>>) -> Result<Vec<Major>, String> {
    let result = get_major(&db).await;

    match result {
        Ok(result) => Ok(result),
        Err(err) => Err(err.to_string()),
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    #[allow(unused_variables)]
    let file_path = "./data/file.db";

    #[cfg(dev)]
    let file_path = "../data/file.db";

    let db = Surreal::new::<RocksDb>(file_path).await?;
    db.use_ns("ns").use_db("db").await?;

    // Seed
    seed(&db).await?;

    tauri::Builder::default()
        .manage(db)
        .invoke_handler(tauri::generate_handler![
            greet,
            semester::get_semester_cmd,
            set::get_sets_cmd,
            set::update_set_cmd,
            set::create_set_cmd,
            set::get_set_by_id_cmd,
            set::delete_set_cmd,
            set::reset_learning_cmd,
            term::get_terms_cmd,
            term::get_learning_progress_cmd,
            term::get_random_learning_term_cmd,
            term::report_learning_progress_cmd,
            setting::get_all_settings_cmd,
            setting::get_setting_cmd,
            setting::update_setting_cmd
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    return Ok(());
}
