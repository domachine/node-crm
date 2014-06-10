var q = require('q');
var express = require('express');
var bodyParser = require('body-parser');

var models = require('../models');

var app = module.exports = express();

app.use(bodyParser());

app.get('/:id/appointments', function(req, res, next) {
  q.ninvoke(models.Appointment, 'find', { customer: req.params.id })
    .then(function(appointments) {
      res.send(appointments);
    })
    .fail(next);
});

app.post('/:id/appointments', function(req, res, next) {
  q.ninvoke(models.Customer, 'findById', req.params.id)
    .then(function(customer) {
      var appointment;

      if (!customer) {
        return res.send(404);
      }

      appointment = new models.Appointment(req.body);
      appointment.customer = customer._id;
      return q.ninvoke(appointment, 'save');
    })
    .then(function(appointmentInfo) {
      res.status(201).send(appointmentInfo[0]);
    })
    .fail(next);
});
