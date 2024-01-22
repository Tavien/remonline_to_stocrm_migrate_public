const fs = require("node:fs");

const FILE_NAME_WAREHOUSE_PAIR_IDS = "./data/complete_data/warehouses_pair_ids.json";
const PARTIAL_OUTPUT_FILE_NAME_WAREHOUSE_GOODS = "./data/complete_data/warehouses_goods_";

function main(){
    const warehouses_pair_ids_base = JSON.parse(fs.readFileSync(FILE_NAME_WAREHOUSE_PAIR_IDS, { encoding: "utf-8" }));
    
    for (let warehouse of warehouses_pair_ids_base) {
        const warehouse_current_id = warehouse.CURRENT_ID;

        const warehouse_goods_base = get_goods_from_warehouse(warehouse_current_id);

        const warehouse_goods_w_id = goods_list_add_id(warehouse_goods_base)

        save_warehouse_to_file(warehouse_current_id, warehouse_goods_w_id);
    }
}

main();

function goods_list_add_id(warehouse_goods_base) {
    const warehouse_goods_w_id = [];
    let i = 0;

    for (let good of warehouse_goods_base) {
        good["id"] = i;
        i++;

        warehouse_goods_w_id.push(good);
    }

    return warehouse_goods_w_id;
}

function get_goods_from_warehouse(id){
    return JSON.parse(fs.readFileSync(PARTIAL_OUTPUT_FILE_NAME_WAREHOUSE_GOODS + id + ".json", { encoding: "utf-8" }));
}

function save_warehouse_to_file(id, good_list){
    fs.writeFileSync(PARTIAL_OUTPUT_FILE_NAME_WAREHOUSE_GOODS + id + ".json", JSON.stringify(good_list), { encoding: "utf-8" });
}