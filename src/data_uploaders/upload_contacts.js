const fs = require("node:fs");
const init_safety_fetch = require("../../core/safety_fetch.js");

const CONTACT_ERRORS = require("../../shared/errors/contact_errors.js");
const mixin_general_errors = require("../../shared/error_handlers/general_errors_handler.js");

const URLS = require("../../shared/urls.js");


const [err_templates, err_resolves] = mixin_general_errors(
    [
        (response) => ({
            status: response.CODE === CONTACT_ERRORS.ALREADY_EXIST,
            error: "ALREADY_EXIST",
        }),
    ],
    {
        ALREADY_EXIST: (err, request) => {
            const regex = /\(([\s\S]+?)\)/
            const exist_contact_id = (err.context.MESSAGE).match(regex)[1];
            console.log(`Номер для контакта ${exist_contact_id} уже существует!`);
            return {
                "RESPONSE": exist_contact_id
            };
        }
    }
);

const safety_fetch = init_safety_fetch(err_templates, err_resolves);


const FILE_NAME_CONTACTS = "./data/complete_data/contacts.json";
const OUTPUT_FILE_NAME = "./data/complete_data/contact_pair_ids.json";

const URL = URLS.CREATE_CONTACT;

const ids_pairs = [];

const contacts_base = JSON.parse( fs.readFileSync(FILE_NAME_CONTACTS, { encoding: "utf-8" }) );

const upload_contact = (contact) => {
    const copy_contact = JSON.parse(JSON.stringify(contact));
    const old_id = copy_contact.OLD_ID;
    delete copy_contact.OLD_ID;

    return safety_fetch(URL, body(copy_contact));
}

async function main() {
    for await (const contact of contacts_base){
        const response = await upload_contact(contact);

        ids_pairs.push({
            "old_id": contact.OLD_ID,
            "current_id": response["RESPONSE"]
        });
    }

    fs.writeFileSync(OUTPUT_FILE_NAME, JSON.stringify(ids_pairs));
}

main();



function body(contact){
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            SID: process.env.SID,
            ...contact
        })
    }
}
