var q = require('q');
var express = require('express');
var bodyParser = require('body-parser');

var models = require('../models');

var app = module.exports = express();

app.use(bodyParser());

app.post('/', function(req, res, next) {
  var customer = new models.Customer(req.body);
  q.ninvoke(customer, 'save')
    .then(function() {
      res.status(201).send(customer);
    })
    .fail(next);
});

app.get('/', function(req, res, next) {
  'use strict';

  q.ninvoke(models.Customer, 'find')
    .then(function(customers) {
      res.send(customers);
    })
    .fail(next);
});

app.get('/:id', function(req, res, next) {
  'use strict';

  q.ninvoke(models.Customer, 'findById', req.params.id)
    .then(function(customer) {
      if (!customer) {
        res.send(404);
      } else {
        res.send(customer);
      }
    })
    .fail(next);
});

app.put('/:id', function(req, res, next) {
  q.ninvoke(models.Customer, 'findById', req.params.id)
    .then(function(customer) {
      if (!customer) {
        return res.send(404);
      }
      for (var key in req.body) {
        if (!req.body.hasOwnProperty(key)) continue;
        customer[key] = req.body[key];
      }
      return q.ninvoke(customer, 'save');
    })
    .then(function(customerInfo) {
      res.send(customerInfo[0]);
    })
    .fail(next);
});

app.delete('/:id', function(req, res, next) {
  q.ninvoke(models.Customer, 'findById', req.params.id)
    .then(function(customer) {
      return q.ninvoke(customer, 'remove');
    })
    .then(function(customer) {
      res.send(customer);
    })
    .fail(next);
});
