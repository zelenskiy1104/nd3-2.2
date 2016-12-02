const express = require('express');
let app = module.exports = express();

let v1 = require('./v1');
app.use('/v1', v1);

app.get('/', function(req, res) {
    res.status(200).send('OK API');
});
