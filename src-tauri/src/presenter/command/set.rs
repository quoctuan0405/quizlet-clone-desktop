use serde::{Deserialize, Serialize};
use surrealdb::engine::local::Db;
use surrealdb::sql::Thing;
use surrealdb::Surreal;

use crate::{
    entity::{record::Record, StringOrJSON},
    repository::set::{self, create_set, delete_set, reset_learning, update_set},
    repository::set::{get_set_by_id, get_sets},
};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Set {
    pub id: Thing,
    pub name: String,
    pub description: Option<String>,
    pub term_count: i32,
}

#[tauri::command]
pub async fn get_sets_cmd(db: tauri::State<'_, Surreal<Db>>) -> Result<Vec<Set>, String> {
    let result = get_sets(&db).await;

    match result {
        Ok(sets) => {
            let mut result: Vec<Set> = vec![];

            for set in sets {
                result.push(Set {
                    id: set.id,
                    name: set.name,
                    description: set.description,
                    term_count: set.term_count,
                })
            }

            Ok(result)
        }
        Err(err) => Err(err.to_string()),
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Term {
    pub id: Option<Thing>,
    pub index: Option<i32>,
    pub question: StringOrJSON,
    pub answer: StringOrJSON,
    pub explanation: Option<StringOrJSON>,
    pub is_delete: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetWithListTerm {
    pub id: Thing,
    pub name: String,
    pub description: Option<String>,
    pub terms: Vec<Term>,
    pub is_delete: bool,
}

#[tauri::command]
pub async fn get_set_by_id_cmd(
    db: tauri::State<'_, Surreal<Db>>,
    set_id: String,
) -> Result<Option<SetWithListTerm>, String> {
    let result = get_set_by_id(&db, set_id).await;

    match result {
        Ok(set) => {
            if let Some(set) = set {
                let mut set_with_list_term = SetWithListTerm {
                    id: set.id,
                    name: set.name,
                    description: set.description,
                    terms: vec![],
                    is_delete: set.is_delete,
                };

                for term in set.terms {
                    set_with_list_term.terms.push(Term {
                        id: term.id,
                        index: term.index,
                        question: term.question,
                        answer: term.answer,
                        explanation: term.explanation,
                        is_delete: term.is_delete,
                    })
                }

                return Ok(Some(set_with_list_term));
            }

            Ok(None)
        }
        Err(err) => Err(err.to_string()),
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TermPayload {
    id: String,
    index: Option<i32>,
    question: StringOrJSON,
    answer: StringOrJSON,
    explanation: Option<StringOrJSON>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateSetPayload {
    id: String,
    name: String,
    description: Option<String>,
    terms: Vec<TermPayload>,
}

#[tauri::command]
pub async fn update_set_cmd(
    db: tauri::State<'_, Surreal<Db>>,
    set_payload: UpdateSetPayload,
) -> Result<Record, String> {
    let mut set = set::SetUpdateWithListTermPayload {
        id: set_payload.id,
        name: set_payload.name,
        description: set_payload.description,
        terms: vec![],
    };

    for term_payload in set_payload.terms {
        let term = set::UpdateTermPayload {
            id: term_payload.id,
            index: term_payload.index,
            question: term_payload.question,
            answer: term_payload.answer,
            explanation: term_payload.explanation,
        };

        set.terms.push(term);
    }

    let result = update_set(&db, set).await;

    match result {
        Ok(result) => Ok(result),
        Err(err) => Err(err.to_string()),
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateSetPayload {
    name: String,
    description: Option<String>,
    terms: Vec<TermPayload>,
}

#[tauri::command]
pub async fn create_set_cmd(
    db: tauri::State<'_, Surreal<Db>>,
    set_payload: CreateSetPayload,
) -> Result<Record, String> {
    let mut set = set::SetCreateWithListTermPayload {
        name: set_payload.name,
        description: set_payload.description,
        terms: vec![],
    };

    for term_payload in set_payload.terms {
        let term = set::CreateTermPayload {
            index: term_payload.index,
            question: term_payload.question,
            answer: term_payload.answer,
            explanation: term_payload.explanation,
        };

        set.terms.push(term);
    }

    let result = create_set(&db, set).await;

    match result {
        Ok(result) => Ok(result),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
pub async fn delete_set_cmd(
    db: tauri::State<'_, Surreal<Db>>,
    set_id: String,
) -> Result<Thing, String> {
    let result = delete_set(&db, set_id).await;

    match result {
        Ok(result) => Ok(result),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
pub async fn reset_learning_cmd(
    db: tauri::State<'_, Surreal<Db>>,
    set_id: String,
) -> Result<(), String> {
    let result = reset_learning(&db, set_id).await;

    match result {
        Ok(result) => Ok(result),
        Err(err) => Err(err.to_string()),
    }
}
