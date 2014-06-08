var Backbone = require('backbone');

var Appointment = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/appointments'
});

exports.Customer = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/customers',

  initialize: function() {
    'use strict';

    var id = this.id;

    this.Appointments = Backbone.Collection.extend({
      model: Appointment,
      url: function() {
        return '/customers/' + id + '/appointments';
      }
    });
  }
});

exports.Customers = Backbone.Collection.extend({
  model: exports.Customer,
  url: '/customers'
});
