const fs = require("node:fs");

const FILE_NAME = "./data/clients_copy.json";

const OUTPUT_FILE_JURIDICAL = "./intermediate_data/contacts/juridical.json";
const OUTPUT_FILE_PHYSICAL = "./intermediate_data/contacts/physical.json";

const isJuridical = (client) => client.juridical;

const contacts_base = JSON.parse(
    fs.readFileSync(FILE_NAME, { encoding: "utf-8" })
);

let juridicals_contacts = [];
let physical_contacts = [];

for (contact of contacts_base){
    if (isJuridical(contact)) juridicals_contacts.push(contact);
    else physical_contacts.push(contact);
}

fs.writeFileSync(OUTPUT_FILE_JURIDICAL, JSON.stringify(juridicals_contacts));
fs.writeFileSync(OUTPUT_FILE_PHYSICAL, JSON.stringify(physical_contacts));