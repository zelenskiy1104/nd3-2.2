const db = require('../db');

exports.list = function(limit, offset, fields, done) {
    callList(limit, offset, function(err, result) {
        let data = [];
        result.forEach((item) => {
            let json_item = JSON.parse(item);
            let final_item = {};
            if (fields.length > 0)
            {
                fields.forEach((field) => {
                    if (json_item[field] !== undefined) {
                        final_item[field] = json_item[field];
                    }
                });
            }
            else
            {
                final_item = json_item;
            }

            data.push(final_item);
        });

        done(JSON.stringify(data));
    });
}

function callList(limit, offset, callback) {
    var from = 0;
    var to = -1;
    if (offset && offset>0) {
        from = offset - 1;
    }
    if (limit && limit > 0) {
        to = from + limit - 1;
    }
    db.get().lrange('users', from, to, function(err, result) {
        if (err) {
            /* handle error */
        } else {
            callback(err, result);
        }
    });
}

exports.create = function(name, score, done) {
    var data = {
        name: name,
        score: score,
    }

    db.get().rpush("users", JSON.stringify(data), function(err, result) {
        done(err, result);
    });
}

exports.get = function(id, done) {
    callLIndex(id, function(err, result) {
        done(err, result);
    });
}

function callLIndex(id, callback) {
    db.get().lindex('users', id, function(err, result) {
        callback(err, result);
    });
}

exports.delete = function(id, done) {
    callDel(id, function(err, result) {
        done(err, result);
    });
}

function callDel(id, callback) {
    db.get().lset('users', id, '__deleted__', function(err, result) {
        if (err) {
            console.log(err);
        } else {
            db.get().lrem('users', 0, '__deleted__', function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    callback(err, result);
                }
            });
        }
    });
}

exports.deleteAll = function(done) {
    callDelAll(function(err, result) {
        done(err, result);
    });
}

function callDelAll(callback) {
    db.get().del('users', function(err, result) {
        callback(err, result);
    });
}

exports.update = function(id, name, score, done) {
    callLIndex(id, function(err, result) {
        callUpdate(id, result, name, score, function(err, result) {
            done(err, result);
        });
    });
}

function callUpdate(id, user, name, score, callback) {
    var new_name, new_score;

    var old = JSON.parse(user);

    if (name) {
        new_name = name;
    } else {
        new_name = old.name;
    }

    if (score) {
        new_score = score;
    } else {
        new_score = old.score;
    }

    var data = {
        name: new_name,
        score: new_score,
    }

    db.get().lset('users', id, JSON.stringify(data), function(err, result) {
        callback(err, result);
    });
}
