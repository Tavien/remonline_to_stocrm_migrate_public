const init_safety_fetch = require("../../core/safety_fetch.js");
const {throttle} = require("../../core/decorators.js");

const GENERAL_ERRORS = require("../errors/general_errors.js");
var safety_fetch;

const err_templates = [
    (response) => ({
        status: response.CODE === GENERAL_ERRORS.MISSING_PROPERTIES,
        error: "MISSING_PROPERTIES",
    }),
    (response) => ({
        status: response.CODE === GENERAL_ERRORS.TOO_MANY_CONNECTIONS,
        error: "TOO_MANY_CONNECTIONS",
    }),
    (response) => ({
        status: response.CODE === GENERAL_ERRORS.SERVER_FUNCTION_EXECUTION_ERROR,
        error: "SERVER_FUNCTION_EXECUTION_ERROR",
    }),
    (response) => ({
        status: response.CODE === GENERAL_ERRORS.TOO_MANY_REQUESTS,
        error: "TOO_MANY_REQUESTS",
    }),
    (response) => ({
        status: response.CODE === GENERAL_ERRORS.ACCESS_DENIED,
        error: "ACCESS_DENIED",
    }),
];
const err_resolves = {
    MISSING_PROPERTIES:(err, request) => {  
        console.log(err.context.MESSAGE);
    },
    TOO_MANY_CONNECTIONS:(err, request) => {  
        console.log(err.context.MESSAGE);
        return safety_fetch(...request);
    },
    SERVER_FUNCTION_EXECUTION_ERROR:(err, request) => {  
        throw Error (err.message);
    },
    TOO_MANY_REQUESTS:(err, request) => {  
        console.log(err.context.MESSAGE);
        return safety_fetch(...request);
    },
    ACCESS_DENIED:(err, request) => {  
        console.log(err.context.MESSAGE);
    },
};

safety_fetch = throttle(init_safety_fetch(err_templates, err_resolves), 500);

const mixin_general_errors = (extenal_err_templates, external_err_resolves) => {
    const result_errors_templates = err_templates.concat(extenal_err_templates);
    const resutl_errors_resolves = {
        ...err_resolves,
        ...external_err_resolves
    };

    return [
        result_errors_templates,
        resutl_errors_resolves
    ];
}

module.exports = mixin_general_errors;
