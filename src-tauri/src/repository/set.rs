use anyhow::Result;
use serde::{Deserialize, Serialize};
use surrealdb::{engine::local::Db, sql::Thing, Surreal};

use crate::entity::{record::Record, set::Set, term::Term, StringOrJSON};

use super::{term::get_terms_by_set_id, user::get_user, util::converter::convert_to_thing};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetWithTermCount {
    pub id: Thing,
    pub name: String,
    pub description: Option<String>,
    pub term_count: i32,
    pub is_delete: bool,
}

pub async fn get_sets(db: &Surreal<Db>) -> Result<Vec<SetWithTermCount>> {
    let mut result = db
        .query("SELECT *, count(->have_term->term) as term_count FROM set WHERE is_delete = false ORDER BY name")
        .await?;

    let sets: Vec<SetWithTermCount> = result.take(0)?;

    Ok(sets)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetWithListTerm {
    pub id: Thing,
    pub name: String,
    pub description: Option<String>,
    pub terms: Vec<Term>,
    pub is_delete: bool,
}

pub async fn get_set_by_id(db: &Surreal<Db>, set_id: String) -> Result<Option<SetWithListTerm>> {
    let set_id_thing = convert_to_thing("set".to_string(), &set_id);

    let mut result = db
        .query("SELECT * FROM set WHERE is_delete = false AND id = $set_id")
        .bind(("set_id", &set_id_thing))
        .await?;

    let set: Option<Set> = result.take(0)?;

    match set {
        Some(set) => {
            let mut set_with_list_term = SetWithListTerm {
                id: set_id_thing,
                name: set.name,
                description: set.description,
                terms: vec![],
                is_delete: set.is_delete,
            };

            let terms = get_terms_by_set_id(db, set_id).await?;

            set_with_list_term.terms = terms;

            Ok(Some(set_with_list_term))
        }
        None => Ok(None),
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateTermPayload {
    pub id: String,
    pub index: Option<i32>,
    pub question: StringOrJSON,
    pub answer: StringOrJSON,
    pub explanation: Option<StringOrJSON>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetUpdateWithListTermPayload {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub terms: Vec<UpdateTermPayload>,
}

pub async fn update_set(db: &Surreal<Db>, set: SetUpdateWithListTermPayload) -> Result<Record> {
    // Update set
    let set_id = convert_to_thing("set".to_string(), &set.id);

    let set_entity = Set {
        id: Some(set_id.clone()),
        name: set.name,
        description: set.description,
        is_delete: false,
    };

    let record: Record = db
        .update(("set", set_id.id.to_string()))
        .content(&set_entity)
        .await?;

    let set_id = &record.id;

    let mut terms_id: Vec<Thing> = vec![];

    // Update term
    for term in set.terms {
        // Check if term exists
        let term_id = convert_to_thing("term".to_string(), &term.id);

        let mut result = db
            .query(
                "SELECT id FROM term 
                WHERE <-have_term<-(set WHERE id = $set_id)
                AND id = $term_id
                LIMIT 1",
            )
            .bind(("set_id", &set_id))
            .bind(("term_id", &term_id))
            .await?;

        let record: Option<Record> = result.take(0)?;

        // If exists update, else create
        let term_entity = Term {
            id: None,
            index: term.index,
            question: term.question,
            answer: term.answer,
            explanation: term.explanation,
            is_delete: false,
        };

        match record {
            Some(_) => {
                let record: Record = db
                    .update(("term", term_id.id.to_string()))
                    .content(&term_entity)
                    .await?;

                terms_id.push(record.id);
            }
            None => {
                let record: Record = db.create("term").content(&term_entity).await?;

                db.query("RELATE $set->have_term->$term")
                    .bind(("set", &set_id))
                    .bind(("term", &record.id))
                    .await?;

                terms_id.push(record.id);
            }
        }
    }

    db.query(
        "UPDATE term SET is_delete = true 
        WHERE id NOT IN $terms_id
        AND <-have_term<-(set WHERE id = $set_id)",
    )
    .bind(("terms_id", terms_id))
    .bind(("set_id", set_id))
    .await?;

    Ok(record)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateTermPayload {
    pub index: Option<i32>,
    pub question: StringOrJSON,
    pub answer: StringOrJSON,
    pub explanation: Option<StringOrJSON>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetCreateWithListTermPayload {
    pub name: String,
    pub description: Option<String>,
    pub terms: Vec<CreateTermPayload>,
}

pub async fn create_set(db: &Surreal<Db>, set: SetCreateWithListTermPayload) -> Result<Record> {
    // Create set
    let set_entity = Set {
        id: None,
        name: set.name,
        description: set.description,
        is_delete: false,
    };

    let record: Record = db.create("set").content(&set_entity).await?;

    let set_id = &record.id;

    // Create term
    for term in set.terms {
        let term_entity = Term {
            id: None,
            index: term.index,
            question: term.question,
            answer: term.answer,
            explanation: term.explanation,
            is_delete: false,
        };

        let record: Record = db.create("term").content(&term_entity).await?;

        db.query("RELATE $set->have_term->$term")
            .bind(("set", set_id))
            .bind(("term", &record.id))
            .await?;
    }

    Ok(record)
}

pub async fn delete_set(db: &Surreal<Db>, set_id: String) -> Result<Thing> {
    let set_id = convert_to_thing("set".to_string(), &set_id);

    db.query("UPDATE set SET is_delete = true WHERE id = $set_id")
        .bind(("set_id", &set_id))
        .await?;

    Ok(set_id)
}

pub async fn reset_learning(db: &Surreal<Db>, set_id: String) -> Result<()> {
    let user = get_user(db).await?;

    match user {
        Some(user) => {
            let set_id = convert_to_thing("set".to_string(), &set_id);

            // Select all terms from set
            // Have to work around since somehow this subquery
            // 'AND out IN (SELECT id FROM term WHERE <-have_term<-(set WHERE id = $set_id))'
            // does not work
            let mut response = db
                .query("SELECT id FROM term WHERE <-have_term<-(set WHERE id = $set_id)")
                .bind(("set_id", &set_id))
                .await?;

            let records: Vec<Record> = response.take(0)?;

            let mut term_ids: Vec<Thing> = vec![];

            for record in records {
                term_ids.push(record.id)
            }

            // Delete learn and master
            db.query(
                "DELETE FROM learn 
                WHERE in = $user_id
                AND out IN $term_ids",
            )
            .bind(("user_id", &user.id))
            .bind(("term_ids", &term_ids))
            .await?;

            db.query(
                "DELETE FROM master 
                WHERE in = $user_id
                AND out IN $term_ids",
            )
            .bind(("user_id", &user.id))
            .bind(("term_ids", &term_ids))
            .await?;
        }
        None => {}
    }

    Ok(())
}
