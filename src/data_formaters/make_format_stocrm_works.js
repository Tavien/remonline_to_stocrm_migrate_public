const fs = require("node:fs");

const FILE_NAME_WORKS = "./data/source/works.json";
const FILE_NAME_WORKS_OUTPUT = "./data/complete_data/works.json";
const FILE_NAME_FULL_GOOD_LIST = "./data/full_good_list.json";

const works_base = JSON.parse(fs.readFileSync(FILE_NAME_WORKS, { encoding: "utf-8" }));
const good_list_base = JSON.parse(fs.readFileSync(FILE_NAME_FULL_GOOD_LIST, { encoding: "utf-8" }));

function main() {
    for (work of works_base) {
        const good_list = work?.parts;
        const operation_list = work?.operations;

        let formated_work = {};
        let formated_good_list = [];
        let formated_operation_list = [];

        if (good_list.lenght) {
            formated_good_list = format_goods(good_list);
        }

        if (operation_list.lenght) {
            formated_operation_list = format_operations(operation_list);
        }

        formated_work = format_work(work, formated_good_list, formated_operation_list);
    }
}

main();

function format_work(work, formated_good_list, formated_operation_list) {
    const formated_work = {};



    return formated_work;
}


function format_goods(good_list) {
    const formated_good_list = [];

    for (let good of good_list) {
        const currant_good = get_currant_format_goods(good);

        if (currant_good) {
            formated_good_list.push({
                "TITLE": currant_good.title,
                "BRAND": currant_good.brand,
                "SKU": currant_good.sku,
            })
        } else continue;
    }

    return formated_good_list;
}

function format_operations(operation_list) {
    const formated_operation_list = [];

    for (let opetation of operation_list) {
        const discount = opetation.DISCOUNT;
        const price = get_operation_price(opetation);

        formated_operation_list.push({
            "TYPE": "FREE_FORM",
            "DISCOUNT": discount,
            "WORKING_HOUR": 1,
            "PRICE_OF_HOUR": price,
            "DESCRIPTION": "ВНИМАНИЕ: Данные перенесены из remonline автоматически. Возможны неточности. Сверка ОБЯЗАТЕЛЬНА! " + JSON.stringify(opetation),
        })
    }

    return formated_operation_list;
}

function get_currant_format_goods(currant_format_goods){
    const good = good_list_base.find((good_base) => (
        good_base.id === currant_format_goods.id
    ))

    return good ? {
        "title": good.title,
        "brand": good.brand,
        "sku" : good.sku,
    } : undefined;
}

function get_operation_price(opetation){
    const price = opetation?.price * opetation?.amount;

    return price ? price : 1;
}


// {
//     "PHONE": 79999999999,
//     "CUSTOMER_ID": 2, // опциональный параметр, ID подразделения
//     "CONTACT_ID": 2222, // опциональный параметр, ID клиента
//     "TITLE": "Иванов Иван Иванович", // опциональный параметр, ФИО контакта или иное обозначение
//     "EMAIL": "a@a.com", // опциональный параметр, электронная почта контакта
//     "SOURCE_ID": 4, // опциональный параметр, источник контакта
//     "BOARD_ID": 2, // опциональный параметр, воронка продаж
//     "COMMENT": "с комментарием", // опциональный параметр
//     "WORKS": [
//         {
//             "TYPE": "FREE_FORM", // Тип работы, NORMAL, FREE_FORM, RECOMMENDATION, FF_RECOMMENDATION - Обычная, вольная, рекомендация, вольная рекомендация
//             "DISCOUNT": 50, //скидка
//             "WORKING_HOUR": 1, //Нормо-час
//             "PRICE_OF_HOUR": 2222, // Цена нормо часа
//             "DESCRIPTION": "test" // Описание работы
//         },
//         {
//             "TYPE": "FREE_FORM",
//             "DISCOUNT": 50,
//             "WORKING_HOUR": 1,
//             "PRICE_OF_HOUR": 2222,
//             "DESCRIPTION": "test2"
//         }
//     ],
//     "REQUIRES": [
//         {
//             "TITLE": "Гвоздодёр",
//             "BRAND": "GVO",
//             "SKU": "ZD22"
//         },
//         {
//             "TITLE": "Гвоздодёр 2",
//             "BRAND": "GVO2",
//             "SKU": "ZD22"
//         }
//     ]
// }

