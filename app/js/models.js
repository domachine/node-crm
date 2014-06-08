var Backbone = require('backbone');

exports.Customer = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/customers'
});

exports.Customers = Backbone.Collection.extend({
  model: exports.Customer,
  url: '/customers'
});
