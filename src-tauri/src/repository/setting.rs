use anyhow::Result;
use surrealdb::{engine::local::Db, Surreal};

use crate::entity::setting::Setting;

pub async fn get_all_settings(db: &Surreal<Db>) -> Result<Vec<Setting>> {
    let mut result = db.query("SELECT * FROM setting").await?;

    let settings: Vec<Setting> = result.take(0)?;

    Ok(settings)
}

pub async fn get_setting(db: &Surreal<Db>, key: String) -> Result<Option<Setting>> {
    let mut result = db
        .query("SELECT * FROM setting WHERE key = $key LIMIT 1")
        .bind(("key", key))
        .await?;

    let setting: Option<Setting> = result.take(0)?;

    Ok(setting)
}

pub async fn update_setting(db: &Surreal<Db>, setting: Setting) -> Result<()> {
    db.query("UPDATE setting SET value = $value WHERE key = $key")
        .bind(("key", setting.key))
        .bind(("value", setting.value))
        .await?;

    Ok(())
}
