const express = require('express');
let app = module.exports = express();

const Users = require(mainDir+'/models/users');

function filterFields(fields_string) {
    let fields = fields_string.split(',');
    return fields;
}

app.get('/', function(req, res) {
    var limit = parseInt(req.query.limit) || false;
    var offset = parseInt(req.query.offset) || false;

    var fields_string = req.query.fields || '';
    var fields = [];
    if (fields_string !== '') {
        fields = filterFields(fields_string);
    }

    Users.list(limit, offset, fields, function(users) {
        res.status(200).send(users);
    });
});

app.put('/create', function(req, res) {
    let name = req.body.name || false;
    let score = req.body.score || false;

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
});

app.get('/:id', function(req, res) {
    let id = req.params.id || false;

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
});

app.delete('/:id/delete', function(req, res) {
    let id = req.params.id || false;

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
});

app.post('/:id/update', function(req, res) {
    let id = parseInt(req.params.id) || false;
    let name = req.body.name || false;
    let score = req.body.score || false;

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
});
