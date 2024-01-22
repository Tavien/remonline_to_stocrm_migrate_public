const throttle = (method, delay) => {
    let promise = Promise.resolve();
    return (...args) => {
        return promise
            .then(() => new Promise(resolve => setTimeout(resolve, delay)))
            .then(() => method(...args));
    }
}

module.exports = {
    throttle,
};