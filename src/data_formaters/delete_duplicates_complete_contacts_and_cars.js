const fs = require("node:fs");

const FILE_NAME_CONTACTS = "./data/complete_data/contacts.json";
const FILE_NAME_CARS = "./data/complete_data/cars.json";

const CONTACTS_ID_NAME = "OLD_ID";
const CARS_ID_NAME = "OLD_CONTACT_ID";

function delete_duplicates(FILENAME, ID_NAME) {

    const data_base = JSON.parse(fs.readFileSync(FILENAME, { encoding: "utf-8" }));

    let uniq_ids = new Set();

    for (let elem of data_base) {
        uniq_ids.add(elem[ID_NAME]);
    }

    let uniq_data = [];

    for (let id of uniq_ids) {
        uniq_data.push(data_base.find((elem) => (elem[ID_NAME] === id)));
    }


    fs.writeFileSync(FILENAME, JSON.stringify(uniq_data));
}

delete_duplicates(FILE_NAME_CONTACTS, CONTACTS_ID_NAME);
delete_duplicates(FILE_NAME_CARS, CARS_ID_NAME);
