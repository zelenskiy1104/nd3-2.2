const express = require('express');
let app = module.exports = express();

let users = require('./users');
app.use('/users', users);

app.get('/', function(req, res) {
    res.status(200).send('OK V1');
});
