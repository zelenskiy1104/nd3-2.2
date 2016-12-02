const redis = require("redis")

var state = {
    db: null,
}

const MODE_TEST = "mode_test";
const MODE_PRODUCTION = "mode_production";

exports.MODE_TEST = MODE_TEST;
exports.MODE_PRODUCTION = MODE_PRODUCTION;

exports.connect = function(mode) {
    state.db = redis.createClient();

    if (mode === MODE_TEST) {
        state.db.select(15);
    }
}

exports.get = function() {
    return state.db;
}
