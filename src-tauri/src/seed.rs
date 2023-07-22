use anyhow;
use serde::{Deserialize, Serialize};
use surrealdb::engine::local::Db;
use surrealdb::sql::Thing;
use surrealdb::Surreal;

use crate::entity::set::Set;
use crate::entity::setting::Setting;
use crate::entity::term::Term;
use crate::entity::user::User;
use crate::entity::StringOrJSON;
use crate::entity::{major::Major, record::Record, semester::Semester};

#[derive(Debug, Clone, Deserialize, Serialize)]
struct CountResult {
    count: i32,
}

pub async fn seed(db: &Surreal<Db>) -> anyhow::Result<()> {
    // User
    let mut response = db
        .query("SELECT count() AS count FROM user GROUP ALL")
        .await?;
    let result: Option<CountResult> = response.take(0)?;

    if let Some(result) = result {
        if result.count == 0 {
            seed_user(db).await?;
        }
    } else {
        seed_user(db).await?;
    }

    // // Major
    // let mut response = db
    //     .query("SELECT count() AS count FROM major GROUP ALL")
    //     .await?;
    // let result: Option<CountResult> = response.take(0)?;

    // if let Some(result) = result {
    //     if result.count == 0 {
    //         seed_major(db).await?;
    //     }
    // } else {
    //     seed_major(db).await?;
    // }

    // Set
    let mut response = db
        .query("SELECT count() AS count FROM set GROUP ALL")
        .await?;
    let result: Option<CountResult> = response.take(0)?;

    if let Some(result) = result {
        if result.count == 0 {
            seed_set(db).await?;
        }
    } else {
        seed_set(db).await?;
    }

    // // Setting
    // let mut response = db
    //     .query("SELECT count() AS count FROM set GROUP ALL")
    //     .await?;
    // let result: Option<CountResult> = response.take(0)?;

    // if let Some(result) = result {
    //     if result.count == 0 {
    //         seed_setting(db).await?;
    //     }
    // } else {
    //     seed_setting(db).await?;
    // }

    // let record: Record = db
    //     .update(("term", "asdfasdfasdf"))
    //     .content(Term {
    //         id: None,
    //         index: Some(0),
    //         question: StringOrJSON::String("asdf".to_string()),
    //         answer: StringOrJSON::String("asdf".to_string()),
    //         explanation: None,
    //         is_delete: false,
    //     })
    //     .await?;

    // println!("{:?}", record);

    // let result = db
    //     .query("SELECT * FROM term WHERE id = $id")
    //     .bind(("id", record.id))
    //     .await?;

    // println!("{:?}", result);

    // if let Some(set_id) = set_ids.get(0) {
    //     let asdf: Thing = Thing {
    //         tb: "set".to_string(),
    //         id: set_id.id.clone(),
    //     };

    //     let mut result = db
    //         .query("SELECT * FROM term WHERE <-have_term<-(set WHERE id = $set_id)")
    //         .bind(("set_id", &asdf))
    //         .await?;

    //     // let terms: Vec<Term> = result.take(0)?;
    // }

    Ok(())
}

async fn seed_user(db: &Surreal<Db>) -> anyhow::Result<()> {
    let user: User = User {
        id: None,
        username: "username".to_string(),
        is_delete: false,
    };

    db.query("CREATE user CONTENT $user RETURN id")
        .bind(("user", user))
        .await?;

    Ok(())
}

async fn seed_setting(db: &Surreal<Db>) -> anyhow::Result<()> {
    db.query("CREATE setting CONTENT $setting RETURN id")
        .bind((
            "setting",
            Setting {
                key: "dark_mode".to_string(),
                value: StringOrJSON::Bool(false),
            },
        ))
        .await?;

    Ok(())
}

