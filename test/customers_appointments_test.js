/* global describe, it */

var q = require('q');
var mongoose = require('mongoose');
var chai = require('chai');
var should = chai.should();
var request = require('supertest');

describe('customers appointments', function() {
  var customerId;

  before(function(next) {
    mongoose.connect('mongodb://localhost/test');
    mongoose.connection.db.dropDatabase();
    var app = require('..');
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
      var app = require('..');
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
    it('should fetch the customers', function(next) {
      var app = require('..');
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
