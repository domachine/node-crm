/* global describe, it */

var q = require('q');
var mongoose = require('mongoose');
var chai = require('chai');
var should = chai.should();
var request = require('supertest');

describe('customers', function() {
  before(function() {
    mongoose.connect('mongodb://localhost/test');
    mongoose.connection.db.dropDatabase();
  });

  describe('GET /customers', function() {
    it('should fetch the customers', function(next) {
      var app = require('..');
      request(app)
        .get('/customers')
        .end(function(error, res) {
          should.not.exist(error);
          should.exist(res);
          res.body.should.eql([]);
          next();
        });
    });
  });

  describe('POST /customers', function() {
    it('should insert a customer', function(next) {
      var app = require('..');
      q.ninvoke(
        request(app)
          .post('/customers')
          .send({
            name: 'Hans Peter Weckenmann'
          }),
          'end'
        ).then(function(res) {
          should.exist(res.body);
          should.exist(res.body.name);
          res.body.name.should.equal('Hans Peter Weckenmann');
          return q.ninvoke(request(app).get('/customers'), 'end');
        })
        .then(function(res) {
          res.body[0].name.should.equal('Hans Peter Weckenmann');
          next();
        })
        .fail(next);
    });
  });

  describe('GET /customers/:id', function() {
    it('should retrieve a customer', function(next) {
      var app = require('..');
      q.ninvoke(request(app).get('/customers'), 'end')
        .then(function(res) {
          var id = res.body[0]._id;
          return q.ninvoke(request(app).get('/customers/' + id), 'end');
        })
        .then(function(res) {
          res.status.should.equal(200);
          should.exist(res.body);
          next();
        })
        .fail(next);
    });
  });

  describe('PUT /customers/:id', function() {
    it('should update a customer', function(next) {
      var app = require('..');
      var id;
      q.ninvoke(request(app).get('/customers'), 'end')
        .then(function(res) {
          id = res.body[0]._id;
          return q.ninvoke(
            request(app)
              .put('/customers/' + id)
              .send({
                name: 'Hans Peter Weckenmann 2'
              }),
            'end'
          );
        })
        .then(function(res) {
          res.status.should.equal(200);
          res.body.name.should.equal('Hans Peter Weckenmann 2');
          next();
        })
        .fail(next);
    });
  });

  describe('DELETE /customers/:id', function() {
    it('should delete a customer', function(next) {
      var app = require('..');
      var id;
      q.ninvoke(request(app).get('/customers'), 'end')
        .then(function(res) {
          id = res.body[0]._id;
          return q.ninvoke(request(app).del('/customers/' + id), 'end');
        })
        .then(function(res) {
          res.status.should.equal(200);
          return q.ninvoke(request(app).get('/customers/' + id), 'end');
        })
        .then(function(res) {
          res.status.should.equal(404);
          next();
        })
        .fail(next);
    });
  });

  after(function() {
    mongoose.connection.db.dropDatabase();
    mongoose.disconnect();
  });
});
