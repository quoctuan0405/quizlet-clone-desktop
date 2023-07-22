use crate::entity::term::Term;
use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum TermEnum {
    Thing(Thing),
    Term(Term),
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Set {
    pub id: Option<Thing>,
    pub name: String,
    pub description: Option<String>,
    pub is_delete: bool,
}
