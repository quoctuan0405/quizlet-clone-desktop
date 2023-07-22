use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct User {
    pub id: Option<Thing>,
    pub username: String,
    pub is_delete: bool,
}
