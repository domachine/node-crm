var mongoose = require('mongoose');

var app;

mongoose.connect('mongodb://localhost/node-crm');

app = require('./app');

app.listen(3000);
