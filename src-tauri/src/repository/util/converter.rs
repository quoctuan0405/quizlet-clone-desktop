use surrealdb::sql::Thing;

pub fn convert_to_thing(tb: String, id: &String) -> Thing {
    let parts = id.split(":").collect::<Vec<&str>>();

    if parts.len() == 1 {
        if let Some(id) = parts.get(0) {
            return Thing {
                tb: "set".to_string(),
                id: surrealdb::sql::Id::String(id.to_string()),
            };
        }
    } else if parts.len() == 2 {
        if let Some(tb) = parts.get(0) {
            if let Some(id) = parts.get(1) {
                return Thing {
                    tb: tb.to_string(),
                    id: surrealdb::sql::Id::String(id.to_string()),
                };
            }
        }
    }

    return Thing {
        tb: tb.to_string(),
        id: surrealdb::sql::Id::String(id.to_string()),
    };
}
