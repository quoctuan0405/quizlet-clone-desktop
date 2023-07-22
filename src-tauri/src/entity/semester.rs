use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Semester {
    pub id: Option<Thing>,
    pub name: String,
    pub is_delete: bool,
}
