var mongoose = require('mongoose');

var models;

models = [
  'customer',
  'appointment'
];

module.exports = models.map(function(name) {
  'use strict';

  require('./models/' + name);
});
