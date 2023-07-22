use serde::{Deserialize, Serialize};

use super::StringOrJSON;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Setting {
    pub key: String,
    pub value: StringOrJSON,
}
