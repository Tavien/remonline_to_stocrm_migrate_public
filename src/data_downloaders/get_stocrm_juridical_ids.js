const fs = require('node:fs');
const init_safety_fetch = require("../../core/safety_fetch.js");
const mixin_general_errors = require("../general_errors_handler.js");

const URLS = require("../../shared/urls.js");
const URL = URLS.GET_LEGAL_ENTITIES;

const OUTPUT_FILE_NAME_JURIDICAL_PAIR_IDS = "./data/complete_data/juridical_currant_ids.json";

const [err_templates, err_resolves] = mixin_general_errors([],{});

const safety_fetch = init_safety_fetch(err_templates, err_resolves);

async function main () {
    const response = await safety_fetch(URL, body());

    const pagination = Math.ceil(response["RESPONSE"]["TOTAL_COUNT"] / response["RESPONSE"]["DATA"].length) + 1;

    let juridical_list = [];

    for (let i = 1; i < pagination; i++) {
        const response = await safety_fetch(URL, body(i));
        juridical_list = juridical_list.concat(response["RESPONSE"]["DATA"]);
    }

    const juridical_currant_ids = [];

    for (let juridical of juridical_list) {
        juridical_currant_ids.push({
            CURRANT_ID: juridical["LEGAL_ENTITY_ID"],
            NAME: juridical?.["NAME"],
        });
    }

    fs.writeFileSync(OUTPUT_FILE_NAME_JURIDICAL_PAIR_IDS, JSON.stringify(juridical_currant_ids), { encoding: "utf-8" });
}

main();

function body(page = 0){
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            SID: process.env.SID,
            PAGE: page,
        })
    }
}



