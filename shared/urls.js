const GENERAL_URL = `https://${process.env.SUBDOMAIN}.stocrm.ru`;

const EXTERNAL_API_URL = `${GENERAL_URL}/api/external/v1`;

// --- Контакты ---
    // Создать контакт
    const CREATE_CONTACT = url("contact/create");
    // Изменить контакт
    const UPDATE_CONTACT = url("contact/update");
    // Получить полную информацию о клиенте
    const GET_CONTACT_INFO = url("contact/get_info");
    // Получить список контактов
    const GET_CONTACTS = url("contacts/get_from_filter");
    // Получить список автомобилей
// --- Контакты ---

// --- Организации ---
    // Получить список организаций
    const GET_LEGAL_ENTITIES = url("legal_entities/get_from_filter");
// --- Организации ---

// --- Автомобили ---
    // Добавить автомобиль
    const ADD_CAR = url("car/save_car");
    // Получить список автомобилей
    const GET_CARS = url("car_profile/get_filtered_profiles");
    // Изменить автомобиль
    const UPDATE_CAR = url("car/edit");
// --- Автомобили ---

// --- Склады ---
    // Получить список складов
    const GET_WARHOUSES = url("wms/get_warehouses");
    // Создать поступление
    const CREATE_POSTING = url("wms/posting/do");
    // Добавить товары в поступление
    const ADD_WARHOUSE_GOODS = url("wms/posting/items/add");
    // Провести поступление
    const FINALIZE_POSTING = url("wms/posting/finalize");
// --- Склады ---

// --- Сделки ---
    // Создать сделку
    const CREATE_OFFER = url("offer/new");
    // Создать сделку с контактом
    const CREATE_OFFER_WITH_CONTACT = url("offer/new/with_contact");
    // Изменить статус сделки
    const CHANGE_OFFER_STATUS = url("offer/status/change");
    // Добавить товары в сделку
    const ADD_OFFER_GOODS = url("wms/get_filtered_stocks");
    // Добавить работы в сделку
    const ADD_OFFER_WORKS = url("work/add");
// --- Сделки ---

module.exports = {
    CREATE_CONTACT,
    UPDATE_CONTACT,
    GET_CONTACT_INFO,
    GET_CONTACTS,
    GET_LEGAL_ENTITIES,
    ADD_CAR,
    GET_CARS,
    UPDATE_CAR,
    GET_WARHOUSES,
    CREATE_POSTING,
    ADD_WARHOUSE_GOODS,
    FINALIZE_POSTING,
    CREATE_OFFER,
    CREATE_OFFER_WITH_CONTACT,
    CHANGE_OFFER_STATUS,
    ADD_OFFER_GOODS,
    ADD_OFFER_WORKS,
}

function url(path){
    return `${EXTERNAL_API_URL}/${path}`;
}
// Example to use url(path: string)
//const URL_NAME = url("user/create");