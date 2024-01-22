const fs = require("node:fs");

const FILE_NAME_JURIDICAL_OLD_IDS = "./data/complete_data/juridical_old_ids.json";
const FILE_NAME_JURIDICAL_CURRANT_IDS = "./data/complete_data/juridical_currant_ids.json";
 
const OUTPUT_FILE_NAME_JURIDICAL_PAIR_IDS = "./data/complete_data/juridical_pair_ids.json";

const old_juridical_list = JSON.parse(fs.readFileSync(FILE_NAME_JURIDICAL_OLD_IDS), { encoding: "utf-8" });
const currant_juridical_list = JSON.parse(fs.readFileSync(FILE_NAME_JURIDICAL_CURRANT_IDS), { encoding: "utf-8" });

const juridical_pair_ids = [];
let i = 0;

for (let old_juridical of old_juridical_list){
    const juridical_full_name = old_juridical["NAME"];
    const old_id = old_juridical["OLD_ID"];
    let flag = false;
    

    for (let currant_juridical of currant_juridical_list){
        const juridical_name = currant_juridical["NAME"];
        const currant_id = currant_juridical["CURRANT_ID"];

        if (juridical_full_name.includes(juridical_name)) {
            juridical_pair_ids.push({
                "CURRANT_ID": currant_id,
                "OLD_ID": old_id,
            });
            flag = true;
            break;
        }
    }

    if (!flag) console.log(JSON.stringify({
        "NAME": juridical_full_name,
        "OLD_ID": old_id,
    }));
}



fs.writeFileSync(OUTPUT_FILE_NAME_JURIDICAL_PAIR_IDS, JSON.stringify(juridical_pair_ids), { encoding: "utf-8" })