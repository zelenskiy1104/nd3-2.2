const express = require("express");
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');

mainDir = __dirname;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

db.connect();

let api = require('./api');
app.use('/api', api);

let rpc = require('./rpc');
app.use('/rpc', rpc);

app.listen(3000, function() {
    console.log('Listening on port 3000...');
});
