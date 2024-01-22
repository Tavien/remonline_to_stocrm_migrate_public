const fs = require("node:fs");
const { createHash } = require("node:crypto");

const FILE_NAME_WAREHOUSE_PAIR_IDS = "./data/complete_data/warehouses_pair_ids.json";
const PARTIAL_FILE_NAME_WAREHOUSE_GOODS = "./data/source/warehouses_goods_";
const PARTIAL_OUTPUT_FILE_NAME_WAREHOUSE_GOODS = "./data/complete_data/warehouses_goods_";

function main(){
    const warehouses_pair_ids_base = JSON.parse(fs.readFileSync(FILE_NAME_WAREHOUSE_PAIR_IDS, { encoding: "utf-8" }));

    for (let warehouse of warehouses_pair_ids_base) {
        const warehouse_old_id = warehouse.OLD_ID;
        const warehouse_current_id = warehouse.CURRENT_ID;

        const warehouse_goods_base = get_goods_from_warehouse(warehouse_old_id);

        const formated_good_list = formate_good_list(warehouse_goods_base);

        save_warehouse_to_file(warehouse_current_id, formated_good_list);
    }
}

function formate_good_list(good_list){
    const good_uniq_brands = [];
    const formated_good_list = [];

    for (let good of good_list) {

        if (!check_quantity_not_zero(good)) continue;

        const uniq_brand = create_uniq_brand(good);

        if (!check_dupluicate(uniq_brand, good_uniq_brands)) continue;

        for (const quantity of calculate_quantity(good)){
            formated_good_list.push(
                formate_good(
                    uniq_brand, 
                    get_sku(good, uniq_brand), 
                    good.title,
                    quantity, 
                    get_price(good)
                )
            );
        } 
    }
    return formated_good_list;
}

main();

function check_quantity_not_zero(good) {
    const quantity = good?.residue;
    return (quantity && quantity > 0);
}

function check_dupluicate(uniq_brand, good_uniq_brands) {
    if (good_uniq_brands.includes(uniq_brand)) return false;
    else good_uniq_brands.push(uniq_brand);
    return true;
}

function get_price(good) { // ошибка входных данных, если цены нет то забить в базу 1
    const price = good?.price?.["152900"];
    return (price && price > 0) ? price : 1;
}

function get_sku(good, uniq_brand){
    return ( (good?.article) ? good.article : good?.code ) ?? uniq_brand;
}

function calculate_quantity(good) {
    let quantity = Math.ceil(good?.residue);

    const result = [];

    const max_quantity = 1000;
    while (quantity > max_quantity){
        result.push(max_quantity);
        quantity = quantity - max_quantity;
    }
    if (quantity > 0) result.push(quantity);
    return result;
}

function formate_good(uniq_brand, sku, name, quantity, price) {
    return {
        "BRAND": uniq_brand,
        "SKU": sku,
        "NAME": name,
        "QUANTITY": quantity,
        "PRICE_WO_TAX": price,
    }
}

function get_goods_from_warehouse(id){
    return JSON.parse(fs.readFileSync(PARTIAL_FILE_NAME_WAREHOUSE_GOODS + id + ".json", { encoding: "utf-8" }));
}

function save_warehouse_to_file(id, good_list){
    fs.writeFileSync(PARTIAL_OUTPUT_FILE_NAME_WAREHOUSE_GOODS + id + ".json", JSON.stringify(good_list), { encoding: "utf-8" });
}

function create_uniq_brand(good) {
    const content = JSON.stringify(good);
    return createHash('md5').update(content).digest('hex');
}