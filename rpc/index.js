const express = require('express');
let app = module.exports = express();

const Users = require(mainDir+'/models/users');

function filterFields(fields_string) {
    let fields = fields_string.split(',');
    return fields;
}

const rpc = {
    get: (params, res) => {
        var limit = parseInt(params.limit) || false;
        var offset = parseInt(params.offset) || false;

        var fields_string = params.fields || '';
        var fields = [];
        if (fields_string !== '') {
            fields = filterFields(fields_string);
        }

        Users.list(limit, offset, fields, function(users) {
            res.status(200).send(users);
        });
    },
    read: (params, res) => {
        let id = parseInt(params.id) || false;

        if (id) {
            Users.get(id, function(err, user) {
                if (err || user == null) {
                    res.status(404).send('Not found');
                }
                else {
                    res.status(200).send(user);
                }
            });
        }
        else {
            res.status(400).send('Bad request');
        }
    },
    create: (params, res) => {
        let name = params.name || false;
        let score = params.score || false;

        if (name && score) {
            Users.create(name, score, function(err, result) {
                if (err) {
                    res.status(404).send('Not found');
                }
                else {
                    res.status(201).send('Created');
                }
            });
        }
        else {
            res.status(400).send('Bad request');
        }
    },
    update: (params, res) => {
        let id = parseInt(params.id) || false;
        let name = params.name || false;
        let score = params.score || false;

        if (id) {
            Users.update(id, name, score, function(err, status) {
                if (err) {
                    res.status(404).send('Not found');
                }
                else {
                    res.status(200).send(status);
                }
            });
        }
        else {
            res.status(400).send('Bad request');
        }
    },
    delete: (params, res) => {
        let id = params.id || false;

        if (id == 'all') {
            Users.deleteAll(function(err, count) {
                if (err) {
                    res.status(400).send('Bad request');
                }
                else {
                    res.status(200).send('OK');
                }
            });
        }
        else {
            id = parseInt(id);
            if (id) {
                Users.delete(id, function(err, count) {
                    if (err || count < 1) {
                        res.status(400).send('Bad request');
                    }
                    else {
                        res.status(200).send('User deleted');
                    }
                });
            }
            else {
                res.status(400).send('Bad request');
            }
        }
    },
};

app.post('/', (req, res) => {
    let method = req.body.method;
    let func = rpc[method];
    let params = req.body.params;

    func(params, res);
});
