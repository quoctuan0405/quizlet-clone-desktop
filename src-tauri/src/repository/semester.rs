use crate::entity::semester::Semester;
use anyhow::Result;
use surrealdb::{engine::local::Db, Surreal};

pub async fn get_semesters(db: &Surreal<Db>) -> Result<Vec<Semester>> {
    let mut result = db
        .query("SELECT * FROM semester WHERE is_delete = false ORDER BY name")
        .await?;

    let semesters: Vec<Semester> = result.take(0)?;

    Ok(semesters)
}
