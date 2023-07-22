use crate::entity::StringOrJSON;
use crate::entity::{learn::Learn, term::Term};
use crate::repository::user::get_user;
use crate::repository::util::converter::convert_to_thing;
use anyhow::Result;
use serde::{Deserialize, Serialize};
use surrealdb::{engine::local::Db, sql::Thing, Surreal};

pub async fn get_terms_by_set_id(db: &Surreal<Db>, set_id: String) -> Result<Vec<Term>> {
    let set_id = convert_to_thing("set".to_string(), &set_id);

    let mut result = db
        .query("SELECT * FROM term WHERE <-have_term<-(set WHERE id = $set_id) AND is_delete = false ORDER BY index ASC")
        .bind(("set_id", set_id))
        .await?;

    let terms: Vec<Term> = result.take(0)?;

    Ok(terms)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Choice {
    pub question: StringOrJSON,
    pub answer: StringOrJSON,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TermWithChoices {
    pub id: Option<Thing>,
    pub index: Option<i32>,
    pub question: StringOrJSON,
    pub answer: StringOrJSON,
    pub explanation: Option<StringOrJSON>,
    pub choices: Vec<Choice>,
    pub is_delete: bool,
}

pub async fn get_random_learning_term(
    db: &Surreal<Db>,
    set_id: String,
) -> Result<Option<TermWithChoices>> {
    let set_id = convert_to_thing("set".to_string(), &set_id);

    let mut result = db
        .query(
            "SELECT * FROM term 
            WHERE <-have_term<-(set WHERE id = $set_id) 
            AND is_delete = false 
            AND (count(<-master) == 0)
            AND (count(<-learn) == 0 OR array::min(<-learn.remained) > 0) 
            ORDER BY RAND() LIMIT 1",
        )
        .bind(("set_id", &set_id))
        .await?;

    let term: Option<Term> = result.take(0)?;

    let mut term_with_choices = TermWithChoices {
        id: None,
        index: None,
        question: StringOrJSON::String("".to_string()),
        answer: StringOrJSON::String("".to_string()),
        explanation: None,
        choices: vec![],
        is_delete: false,
    };

    if let Some(term) = term {
        term_with_choices.index = term.index;
        term_with_choices.question = term.question;
        term_with_choices.answer = term.answer;
        term_with_choices.explanation = term.explanation;
        term_with_choices.is_delete = term.is_delete;

        if let Some(term_id) = term.id {
            term_with_choices.id = Some(term_id.clone());

            let mut result = db
                .query(
                    "SELECT * FROM term 
                    WHERE <-have_term<-(set WHERE id = $set_id) 
                    AND is_delete = false 
                    AND id != $term_id
                    ORDER BY RAND() LIMIT 3",
                )
                .bind(("set_id", &set_id))
                .bind(("term_id", &term_id))
                .await?;

            let terms: Vec<Term> = result.take(0)?;

            for term in terms.into_iter() {
                term_with_choices.choices.push(Choice {
                    question: term.question,
                    answer: term.answer,
                });
            }
        }

        Ok(Some(term_with_choices))
    } else {
        Ok(None)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LearningProgressResult {
    pub terms_learned: i32,
    pub terms_mastered: i32,
    pub terms_total: i32,
}

pub async fn get_learning_progress(
    db: &Surreal<Db>,
    set_id: String,
) -> Result<LearningProgressResult> {
    let set_id = convert_to_thing("set".to_string(), &set_id);

    #[derive(Debug, Clone, Serialize, Deserialize)]
    struct CountResult {
        count: i32,
    }

    let mut result = db
        .query(
            "SELECT count() as count, term.id FROM term
            WHERE <-have_term<-(set WHERE id = $set_id) 
            AND is_delete = false
            GROUP BY term.id",
        )
        .bind(("set_id", &set_id))
        .await?;

    let total_terms_count: Option<CountResult> = result.take(0)?;

    let mut result = db
        .query(
            "SELECT count() as count, term.id FROM term
            WHERE <-have_term<-(set WHERE id = $set_id) 
            AND is_delete = false
            AND (count(<-master) != 0 OR array::min(<-learn.remained) > 0)
            GROUP BY term.id",
        )
        .bind(("set_id", &set_id))
        .await?;

    let learning_terms_count: Option<CountResult> = result.take(0)?;

    let mut result = db
        .query(
            "SELECT count() as count, term.id FROM term
            WHERE <-have_term<-(set WHERE id = $set_id) 
            AND is_delete = false
            AND (count(<-master) != 0)
            GROUP BY term.id",
        )
        .bind(("set_id", &set_id))
        .await?;

    let master_terms_count: Option<CountResult> = result.take(0)?;

    let learning_progress_result = LearningProgressResult {
        terms_learned: match learning_terms_count {
            Some(learning_terms_count) => learning_terms_count.count,
            None => 0,
        },
        terms_mastered: match master_terms_count {
            Some(master_terms_count) => master_terms_count.count,
            None => 0,
        },
        terms_total: match total_terms_count {
            Some(total_terms_count) => total_terms_count.count,
            None => 0,
        },
    };

    Ok(learning_progress_result)
}

pub async fn report_learning_progress(
    db: &Surreal<Db>,
    term_id: String,
    is_correct: bool,
) -> Result<()> {
    // Get user
    let user = get_user(db).await?;

    match user {
        Some(user) => {
            // Get learning progress
            let term_id = convert_to_thing("term".to_string(), &term_id);

            let mut result = db
                .query(
                    "SELECT * FROM learn
                    WHERE out = $term_id
                    AND in = $user_id
                    LIMIT 1",
                )
                .bind(("term_id", &term_id))
                .bind(("user_id", &user.id))
                .await?;

            let learn: Option<Learn> = result.take(0)?;

            // Set learning
            match learn {
                Some(learn) => {
                    if is_correct {
                        let remained: i32 = learn.remained - 1;

                        if remained == 0 {
                            db.query("DELETE FROM learn WHERE id = $learn_id")
                                .bind(("learn_id", learn.id))
                                .await?;

                            db.query("RELATE $user_id->master->$term_id")
                                .bind(("term_id", &term_id))
                                .bind(("user_id", &user.id))
                                .await?;
                        } else {
                            db.query("UPDATE learn SET remained = $remained WHERE id = $learn_id")
                                .bind(("learn_id", learn.id))
                                .bind(("remained", remained))
                                .await?;
                        }
                    } else {
                        db.query("UPDATE learn SET remained = $remained WHERE id = $learn_id")
                            .bind(("learn_id", learn.id))
                            .bind(("remained", 4))
                            .await?;
                    }
                }
                None => {
                    if is_correct {
                        db.query("RELATE $user_id->learn->$term_id SET remained = $remained")
                            .bind(("term_id", &term_id))
                            .bind(("user_id", &user.id))
                            .bind(("remained", 2))
                            .await?;
                    } else {
                        db.query("RELATE $user_id->learn->$term_id SET remained = $remained")
                            .bind(("term_id", &term_id))
                            .bind(("user_id", &user.id))
                            .bind(("remained", 4))
                            .await?;
                    }
                }
            }
        }
        None => {}
    }

    Ok(())
}
