use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;

pub mod learn;
pub mod major;
pub mod record;
pub mod semester;
pub mod set;
pub mod setting;
pub mod term;
pub mod user;

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(untagged)]
pub enum StringOrJSON {
    Bool(bool),
    I32(i32),
    String(String),
    HashMap(HashMap<String, Value>),
    VecHashMap(Vec<HashMap<String, Value>>),
}
