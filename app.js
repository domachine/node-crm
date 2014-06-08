var q = require('q');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var assimilate = require('assimilate');

var app;
var Customer;
var Appointment;

app = module.exports = express();

// Bootstrap models.
require('./models');

Customer = mongoose.model('customer');
Appointment = mongoose.model('appointment');

app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser());

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/app/index.html');
});

app.post('/customers', function(req, res, next) {
  var customer = new Customer(req.body);
  q.ninvoke(customer, 'save')
    .then(function() {
      res.status(201).send(customer);
    })
    .fail(next);
});

app.get('/customers', function(req, res, next) {
  'use strict';

  q.ninvoke(Customer, 'find')
    .then(function(customers) {
      res.send(customers);
    })
    .fail(next);
});

app.get('/customers/:id', function(req, res, next) {
  'use strict';

  q.ninvoke(Customer, 'findById', req.params.id)
    .then(function(customer) {
      if (!customer) {
        res.send(404);
      } else {
        res.send(customer);
      }
    })
    .fail(next);
});

app.put('/customers/:id', function(req, res, next) {
  q.ninvoke(Customer, 'findById', req.params.id)
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

app.delete('/customers/:id', function(req, res, next) {
  q.ninvoke(Customer, 'findById', req.params.id)
    .then(function(customer) {
      return q.ninvoke(customer, 'remove');
    })
    .then(function(customer) {
      res.send(customer);
    })
    .fail(next);
});

app.get('/customers/:id/appointments', function(req, res, next) {
  q.ninvoke(Appointment, 'find', { customer: req.params.id })
    .then(function(appointments) {
      res.send(appointments);
    })
    .fail(next);
});

app.post('/customers/:id/appointments', function(req, res, next) {
  q.ninvoke(Customer, 'findById', req.params.id)
    .then(function(customer) {
      var appointment;

      if (!customer) {
        return res.send(404);
      }

      appointment = new Appointment(req.body);
      appointment.customer = customer._id;
      return q.ninvoke(appointment, 'save');
    })
    .then(function(appointmentInfo) {
      res.status(201).send(appointmentInfo[0]);
    })
    .fail(next);
});
