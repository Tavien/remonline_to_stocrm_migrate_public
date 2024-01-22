const fs = require('node:fs');

const FILE_NAME_CARS = "../data/complete_data/cars.json";

const cars_base = JSON.parse(fs.readFileSync(FILE_NAME_CARS));

const uniq_ids = new Set;
const count_ids = {};

for (let car of cars_base) {
    const id = car["OLD_CONTACT_ID"];
    if (id) uniq_ids.add(id);
    count_ids[id] = 0;
}

for (let id of uniq_ids) {
    for (let car of cars_base) {
        const flag = car["OLD_CONTACT_ID"];

        if (id === flag) {
            count_ids[id] += 1;
        }
    }
}

console.log(`Всего элементов ${cars_base.length} уникальных номеров ${uniq_ids.size}`);

const counter = [];

for (let id in count_ids) {
    if(count_ids[id] > 1)
        counter.push(`${id} - ${count_ids[id]}`);
}

console.log("Повторяющихся", counter.length);
console.log("Повторяющихся", counter);
