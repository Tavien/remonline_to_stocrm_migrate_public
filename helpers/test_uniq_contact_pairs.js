const fs = require('node:fs');

const CONSTACS_LIST = "../data/complete_data/contact_pair_ids.json";

const ids_pairs_base = JSON.parse(fs.readFileSync(CONSTACS_LIST));

const uniq_ids = new Set;
const empty_currant_id = [];
const duplicate_ids = {};

for (let ids_pair of ids_pairs_base) {
    const current_id = ids_pair["current_id"];
    if (current_id) uniq_ids.add(current_id) 
    else empty_currant_id.push(ids_pair); 
    duplicate_ids[current_id] = 0;
}

for (let ids of uniq_ids) {
    for (let ids_pair of ids_pairs_base) {
        const current_id = ids_pair["current_id"];;

        if (ids === current_id) {
            duplicate_ids[ids] += 1;
        }
    }
}

console.log(`Всего элементов ${ids_pairs_base.length} уникальных номеров ${uniq_ids.size}`);

const counter = [];

for (let id in duplicate_ids) {
    if(duplicate_ids[id] > 1)
        counter.push(`${id} - ${duplicate_ids[id]}`);
}

console.log("Повторяющихся", counter.length);
console.log("Повторяющихся", counter);

console.log("Количество пустых ", empty_currant_id.length);
