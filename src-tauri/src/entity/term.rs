use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

use super::StringOrJSON;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Term {
    pub id: Option<Thing>,
    pub index: Option<i32>,
    pub question: StringOrJSON,
    pub answer: StringOrJSON,
    pub explanation: Option<StringOrJSON>,
    pub is_delete: bool,
}
