const {throttle}  = require("./decorators.js");

const DELAY = Math.ceil(1000 / process.env.RPS);

class SafetyFetch_ValidateResponseError extends Error {
    constructor(message, context) {
      super(message);
      this.name = "SafetyFetch_ValidateResponseError";
      this.context = context;
    }
}

const validate_response = (err_templates, body) => {
    for (let template of err_templates) {
        let test_result = template(body);
        
        if (test_result.status)
            throw new SafetyFetch_ValidateResponseError(test_result.error, body);
    }

    return body;
}

const init_validate_response = (err_templates) => {
    return (response) => {
        if (response.status === 200)
            return response.json()
                .then(body => validate_response(err_templates, body));
        else throw Error({ 
            text: `status: ${response.status}`,
            response
        })
    }
}

const init_safety_fetch = (err_templates, err_resolves) => {
    const validate_response_instance = init_validate_response(err_templates);

    return throttle((...request) => {
        return Promise.resolve(fetch(...request))
            .then(validate_response_instance)
            .catch((err) => {
                if (err instanceof SafetyFetch_ValidateResponseError)
                    return err_resolves[err.message](err, request);
                else throw err;
            })
    }, DELAY);
}

module.exports = init_safety_fetch;