// {
//     "id": 21058361,
//     "modified_at": 1587471274000,
//     "uuid": "60647bfe-b4a4-4278-99ac-49544f43652b",
//     "status": {
//         "id": 381302,
//         "name": "Закрыт",
//         "color": "#939699",
//         "group": 6
//     },
//     "created_at": 1586767556000,
//     "done_at": 1587369990000,
//     "duration": 0,
//     "kindof_good": "",
//     "serial": "",
//     "packagelist": "",
//     "appearance": "",
//     "malfunction": "1. Замена жгута проводов масляного насоса (демонтаж поддона) 2.  Демонтировать передние стойки и отдать клиенту (он их прокачает и вернет)\n3. Замена масла в ДВС (оригинал 5в40) + фильтра\n4. Ремонт выхлопа (создание хорошего звука)\n5.  Инспекция (на наличие воды) рулевой рейки (смазка)\n6. Течь бензина из шланга подачи",
//     "manager_notes": "",
//     "engineer_notes": "",
//     "resume": "",
//     "payed": 36615,
//     "missed_payments": 0,
//     "warranty_measures": 0,
//     "urgent": false,
//     "discount_sum": 0,
//     "resources": [],
//     "custom_fields": {
//         "f841822": "",
//         "f841823": "2016",
//         "f1710924": "",
//         "f1710926": "E200",
//         "f1710927": "Mercedes-benz",
//         "f1710928": "",
//         "f1710934": "",
//         "f1710937": ""
//     },
//     "estimated_cost": "0",
//     "closed_at": 1587386809000,
//     "estimated_done_at": 1587372120000,
//     "id_label": "1",
//     "price": 36615,
//     "branch_id": 64290,
//     "overdue": false,
//     "status_overdue": false,
//     "parts": [
//         {
//             "id": 24570610,
//             "engineer_id": 112802,
//             "title": "Жгут проводов",
//             "amount": 1,
//             "price": 2605,
//             "cost": 1204,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24648006,
//             "engineer_id": 112802,
//             "title": "Фильтр салонный LAK11/61",
//             "amount": 1,
//             "price": 1930,
//             "cost": 1426,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24648007,
//             "engineer_id": 112802,
//             "title": "Фильтр воздушный LX3811",
//             "amount": 1,
//             "price": 1510,
//             "cost": 1119,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24648008,
//             "engineer_id": 112802,
//             "title": "Клапан масляного насоса",
//             "amount": 1,
//             "price": 2810,
//             "cost": 2081,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24650545,
//             "engineer_id": 112802,
//             "title": "Mercedes 5W40 MB 229.5",
//             "amount": 8,
//             "price": 720,
//             "cost": 590,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24664245,
//             "engineer_id": 112803,
//             "title": "Расходные материалы",
//             "amount": 10,
//             "price": 100,
//             "cost": 10,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         }
//     ],
//     "operations": [
//         {
//             "id": 24570469,
//             "engineer_id": 113203,
//             "title": "Демонтаж-монтаж передних стоек",
//             "amount": 2,
//             "price": 1000,
//             "cost": 0,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24651457,
//             "engineer_id": 113203,
//             "title": "Замена клапана регулятора",
//             "amount": 1,
//             "price": 4500,
//             "cost": 0,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24651458,
//             "engineer_id": 113203,
//             "title": "Ремонт глушителя",
//             "amount": 1,
//             "price": 6500,
//             "cost": 0,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24651459,
//             "engineer_id": 113203,
//             "title": "Демонтаж-монтаж рулевой рейки",
//             "amount": 1,
//             "price": 2000,
//             "cost": 0,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24651460,
//             "engineer_id": 113201,
//             "title": "Развал-схождение",
//             "amount": 1,
//             "price": 1200,
//             "cost": 0,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24651507,
//             "engineer_id": 113203,
//             "title": "Замена масла в ДВС",
//             "amount": 1,
//             "price": 500,
//             "cost": 0,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24651508,
//             "engineer_id": 113203,
//             "title": "Переборка рулевой рейки",
//             "amount": 1,
//             "price": 2000,
//             "cost": 0,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24651516,
//             "engineer_id": 113205,
//             "title": "Мойка двигателя",
//             "amount": 1,
//             "price": 500,
//             "cost": 0,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         },
//         {
//             "id": 24664266,
//             "engineer_id": 113206,
//             "title": "Работа автоэлектрика",
//             "amount": 1,
//             "price": 1800,
//             "cost": 0,
//             "discount_value": 0,
//             "taxes": [],
//             "warranty": 0,
//             "warranty_period": 0
//         }
//     ],
//     "attachments": [],
//     "order_type": {
//         "id": 104714,
//         "name": "Платный ремонт"
//     },
//     "client": {
//         "id": 14388838,
//         "name": "",
//         "email": "",
//         "phone": [
//             ""
//         ],
//         "notes": "",
//         "address": "",
//         "supplier": false,
//         "juridical": false,
//         "conflicted": false,
//         "modified_at": 1586767184000,
//         "created_at": 1586767184000,
//         "discount_code": "",
//         "discount_goods": 0,
//         "discount_services": 0,
//         "discount_materials": 0,
//         "custom_fields": {},
//         "ad_campaign": {}
//     },
//     "manager_id": 113048,
//     "created_by_id": 112802,
//     "closed_by_id": 112802,
//     "ad_campaign": {},
//     "asset": {},
//     "brand": "Mercedes-benz",
//     "model": "E200"
// },