var Backbone = require('backbone');

var Appointment = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/appointments'
});

exports.User = Backbone.Model.extend({
  url: function() {
    return '/user';
  }
});

exports.Customer = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/customers',

  initialize: function() {
    'use strict';

    var id = this.id;

    this.Appointment = Appointment.extend({
      initialize: function() {
        this.set('customer', id);
      }
    });

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
