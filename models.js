var mongoose = require('mongoose');

var models;

models = [
  'customer'
];

module.exports = models.map(function(name) {
  'use strict';

  require('./models/' + name);
});
