use crate::entity::major::Major;
use anyhow::Result;
use surrealdb::{engine::local::Db, Surreal};

pub async fn get_major(db: &Surreal<Db>) -> Result<Vec<Major>> {
    let mut result = db
        .query("SELECT * FROM major where is_delete = false")
        .await?;

    let majors: Vec<Major> = result.take(0)?;

    Ok(majors)
}
