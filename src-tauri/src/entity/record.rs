use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

#[derive(Debug, Serialize, Deserialize)]
pub struct Record {
    pub id: Thing,
}
