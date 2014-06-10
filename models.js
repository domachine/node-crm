var mongoose = require('mongoose');

var models;

models = [
  'customer',
  'appointment'
];

models.forEach(function(name) {
  'use strict';

  exports[name[0].toUpperCase() + name.slice(1)] = require('./models/' + name);
});