async fn seed_major(db: &Surreal<Db>) -> anyhow::Result<()> {
    let ks: Major = Major {
        id: None,
        name: "KS".to_string(),
        is_delete: false,
    };
    let mut response = db
        .query("CREATE major CONTENT $ks RETURN id")
        .bind(("ks", ks))
        .await?;
    let record: Option<Record> = response.take(0)?;
    let major_id = record.unwrap().id;

    // Semester
    let semesters: Vec<Semester> = vec![
        Semester {
            id: None,
            name: "Semester 6".to_string(),
            is_delete: false,
        },
        Semester {
            id: None,
            name: "Semester 7".to_string(),
            is_delete: false,
        },
        Semester {
            id: None,
            name: "Semester 8".to_string(),
            is_delete: false,
        },
        Semester {
            id: None,
            name: "Semester 9".to_string(),
            is_delete: false,
        },
    ];

    for semester in semesters.iter() {
        let mut response = db
            .query("CREATE semester CONTENT $semester RETURN id")
            .bind(("semester", semester))
            .await?;
        let result: Option<Record> = response.take(0)?;
        let semester_id = result.unwrap().id;

        db.query("RELATE $major->have_semester->$semester")
            .bind(("major", &major_id))
            .bind(("semester", &semester_id))
            .await?;
    }

    Ok(())
}

