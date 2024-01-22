const fs = require("node:fs");
const init_safety_fetch = require("../../core/safety_fetch.js");

const POSTING_ERRORS = require("../../shared/errors/posting_errors.js");
const WAREHOUSE_GOODS_ERRORS = require("../../shared/errors/warehouse_goods_errors.js");
const mixin_general_errors = require("../../shared/error_handlers/general_errors_handler.js");

const URLS = require("../../shared/urls.js");

const [err_templates, err_resolves] = mixin_general_errors(
    [
        (response) => ({
            status: response.CODE === POSTING_ERRORS.WAREHOUSE_NOT_FOUND,
            error: "WAREHOUSE_NOT_FOUND",
        }),
        (response) => ({
            status: response.CODE === POSTING_ERRORS.CUSTOMER_REQUISITE_NOT_FOUND,
            error: "CUSTOMER_REQUISITE_NOT_FOUND",
        }),
    ],
    {
        WAREHOUSE_NOT_FOUND: (err, request) => {
            console.log(err.message, "\n", request);
            throw err;
        },
        CUSTOMER_REQUISITE_NOT_FOUND: (err, request) => {
            console.log(err.message, "\n", request);
            throw err;
        },
    }
);

const safety_fetch = init_safety_fetch(err_templates, err_resolves);

const FILE_NAME_WAREHOUSE_PAIR_IDS = "./data/complete_data/warehouses_pair_ids.json";
const PARTIAL_FILE_NAME_WAREHOUSE_GOODS = "./data/complete_data/warehouses_goods_";

const FILE_NAME_UPLOADED_POSTINGS = "./data/uploaded_data/uploaded_postings.json";
const PARTIAL_FILE_NAME_UPLOADED_GOODS = "./data/uploaded_data/uploaded_warehouses_goods_";

const CREATE_POSTIND_URL = URLS.CREATE_POSTING;
const ADD_WARHOUSE_GOODS = URLS.ADD_WARHOUSE_GOODS;

const warehouses_pair_ids_base = JSON.parse(fs.readFileSync(FILE_NAME_WAREHOUSE_PAIR_IDS, { encoding: "utf-8" }));

const uploaded_postings = JSON.parse(fs.readFileSync(FILE_NAME_UPLOADED_POSTINGS, { encoding: "utf-8" }));
let uploaded_goods = [];

async function main() {
    for (let warehouse of warehouses_pair_ids_base) {
        const warehouse_current_id = warehouse.CURRENT_ID;

        const warehouse_goods_base = get_goods_from_warehouse(warehouse_current_id);
        uploaded_goods = get_uploaded_goods(warehouse_current_id);

        const posting_id = await create_posting(warehouse_current_id);
        await posting_add_goods(posting_id, warehouse_goods_base, warehouse_current_id, uploaded_goods);
        console.log("Склад " + warehouse_current_id);
    }
}

main();

async function create_posting(warehouse_id) {
    const posting_id = get_exist_posting_id(warehouse_id);

    try {
        let response;

        if (posting_id === undefined) {
            response = await safety_fetch(CREATE_POSTIND_URL, create_posting_body(warehouse_id));
        } else {
            throw Error ("EXIST");
        }
    
        uploaded_postings.push({
            WAREHOUSE_ID: warehouse_id,
            POSTING_ID: response.RESPONSE,
        });

        fs.writeFileSync(FILE_NAME_UPLOADED_POSTINGS, JSON.stringify(uploaded_postings));

        return response.RESPONSE;
    } catch (err) {
        if (err.message === "EXIST") console.log("Поступление уже содержится в списке");
        return posting_id.POSTING_ID;
    }
}

const upload_good = (posting_id, good) => {
    const copy_good = JSON.parse(JSON.stringify(good));
    const good_id = copy_good.ID;
    delete copy_good.ID;

    if (check_good_exist(good_id)) return safety_fetch(ADD_WARHOUSE_GOODS, add_goods_body(posting_id, copy_good))
    else return Promise.reject("EXIST");
}

async function posting_add_goods(posting_id, warehouse_goods_base, warehouse_current_id, uploaded_goods) {
    for await (const good of warehouse_goods_base){
        try {
            const response = await upload_good(posting_id, good);
            console.log(response);
            uploaded_goods.push(good.id);

            fs.writeFileSync(PARTIAL_FILE_NAME_UPLOADED_GOODS + warehouse_current_id + ".json", JSON.stringify(uploaded_goods));
        } catch (err) {
            if (err === "EXIST") console.log("Товар уже содержится в списке");
            else return Promise.reject();
        }
    }
}

function check_good_exist(good_id) {
    return !uploaded_goods.includes(good_id);
}


function create_posting_body(warehouse_id) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            SID: process.env.SID,
            CUSTOMER_ID: process.env.CUSTOMER_ID,
            LEGAL_ENTITY_ID: process.env.LEGAL_ENTITY_ID,
            RESPONSIBLE_ID: process.env.RESPONSIBLE_ID,
            POSTING_TYPE_ID: process.env.POSTING_TYPE_ID,
            DOCUMENT_DATE: process.env.DOCUMENT_DATE,
            CUSTOMER_REQUISITE_ID: process.env.CUSTOMER_REQUISITE_ID,
            WAREHOUSE_ID: warehouse_id,
            DESCRIPTION: "ВНИМАНИЕ: Данные перенесены из remonline автоматически. Возможны неточности. Сверка ОБЯЗАТЕЛЬНА!",
        })
    }
}

function add_goods_body(posting_id, good){
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            SID: process.env.SID,
            POSTING_TASK_ID: posting_id,
            ITEMS: [{...good}],
        })
    }
}


function get_exist_posting_id(warehouse_id) {
    return uploaded_postings.find((posting) => (
        posting.WAREHOUSE_ID === warehouse_id
    ));
}

function get_goods_from_warehouse(id){
    return JSON.parse(fs.readFileSync(PARTIAL_FILE_NAME_WAREHOUSE_GOODS + id + ".json", { encoding: "utf-8" }));
}

function get_uploaded_goods(id){
    return JSON.parse(fs.readFileSync(PARTIAL_FILE_NAME_UPLOADED_GOODS + id + '.json', { encoding: "utf-8" }));
}