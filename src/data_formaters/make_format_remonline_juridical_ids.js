const fs = require("node:fs");

const FILE_NAME_JURIDICAL = "./data/intermediate_data/contacts/juridical.json";
const OUTPUT_FILE_NAME_JURIDICAL_OLD_IDS = "./data/complete_data/juridical_old_ids.json";

const juridical_base = JSON.parse(fs.readFileSync(FILE_NAME_JURIDICAL, { encoding: "utf-8" }));

const juridical_id_list = [];

for (let juridical of juridical_base){
    juridical_id_list.push({
        OLD_ID: juridical["id"],
        NAME: juridical["name"],
    })
}

fs.writeFileSync(OUTPUT_FILE_NAME_JURIDICAL_OLD_IDS, JSON.stringify(juridical_id_list), { encoding: "utf-8" });