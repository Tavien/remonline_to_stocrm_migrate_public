const fs = require("node:fs");
const init_safety_fetch = require("../../core/safety_fetch.js");

const CARS_ERRORS = require("../../shared/errors/cars_errors.js");
const mixin_general_errors = require("../../shared/error_handlers/general_errors_handler.js");

const URLS = require("../../shared/urls.js");

const [err_templates, err_resolves] = mixin_general_errors(
    [
        (response) => ({
            status: response.CODE === CARS_ERRORS.MISSING_REQUIRED_ARGS,
            error: "MISSING_REQUIRED_ARGS",
        }),
        (response) => ({
            status: response.CODE === CARS_ERRORS.DUPLICATE_VIN,
            error: "DUPLICATE_VIN",
        }),
        (response) => ({
            status: response.CODE === CARS_ERRORS.DUPLICATE_CAR,
            error: "DUPLICATE_CAR",
        }),
        (response) => ({
            status: response.CODE === CARS_ERRORS.FAILURE_ADD_CAR,
            error: "FAILURE_ADD_CAR",
        }),
    ],
    {
        MISSING_REQUIRED_ARGS: (err, request) => {
            throw err;
        },
        DUPLICATE_VIN: (err, request) => {
            console.log(err.message, "\n", request);
            throw err;
        },
        DUPLICATE_CAR: (err, request) => {
            console.log(err.message, "\n", request);
            throw err;
        },
        FAILURE_ADD_CAR: (err, request) => {
            console.log(err.message, "\n", request);
            throw err;
        },
    }
);

const safety_fetch = init_safety_fetch(err_templates, err_resolves);

const FILE_NAME_CARS = "./data/complete_data/cars.json";
const FILE_NAME_CONTACT_PAIR_IDS = "./data/complete_data/contact_pair_ids.json";
const FILE_NAME_UPLOADED_CARS = "./data/uploaded_data/uploaded_cars.json";

const URL = URLS.ADD_CAR;

const cars_base = JSON.parse( fs.readFileSync(FILE_NAME_CARS, { encoding: "utf-8" }) );
const contact_pair_ids_base = JSON.parse( fs.readFileSync(FILE_NAME_CONTACT_PAIR_IDS, { encoding: "utf-8" }) );
const uploaded_cars = JSON.parse(fs.readFileSync(FILE_NAME_UPLOADED_CARS));

const upload_car = (car) => {
    const copy_car = JSON.parse(JSON.stringify(car));
    const old_contact_id = copy_car.OLD_CONTACT_ID;
    delete copy_car.OLD_CONTACT_ID;
    delete copy_car.PHONE;

    const current_contact_id = +(contact_pair_ids_base.find((contact) => (contact["old_id"] === old_contact_id))["current_id"]);
    copy_car["CONTACT_ID"] = current_contact_id;

    if (check_car_exist(old_contact_id)) return safety_fetch(URL, body(copy_car))
    else return Promise.reject("EXIST");
}

async function main() {
    for await (const car of cars_base){
        const old_contact_id = car.OLD_CONTACT_ID;

        try {
            const response = await upload_car(car);
            uploaded_cars.push(old_contact_id);
            fs.writeFileSync(FILE_NAME_UPLOADED_CARS, JSON.stringify(uploaded_cars));
        } catch (err) {
            if (err === "EXIST") console.log("Автомобиль уже содержится в списке");
        }
    }
}

main();

function check_car_exist(old_id) {
    return !uploaded_cars.includes(old_id);
}

function body(car){
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            SID: process.env.SID,
            ARGS : {...car}
        })
    }
}

