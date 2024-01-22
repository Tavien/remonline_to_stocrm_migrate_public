//В stocrm на данный момент не реализовано API для импортирования Юр.лиц, доступно только через текстовый или xlsx файл
const fs = require("node:fs");

const FILE_NAME_JURIDICAL = "./data/intermediate_data/contacts/juridical.json";
const FILE_NAME_JURIDICAL_LIST_OUTPUT = "./data/complete_data/juridical.txt";

const titles = "PHONE\tNAME\tINN\tNOTE\tKPP\tBANK_ACCOUNT_NUMBER\tBANK_CORRESPONDENT_ACCOUNT\tBANK_ADDRESS\tBANK_NAME\tADDRESS\tCONTRACT_NUMBER\tOKPO\tBIC\tCEO\tACCOUNTANT\tPROP_1\tPROP_2";
const line_length = titles.split("\t").length;
const titles_index_map = titles.split("\t").reduce((acc, value, index) => { acc[value] = index; return acc }, {});

const juridicals_base = JSON.parse(fs.readFileSync(FILE_NAME_JURIDICAL));


const result = [];
for (const obj of juridicals_base){
    result.push(new_line(format_juridical(obj)));
}

const resultText = titles + "\n" + result.join("\n");

fs.writeFileSync(FILE_NAME_JURIDICAL_LIST_OUTPUT, resultText, { encoding: "utf-8" });

function new_line(obj){
    let new_line = [];
    new_line.length = line_length;
    new_line.fill("#", 0);

    for (const key in obj){
        if (obj[key])
            new_line[titles_index_map[key]] = obj[key];
    }

    return new_line.join("\t").replaceAll("#");
}

function format_juridical(obj){
    const PHONE = obj?.["phone"]?.[0];
    const NAME = obj?.["name"];
    const INN = obj?.["custom_fields"]?.["ИНН"];
    const NOTE = "ВНИМАНИЕ: Данные перенесены из remonline автоматически. Возможны неточности. Сверка ОБЯЗАТЕЛЬНА! " + JSON.stringify(obj);
    const KPP = obj?.["custom_fields"]?.["КПП"];
    const BANK_ACCOUNT_NUMBER = obj?.["custom_fields"]?.["Расчетный счет"];
    const BANK_NAME = obj?.["custom_fields"]?.["Название банка"];
    const ADDRESS = obj?.["custom_fields"]?.["Юридический адрес"];
    const CONTRACT_NUMBER = obj["phone"]?.[0];
    const CEO = obj?.["custom_fields"]?.["Директор"];
    const PROP_1 = obj?.["phone"][0];
    const PROP_2 = obj?.["email"];

    return {
        PHONE,
        NAME,
        INN,
        NOTE,
        KPP,
        BANK_ACCOUNT_NUMBER,
        BANK_NAME,
        ADDRESS,
        CONTRACT_NUMBER,
        CEO,
        PROP_1,
        PROP_2,
    }
}