async fn seed_set(db: &Surreal<Db>) -> anyhow::Result<()> {
    #[derive(Debug, Clone, Deserialize, Serialize)]
    struct SetWithListTerm {
        id: Option<Thing>,
        name: String,
        description: Option<String>,
        terms: Vec<Term>,
        is_delete: bool,
    }

    let sets: Vec<SetWithListTerm> = vec![
        SetWithListTerm {
            id: None,
            name: "제15과: 교통".to_string(),
            description: None,
            terms: vec![
                Term {
                    id: None,
                    index: Some(0),
                    question: StringOrJSON::String("버스".to_string()),
                    answer: StringOrJSON::String("Xe buýt".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(1),
                    question: StringOrJSON::String("기차".to_string()),
                    answer: StringOrJSON::String("Tàu hỏa".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(2),
                    question: StringOrJSON::String("택시".to_string()),
                    answer: StringOrJSON::String("Taxi".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(3),
                    question: StringOrJSON::String("지하철".to_string()),
                    answer: StringOrJSON::String("Tàu điện ngầm".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(4),
                    question: StringOrJSON::String("오토바이".to_string()),
                    answer: StringOrJSON::String("Xe máy".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(5),
                    question: StringOrJSON::String("자동차".to_string()),
                    answer: StringOrJSON::String("Ô tô".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(6),
                    question: StringOrJSON::String("배".to_string()),
                    answer: StringOrJSON::String("Thuyền".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(7),
                    question: StringOrJSON::String("비행기".to_string()),
                    answer: StringOrJSON::String("Máy bay".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(8),
                    question: StringOrJSON::String("자전거".to_string()),
                    answer: StringOrJSON::String("Xe đạp".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(9),
                    question: StringOrJSON::String("전차".to_string()),
                    answer: StringOrJSON::String("Tàu điện".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(10),
                    question: StringOrJSON::String("어떻게".to_string()),
                    answer: StringOrJSON::String("Như thế nào".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(11),
                    question: StringOrJSON::String("얼마나".to_string()),
                    answer: StringOrJSON::String("Bao nhiêu, bao lâu".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(12),
                    question: StringOrJSON::String("언제".to_string()),
                    answer: StringOrJSON::String("Khi nào, bao giờ".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(13),
                    question: StringOrJSON::String("왜".to_string()),
                    answer: StringOrJSON::String("Tại sao".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(14),
                    question: StringOrJSON::String("모범택시".to_string()),
                    answer: StringOrJSON::String("Taxi cao cấp".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(15),
                    question: StringOrJSON::String("개인택시".to_string()),
                    answer: StringOrJSON::String("Taxi cá nhân".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(16),
                    question: StringOrJSON::String("요금".to_string()),
                    answer: StringOrJSON::String("Tiền vé, cước phí".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(17),
                    question: StringOrJSON::String("버스 정류장".to_string()),
                    answer: StringOrJSON::String("Trạm xe buýt".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(18),
                    question: StringOrJSON::String("고속버스".to_string()),
                    answer: StringOrJSON::String("Xe buýt cao tốc".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(19),
                    question: StringOrJSON::String("시내버스".to_string()),
                    answer: StringOrJSON::String("Xe buýt nội thành".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(20),
                    question: StringOrJSON::String("버스 터미널".to_string()),
                    answer: StringOrJSON::String("Bến xe khách".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(21),
                    question: StringOrJSON::String("교통 카드".to_string()),
                    answer: StringOrJSON::String("Thẻ giao thông".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(22),
                    question: StringOrJSON::String("마을버스".to_string()),
                    answer: StringOrJSON::String("Xe buýt tuyến ngắn".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(23),
                    question: StringOrJSON::String("매표소".to_string()),
                    answer: StringOrJSON::String("Quầy vé".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(24),
                    question: StringOrJSON::String("시하철 역".to_string()),
                    answer: StringOrJSON::String("Ga tàu điện ngầm".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(25),
                    question: StringOrJSON::String("시하철 노선도".to_string()),
                    answer: StringOrJSON::String("Bản đồ tuyến tàu điện ngầm".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(26),
                    question: StringOrJSON::String("기차 역".to_string()),
                    answer: StringOrJSON::String("Ga tàu hỏa".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(27),
                    question: StringOrJSON::String("공항".to_string()),
                    answer: StringOrJSON::String("Sân bay".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(28),
                    question: StringOrJSON::String("주차장".to_string()),
                    answer: StringOrJSON::String("Bãi đỗ xe".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(29),
                    question: StringOrJSON::String("주유소".to_string()),
                    answer: StringOrJSON::String("Trạm xăng".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(30),
                    question: StringOrJSON::String("횡단보도".to_string()),
                    answer: StringOrJSON::String("Vạch sang đường".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(31),
                    question: StringOrJSON::String("육교".to_string()),
                    answer: StringOrJSON::String("Cầu vượt".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(32),
                    question: StringOrJSON::String("지하도".to_string()),
                    answer: StringOrJSON::String("Đường hầm".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(33),
                    question: StringOrJSON::String("신호등".to_string()),
                    answer: StringOrJSON::String("Đèn tín hiệu giao thông".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(34),
                    question: StringOrJSON::String("고속도로".to_string()),
                    answer: StringOrJSON::String("Đường cao tốc".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(35),
                    question: StringOrJSON::String("도로".to_string()),
                    answer: StringOrJSON::String("Đường, đại lộ".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(36),
                    question: StringOrJSON::String("타다".to_string()),
                    answer: StringOrJSON::String("Lên xe".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(37),
                    question: StringOrJSON::String("내리다".to_string()),
                    answer: StringOrJSON::String("Xuống".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(38),
                    question: StringOrJSON::String("갈아타다".to_string()),
                    answer: StringOrJSON::String("Đổi xe".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(39),
                    question: StringOrJSON::String("길이 막히다".to_string()),
                    answer: StringOrJSON::String("Tắc đường".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(40),
                    question: StringOrJSON::String("시간이 걸리다".to_string()),
                    answer: StringOrJSON::String("Mất thời gian".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(41),
                    question: StringOrJSON::String("교통사고가 나다".to_string()),
                    answer: StringOrJSON::String("Xảy ra tai nạn giao thông".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(42),
                    question: StringOrJSON::String("간식".to_string()),
                    answer: StringOrJSON::String("Bữa phụ, quà vặt".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(43),
                    question: StringOrJSON::String("빨갛다".to_string()),
                    answer: StringOrJSON::String("Màu đỏ".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(44),
                    question: StringOrJSON::String("남산".to_string()),
                    answer: StringOrJSON::String("Núi Namsan".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(45),
                    question: StringOrJSON::String("시내".to_string()),
                    answer: StringOrJSON::String("Trung tâm thành phố".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(46),
                    question: StringOrJSON::String("요리 학원".to_string()),
                    answer: StringOrJSON::String("Trung tâm dạy nấu ăn".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(47),
                    question: StringOrJSON::String("야경".to_string()),
                    answer: StringOrJSON::String("Quang cảnh buổi tối".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(48),
                    question: StringOrJSON::String("지각하다".to_string()),
                    answer: StringOrJSON::String("Muộn, trễ".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(49),
                    question: StringOrJSON::String("편의점".to_string()),
                    answer: StringOrJSON::String("Cửa hàng tiện lợi".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(50),
                    question: StringOrJSON::String("학생회관".to_string()),
                    answer: StringOrJSON::String("Hội quán sinh viên".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(51),
                    question: StringOrJSON::String("파랗다".to_string()),
                    answer: StringOrJSON::String("Xanh da trời".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(52),
                    question: StringOrJSON::String("노갛다".to_string()),
                    answer: StringOrJSON::String("Màu vàng".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(53),
                    question: StringOrJSON::String("리무진 버스".to_string()),
                    answer: StringOrJSON::String("Xe buýt cao cấp".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(54),
                    question: StringOrJSON::String("교통수단".to_string()),
                    answer: StringOrJSON::String("Phương tiện giao thông".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(55),
                    question: StringOrJSON::String("세옴".to_string()),
                    answer: StringOrJSON::String("Xe ôm".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(56),
                    question: StringOrJSON::String("시클로".to_string()),
                    answer: StringOrJSON::String("Xích lô".to_string()),
                    explanation: None,
                    is_delete: false,
                },
            ],
            is_delete: false,
        },
        SetWithListTerm {
            id: None,
            name: "제14과: 교통".to_string(),
            description: None,
            terms: vec![
                Term {
                    id: None,
                    index: Some(0),
                    question: StringOrJSON::String("축구".to_string()),
                    answer: StringOrJSON::String("Bóng đá".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(1),
                    question: StringOrJSON::String("농구".to_string()),
                    answer: StringOrJSON::String("Bóng rổ".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(2),
                    question: StringOrJSON::String("배구".to_string()),
                    answer: StringOrJSON::String("Bóng chuyền".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(3),
                    question: StringOrJSON::String("야구".to_string()),
                    answer: StringOrJSON::String("Bóng chày".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(4),
                    question: StringOrJSON::String("족구".to_string()),
                    answer: StringOrJSON::String("Bóng chuyền bằng chân".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(5),
                    question: StringOrJSON::String("탁구".to_string()),
                    answer: StringOrJSON::String("Bóng bàn".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(6),
                    question: StringOrJSON::String("배드민턴".to_string()),
                    answer: StringOrJSON::String("Cầu lông".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(7),
                    question: StringOrJSON::String("테니스".to_string()),
                    answer: StringOrJSON::String("Tennis".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(8),
                    question: StringOrJSON::String("태권소".to_string()),
                    answer: StringOrJSON::String("Teawondo".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(9),
                    question: StringOrJSON::String("골프".to_string()),
                    answer: StringOrJSON::String("Golf".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(10),
                    question: StringOrJSON::String("스키".to_string()),
                    answer: StringOrJSON::String("Trượt tuyết".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(11),
                    question: StringOrJSON::String("요가".to_string()),
                    answer: StringOrJSON::String("Yoga".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(12),
                    question: StringOrJSON::String("마라툰".to_string()),
                    answer: StringOrJSON::String("Chạy marathon".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(13),
                    question: StringOrJSON::String("스케이트".to_string()),
                    answer: StringOrJSON::String("Trượt băng".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(14),
                    question: StringOrJSON::String("볼링".to_string()),
                    answer: StringOrJSON::String("Bowling".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(15),
                    question: StringOrJSON::String("조깅".to_string()),
                    answer: StringOrJSON::String("Chạy bộ".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(16),
                    question: StringOrJSON::String("수영".to_string()),
                    answer: StringOrJSON::String("Bơi lội".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(17),
                    question: StringOrJSON::String("잭 읽기, 독서".to_string()),
                    answer: StringOrJSON::String("Đọc sách".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(18),
                    question: StringOrJSON::String("그림 그리기".to_string()),
                    answer: StringOrJSON::String("Vẽ tranh".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(19),
                    question: StringOrJSON::String("음악 감상(하기)".to_string()),
                    answer: StringOrJSON::String("Nghe nhạc".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(20),
                    question: StringOrJSON::String("여행(하기)".to_string()),
                    answer: StringOrJSON::String("Đi du lịch".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(21),
                    question: StringOrJSON::String("운동(하기)".to_string()),
                    answer: StringOrJSON::String("Tập thể thao".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(22),
                    question: StringOrJSON::String("영화 보기".to_string()),
                    answer: StringOrJSON::String("Xem phim".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(23),
                    question: StringOrJSON::String("우표 수집, 우표 모으기".to_string()),
                    answer: StringOrJSON::String("Sưu tập tem".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(24),
                    question: StringOrJSON::String("컴표터 게임(하기)".to_string()),
                    answer: StringOrJSON::String("Chơi trò chơi điện tử".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(25),
                    question: StringOrJSON::String("항상, 언제나".to_string()),
                    answer: StringOrJSON::String("Luôn luôn".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(26),
                    question: StringOrJSON::String("자주".to_string()),
                    answer: StringOrJSON::String("Thường xuyên".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(27),
                    question: StringOrJSON::String("가끔".to_string()),
                    answer: StringOrJSON::String("Thỉnh thoảng".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(28),
                    question: StringOrJSON::String("거의안".to_string()),
                    answer: StringOrJSON::String("Hầu như không".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(29),
                    question: StringOrJSON::String("전혀".to_string()),
                    answer: StringOrJSON::String("Hoàn toàn".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(30),
                    question: StringOrJSON::String("잘하다".to_string()),
                    answer: StringOrJSON::String("Làm tốt".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(31),
                    question: StringOrJSON::String("못하다".to_string()),
                    answer: StringOrJSON::String("Không thể làm được".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(32),
                    question: StringOrJSON::String("보통이다".to_string()),
                    answer: StringOrJSON::String("Bình thường".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(33),
                    question: StringOrJSON::String("조금하다".to_string()),
                    answer: StringOrJSON::String("Làm được một chút".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(34),
                    question: StringOrJSON::String("가요".to_string()),
                    answer: StringOrJSON::String("Dân ca".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(35),
                    question: StringOrJSON::String("건정하다".to_string()),
                    answer: StringOrJSON::String("Lo lắng".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(36),
                    question: StringOrJSON::String("고등학교".to_string()),
                    answer: StringOrJSON::String("Trường trung học phổ thông".to_string()),
                    explanation: None,
                    is_delete: false,
                },
                Term {
                    id: None,
                    index: Some(37),
                    question: StringOrJSON::String("만화책".to_string()),
                    answer: StringOrJSON::String("Truyện tranh".to_string()),
                    explanation: None,
                    is_delete: false,
                },
            ],
            is_delete: false,
        },
        // SetWithListTerm {
        //     id: None,
        //     name: "제5과: 하루 일과 - 일상 표현 동사".to_string(),
        //     description: None,
        //     terms: vec![
        //         Term {
        //             id: None,
        //             index: Some(0),
        //             question: StringOrJSON::String("Question 2.1".to_string()),
        //             answer: StringOrJSON::String("Answer 2.1".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(1),
        //             question: StringOrJSON::String("Question 2.2".to_string()),
        //             answer: StringOrJSON::String("Answer 2.2".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(2),
        //             question: StringOrJSON::String("Question 2.3".to_string()),
        //             answer: StringOrJSON::String("Answer 2.3".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //     ],
        //     is_delete: false,
        // },
        // SetWithListTerm {
        //     id: None,
        //     name: "Nơi chốn".to_string(),
        //     description: None,
        //     terms: vec![
        //         Term {
        //             id: None,
        //             index: Some(0),
        //             question: StringOrJSON::String("경찰서".to_string()),
        //             answer: StringOrJSON::String("Sở cảnh sát".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(1),
        //             question: StringOrJSON::String("세탁소".to_string()),
        //             answer: StringOrJSON::String("Tiệm giặt ủi".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(2),
        //             question: StringOrJSON::String("Question 2.3".to_string()),
        //             answer: StringOrJSON::String("Answer 2.3".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //     ],
        //     is_delete: false,
        // },
        // SetWithListTerm {
        //     id: None,
        //     name: "Đồ gia dụng".to_string(),
        //     description: None,
        //     terms: vec![
        //         Term {
        //             id: None,
        //             index: Some(0),
        //             question: StringOrJSON::String("침대".to_string()),
        //             answer: StringOrJSON::String("Giường".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(1),
        //             question: StringOrJSON::String("책장".to_string()),
        //             answer: StringOrJSON::String("Tủ sách".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(2),
        //             question: StringOrJSON::String("옷장".to_string()),
        //             answer: StringOrJSON::String("Tủ quần áo".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(3),
        //             question: StringOrJSON::String("소파".to_string()),
        //             answer: StringOrJSON::String("Ghế sofa".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(4),
        //             question: StringOrJSON::String("탁자".to_string()),
        //             answer: StringOrJSON::String("Bàn".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(5),
        //             question: StringOrJSON::String("식탁".to_string()),
        //             answer: StringOrJSON::String("Bàn ăn".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(6),
        //             question: StringOrJSON::String("화장대".to_string()),
        //             answer: StringOrJSON::String("Bàn trang điểm".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(7),
        //             question: StringOrJSON::String("다정자".to_string()),
        //             answer: StringOrJSON::String("Bàn trà".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //     ],
        //     is_delete: false,
        // },
        // SetWithListTerm {
        //     id: None,
        //     name: "제2과: 학교 - 장소".to_string(),
        //     description: None,
        //     terms: vec![
        //         Term {
        //             id: None,
        //             index: Some(0),
        //             question: StringOrJSON::String("출근하다".to_string()),
        //             answer: StringOrJSON::String("Đi làm".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(1),
        //             question: StringOrJSON::String("튀근히다".to_string()),
        //             answer: StringOrJSON::String("Tan tầm".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(2),
        //             question: StringOrJSON::String("시작히다".to_string()),
        //             answer: StringOrJSON::String("Bắt đầu".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(3),
        //             question: StringOrJSON::String("끝하다".to_string()),
        //             answer: StringOrJSON::String("Xong, kết thúc".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(4),
        //             question: StringOrJSON::String("청소하다".to_string()),
        //             answer: StringOrJSON::String("Dọn vệ sinh".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(5),
        //             question: StringOrJSON::String("세탁하다 / 빨래하다".to_string()),
        //             answer: StringOrJSON::String("Giặt giũ".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(6),
        //             question: StringOrJSON::String("샤워하다".to_string()),
        //             answer: StringOrJSON::String("Tắm".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(7),
        //             question: StringOrJSON::String("크다".to_string()),
        //             answer: StringOrJSON::String("To lớn".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(8),
        //             question: StringOrJSON::String("작다".to_string()),
        //             answer: StringOrJSON::String("Nhỏ".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(9),
        //             question: StringOrJSON::String("많다".to_string()),
        //             answer: StringOrJSON::String("Nhiều".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(10),
        //             question: StringOrJSON::String("척다".to_string()),
        //             answer: StringOrJSON::String("Ít".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //     ],
        //     is_delete: false,
        // },
        // SetWithListTerm {
        //     id: None,
        //     name: "제4과: 날짜와요일 - 한자어 수사".to_string(),
        //     description: None,
        //     terms: vec![
        //         Term {
        //             id: None,
        //             index: Some(0),
        //             question: StringOrJSON::String("Question 4.1".to_string()),
        //             answer: StringOrJSON::String("Answer 4.1".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(1),
        //             question: StringOrJSON::String("Question 4.2".to_string()),
        //             answer: StringOrJSON::String("Answer 4.2".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //     ],
        //     is_delete: false,
        // },
        // SetWithListTerm {
        //     id: None,
        //     name: "제3과: 일상생활".to_string(),
        //     description: None,
        //     terms: vec![Term {
        //         id: None,
        //         index: Some(0),
        //         question: StringOrJSON::String("Question 5.1".to_string()),
        //         answer: StringOrJSON::String("Answer 5.1".to_string()),
        //         explanation: None,
        //         is_delete: false,
        //     }],
        //     is_delete: false,
        // },
        // SetWithListTerm {
        //     id: None,
        //     name: "Nhà cửa và đồ gia dụng".to_string(),
        //     description: None,
        //     terms: vec![
        //         Term {
        //             id: None,
        //             index: Some(0),
        //             question: StringOrJSON::String("주택".to_string()),
        //             answer: StringOrJSON::String("Nhà riêng".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(1),
        //             question: StringOrJSON::String("아파트".to_string()),
        //             answer: StringOrJSON::String("Nhà chung cư".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(2),
        //             question: StringOrJSON::String("연립주택".to_string()),
        //             answer: StringOrJSON::String("Nhà tập thể".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(3),
        //             question: StringOrJSON::String("공부방".to_string()),
        //             answer: StringOrJSON::String("Phòng học".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(4),
        //             question: StringOrJSON::String("거실".to_string()),
        //             answer: StringOrJSON::String("Phòng khách".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(5),
        //             question: StringOrJSON::String("안방".to_string()),
        //             answer: StringOrJSON::String("Phòng ngủ chính".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(6),
        //             question: StringOrJSON::String("침실".to_string()),
        //             answer: StringOrJSON::String("Phòng ngủ".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(7),
        //             question: StringOrJSON::String("부엌".to_string()),
        //             answer: StringOrJSON::String("Bếp".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(8),
        //             question: StringOrJSON::String("화장실".to_string()),
        //             answer: StringOrJSON::String("Nhà vệ sinh".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(9),
        //             question: StringOrJSON::String("세탁실".to_string()),
        //             answer: StringOrJSON::String("Phòng giặt đồ".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(10),
        //             question: StringOrJSON::String("베란다".to_string()),
        //             answer: StringOrJSON::String("Ban công".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(11),
        //             question: StringOrJSON::String("현관".to_string()),
        //             answer: StringOrJSON::String("Lối vào".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //     ],
        //     is_delete: false,
        // },
        // SetWithListTerm {
        //     id: None,
        //     name: "Vị trí".to_string(),
        //     description: None,
        //     terms: vec![
        //         Term {
        //             id: None,
        //             index: Some(0),
        //             question: StringOrJSON::String("위".to_string()),
        //             answer: StringOrJSON::String("Trên".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(1),
        //             question: StringOrJSON::String("아래".to_string()),
        //             answer: StringOrJSON::String("Dưới".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(2),
        //             question: StringOrJSON::String("안".to_string()),
        //             answer: StringOrJSON::String("Trong".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(3),
        //             question: StringOrJSON::String("밖".to_string()),
        //             answer: StringOrJSON::String("Ngoài".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(4),
        //             question: StringOrJSON::String("옆".to_string()),
        //             answer: StringOrJSON::String("Bên cạnh".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(5),
        //             question: StringOrJSON::String("사이".to_string()),
        //             answer: StringOrJSON::String("Giữa".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(6),
        //             question: StringOrJSON::String("앞".to_string()),
        //             answer: StringOrJSON::String("Trước".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(7),
        //             question: StringOrJSON::String("뒤".to_string()),
        //             answer: StringOrJSON::String("Sau".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(8),
        //             question: StringOrJSON::String("왼쪽".to_string()),
        //             answer: StringOrJSON::String("Bên trái".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(9),
        //             question: StringOrJSON::String("오른쪽".to_string()),
        //             answer: StringOrJSON::String("Bên phải".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(10),
        //             question: StringOrJSON::String("양쪽".to_string()),
        //             answer: StringOrJSON::String("Hai phía".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(11),
        //             question: StringOrJSON::String("건너편".to_string()),
        //             answer: StringOrJSON::String("Đối diện".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(12),
        //             question: StringOrJSON::String("맞은편".to_string()),
        //             answer: StringOrJSON::String("Đối diện".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(13),
        //             question: StringOrJSON::String("똑바로".to_string()),
        //             answer: StringOrJSON::String("Thẳng".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //         Term {
        //             id: None,
        //             index: Some(14),
        //             question: StringOrJSON::String("쭉".to_string()),
        //             answer: StringOrJSON::String("Thẳng".to_string()),
        //             explanation: None,
        //             is_delete: false,
        //         },
        //     ],
        //     is_delete: false,
        // },
    ];

    let mut set_ids: Vec<Thing> = vec![];

    for set in sets.iter() {
        let mut response = db
            .query("CREATE set CONTENT $set RETURN id")
            .bind((
                "set",
                Set {
                    id: None,
                    name: set.name.clone(),
                    description: set.description.clone(),
                    is_delete: false,
                },
            ))
            .await?;
        let result: Option<Record> = response.take(0)?;
        let set_id = result.unwrap().id;

        for term in set.terms.iter() {
            let mut response = db
                .query("CREATE term CONTENT $term RETURN id")
                .bind(("term", term))
                .await?;
            let result: Option<Record> = response.take(0)?;
            let term_id = result.unwrap().id;

            db.query("RELATE $set->have_term->$term")
                .bind(("set", &set_id))
                .bind(("term", &term_id))
                .await?;

            // db.query("RELATE $user->learn->$term SET remained = 5")
            //     .bind(("user", &user_id))
            //     .bind(("term", &term_id))
            //     .await?;
        }

        set_ids.push(set_id.clone());
    }

    Ok(())
}
