const fs = require("node:fs");

const FILE_NAME_CONTACTS = "./data/intermediate_data/contacts/physical.json";
const FILE_NAME_CAR_CACHE = "./data/car_model_ids.json";

const OUTPUT_CARS = "./data/complete_data/cars.json";
const OUTPUT_CONTACTS = "./data/complete_data/contacts.json";

// ---- Методы для работы с базой контактов -----------------------------------
const contacts_base = JSON.parse(
    fs.readFileSync(FILE_NAME_CONTACTS, { encoding: "utf-8" })
);

const isFullName = (name) => (name.split("/")[0].split(" ").length > 2);
const isThereAlternativeName = (name) => name.includes("/");

const split_name = (name) => {
    if (!isFullName(name))
        return {
            SURNAME: "",
            FIRSTNAME: name,
            MIDDLENAME: ""
        }
    else if (!isThereAlternativeName(name)) {
        const names = name.split(" ");
        return {
            SURNAME: names[0],
            FIRSTNAME: names[1],
            MIDDLENAME: names[2]
        }
    }
    else {
        const contactName_and_alternativeName = name.split("/");
        const names = contactName_and_alternativeName[0].split(" ");
        return {
            SURNAME: names[0],
            FIRSTNAME: `${names[1]} / ${contactName_and_alternativeName[1]}`,
            MIDDLENAME: names[2]
        }
    }
}

const get_phones = (phones) => ({
    "1": phones.map(phone => ({ "VALUE": phone, "MAIN": "Y" }))
})
// ------------------------------------------------------------------------------


// ---- Методы поиска идентификаторов марки и модели автомобиля -----------------
const car_cache = JSON.parse(
    fs.readFileSync(FILE_NAME_CAR_CACHE, { encoding: "utf-8" })
);

const get_car_meta_info = (brand, model) => {
    const brand_in_cache = car_cache[brand];
    if (!brand_in_cache) return {
        warning: true,
        brand_id: 18, // Прочие авто
        model_id: 2319 // Прочие иномарки
    }
    else {
        const model_array_in_cache = brand_in_cache.model
        const model_in_cache = model_array_in_cache.find((model_in_cache) => (model_in_cache.title === model))
        if (!model_in_cache) return {
            warning: true,
            brand_id: brand_in_cache.id,
            model_id: model_array_in_cache[0].id
        }
        else return {
            warning: false,
            brand_id: (model_in_cache.brand) ? model_in_cache.brand : brand_in_cache.id,
            model_id: model_in_cache.id
        }
    }

};
// ------------------------------------------------------------------------------

let format_cars_base = [];
let format_contscts_base = [];

for (const contact of contacts_base) {
    // Форматирование данных клиента
    format_contscts_base.push({
        DATA: split_name(contact.name),
        PROPERTIES: get_phones(contact.phone),
        OLD_ID: contact['id'],
    });

    // Форматирование данных автомобиля
    const description = `ВНИМАНИЕ: Данные перенесены из remonline автоматически. Возможны неточности. Сверка ОБЯЗАТЕЛЬНА!
        Оригинальные данные:
            "Марка авто":        ${contact.custom_fields["Марка авто"]}
            "Модель авто":       ${contact.custom_fields["Модель авто"]}
            "VIN номер":         ${contact.custom_fields["VIN номер"]}
            "Год выпуска авто":  ${contact.custom_fields["Год выпуска авто"]}`;

    if (contact.custom_fields["Марка авто"]) {
        const car_meta_info = get_car_meta_info(contact.custom_fields["Марка авто"], contact.custom_fields["Модель авто"]);
        const format_car = {
            // !! ВАЖНО !! При добавлении пользователей в базу STO CRM ЗАМЕНИТЬ на ВАЛИДНЫЙ идентификатор
            // (P.S. Этот код менять не надо - в другом скрипте замену сделать)
            OLD_CONTACT_ID: contact['id'],
            PHONE: contact?.phone[0],
            // ------------------------------------------------------------------------------------------
            VIN: contact.custom_fields["VIN номер"],
            TITLE: `${contact.custom_fields["Марка авто"]} ${contact.custom_fields["Модель авто"]}`,
            DESCRIPTION: (car_meta_info.warning) ? ("ВНИМАНИЕ: Не удалось однозначно перенести данные из remonline\n" + description) : description,
            BRAND_ID: car_meta_info.brand_id,
            MODEL_ID: car_meta_info.model_id,
            YEAR: contact.custom_fields["Год выпуска авто"],
        }
        format_cars_base.push(format_car);
    }
}

fs.writeFileSync(OUTPUT_CONTACTS, JSON.stringify(format_contscts_base));
fs.writeFileSync(OUTPUT_CARS, JSON.stringify(format_cars_base));
