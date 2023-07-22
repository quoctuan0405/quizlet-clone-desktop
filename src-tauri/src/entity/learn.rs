use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Learn {
    pub id: Option<Thing>,
    pub r#in: Option<Thing>,
    pub out: Option<Thing>,
    pub remained: i32,
}
