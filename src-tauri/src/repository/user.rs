use crate::entity::user::User;
use anyhow::Result;
use surrealdb::{engine::local::Db, Surreal};

pub async fn get_user(db: &Surreal<Db>) -> Result<Option<User>> {
    let mut result = db.query("SELECT * FROM user LIMIT 1").await?;

    let user: Option<User> = result.take(0)?;

    Ok(user)
}
