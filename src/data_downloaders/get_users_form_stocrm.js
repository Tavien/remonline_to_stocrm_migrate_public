const fs = require('node:fs');
const init_safety_fetch = require("../../core/safety_fetch.js");

const mixin_general_errors = require("../../shared/error_handlers/general_errors_handler.js");

const URLS = require("../../shared/urls.js");

const [err_templates, err_resolves] = mixin_general_errors([], {});

const safety_fetch = init_safety_fetch(err_templates, err_resolves);

const URL = URLS.GET_CONTACTS;
const FILE_NAME_CONTACTS = "./complete_data/contacts.json";

const contacts_base = JSON.parse(
    fs.readFileSync(FILE_NAME_CONTACTS, { encoding: "utf-8" })
);


async function main() {
    let data = [];

    for (let i = 1; i < 5; i++){
        let response = await safety_fetch(URL + "&PAGE=" + i + "&LIMIT=5000", get_body());
        data = data.concat((await response.json())["RESPONSE"]["DATA"].map((elem) => elem["MAIN_PHONE"]));
    }

    let i = 0;

    for (let contact of contacts_base) {
        let contact_phone = contact["PROPERTIES"]["1"][0]?.VALUE;

        if (data.find((phone) => (phone === contact_phone))) {
            i++;
        }
    }

    console.log(i);

}

main();

function get_body() {
    return {
        method: 'GET',
    }
}
