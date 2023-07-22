use crate::entity::StringOrJSON;
use crate::repository::term::{
    get_learning_progress, get_random_learning_term, get_terms_by_set_id, report_learning_progress,
};
use serde::Serialize;
use surrealdb::engine::local::Db;
use surrealdb::sql::Thing;
use surrealdb::Surreal;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Term {
    pub id: Thing,
    pub index: Option<i32>,
    pub question: StringOrJSON,
    pub answer: StringOrJSON,
    pub explanation: Option<StringOrJSON>,
}

#[tauri::command]
pub async fn get_terms_cmd(
    db: tauri::State<'_, Surreal<Db>>,
    set_id: String,
) -> Result<Vec<Term>, String> {
    let result = get_terms_by_set_id(&db, set_id).await;

    match result {
        Ok(terms) => {
            let mut result: Vec<Term> = vec![];

            for term in terms {
                if let Some(term_id) = term.id {
                    result.push(Term {
                        id: term_id,
                        index: term.index,
                        question: term.question,
                        answer: term.answer,
                        explanation: term.explanation,
                    })
                }
            }

            Ok(result)
        }
        Err(err) => Err(err.to_string()),
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Choice {
    pub question: StringOrJSON,
    pub answer: StringOrJSON,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TermWithChoices {
    pub id: Thing,
    pub index: Option<i32>,
    pub question: StringOrJSON,
    pub answer: StringOrJSON,
    pub choices: Vec<Choice>,
    pub explanation: Option<StringOrJSON>,
}

#[tauri::command]
pub async fn get_random_learning_term_cmd(
    db: tauri::State<'_, Surreal<Db>>,
    set_id: String,
) -> Result<Option<TermWithChoices>, String> {
    let result = get_random_learning_term(&db, set_id).await;

    match result {
        Ok(term) => {
            if let Some(term) = term {
                if let Some(term_id) = term.id {
                    let mut term_with_choices = TermWithChoices {
                        id: term_id,
                        index: term.index,
                        question: term.question,
                        answer: term.answer,
                        choices: vec![],
                        explanation: term.explanation,
                    };

                    for choice in term.choices.into_iter() {
                        term_with_choices.choices.push(Choice {
                            question: choice.question,
                            answer: choice.answer,
                        })
                    }

                    Ok(Some(term_with_choices))
                } else {
                    Err("Somehow term don't have an id".to_string())
                }
            } else {
                Ok(None)
            }
        }
        Err(err) => Err(err.to_string()),
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LearningProgressResult {
    pub terms_learned: i32,
    pub terms_mastered: i32,
    pub terms_total: i32,
}

#[tauri::command]
pub async fn get_learning_progress_cmd(
    db: tauri::State<'_, Surreal<Db>>,
    set_id: String,
) -> Result<LearningProgressResult, String> {
    let result = get_learning_progress(&db, set_id).await;

    match result {
        Ok(learning_progress_result) => Ok(LearningProgressResult {
            terms_learned: learning_progress_result.terms_learned,
            terms_mastered: learning_progress_result.terms_mastered,
            terms_total: learning_progress_result.terms_total,
        }),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
pub async fn report_learning_progress_cmd(
    db: tauri::State<'_, Surreal<Db>>,
    term_id: String,
    is_correct: bool,
) -> Result<(), String> {
    let result = report_learning_progress(&db, term_id, is_correct).await;

    match result {
        Ok(result) => Ok(result),
        Err(err) => Err(err.to_string()),
    }
}
