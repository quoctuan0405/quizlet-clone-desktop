use surrealdb::{engine::local::Db, Surreal};

use crate::{
    entity::setting::Setting,
    repository::setting::{get_all_settings, get_setting, update_setting},
};

#[tauri::command]
pub async fn get_all_settings_cmd(
    db: tauri::State<'_, Surreal<Db>>,
) -> Result<Vec<Setting>, String> {
    let result = get_all_settings(&db).await;

    match result {
        Ok(settings) => Ok(settings),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
pub async fn get_setting_cmd(
    db: tauri::State<'_, Surreal<Db>>,
    key: String,
) -> Result<Option<Setting>, String> {
    let result = get_setting(&db, key).await;

    match result {
        Ok(setting) => Ok(setting),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
pub async fn update_setting_cmd(
    db: tauri::State<'_, Surreal<Db>>,
    setting: Setting,
) -> Result<(), String> {
    let result = update_setting(&db, setting).await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err.to_string()),
    }
}
