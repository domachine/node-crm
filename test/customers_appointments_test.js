/* global describe, it */

var q = require('q');
var express = require('express');
var mongoose = require('mongoose');
var chai = require('chai');
var should = chai.should();
var request = require('supertest');

describe('customers appointments', function() {
  var customerId;

  before(function(next) {
    mongoose.connect('mongodb://localhost/test');
    mongoose.connection.db.dropDatabase();
    var app = express();
    app.use('/customers', require('../routes/customers'));
    q.ninvoke(
      request(app).post('/customers').send({ name: 'Test user' }),
      'end'
    ).then(function(res) {
      customerId = res.body._id;
      next();
    }).fail(next);
  });

  describe('POST /customers/:id/appointments', function() {
    it('should create an appointment', function(next) {
      var app = express();
      app.use('/customers', require('../routes/customers_appointments'));
      var from = new Date();
      var to = new Date(new Date() + 300000);
      q.ninvoke(
        request(app)
          .post('/customers/' + customerId + '/appointments')
          .send({
            title: 'Important Appointment',
            from: from,
            to: to
          }),
        'end'
      ).then(function(res) {
        res.status.should.equal(201);
        should.exist(res.body);
        res.body.title.should.equal('Important Appointment');
        res.body.from.should.eql(from.toISOString());
        res.body.to.should.eql(to.toISOString());
        next();
      }).fail(next);
    });
  });

  describe('GET /customers/:id/appointments', function() {
    it('should fetch the customer\'s appointments', function(next) {
      var app = express();
      app.use('/customers', require('../routes/customers_appointments'));
      q.ninvoke(
        request(app).get('/customers/' + customerId + '/appointments'),
        'end'
      ).then(function(res) {
        res.status.should.equal(200);
        should.exist(res.body);
        res.body[0].title.should.equal('Important Appointment');
        next();
      }).fail(next);
    });
  });

  after(function() {
    mongoose.connection.db.dropDatabase();
    mongoose.disconnect();
  });
});
