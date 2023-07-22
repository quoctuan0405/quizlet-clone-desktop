use serde::Serialize;
use surrealdb::engine::local::Db;
use surrealdb::sql::Thing;
use surrealdb::Surreal;

use crate::repository::semester::get_semesters;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Semester {
    pub id: Thing,
    pub name: String,
}

#[tauri::command]
pub async fn get_semester_cmd(db: tauri::State<'_, Surreal<Db>>) -> Result<Vec<Semester>, String> {
    let result = get_semesters(&db).await;

    match result {
        Ok(semesters) => {
            let mut result: Vec<Semester> = vec![];

            for semester in semesters {
                if let Some(semester_id) = semester.id {
                    result.push(Semester {
                        id: semester_id,
                        name: semester.name,
                    })
                }
            }

            Ok(result)
        }
        Err(err) => Err(err.to_string()),
    }
}
