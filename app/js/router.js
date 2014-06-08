var Backbone = require('backbone');

var models = require('./models');
var views = require('./views');

var Router = Backbone.Router.extend({
  routes: {
    'customers/new': 'newCustomer',
    'customers/:id/edit': 'editCustomer',
    'customers/:id': 'customer',
    'customers?skip=:skip&limit=:limit': 'customers',
    'customers': 'allCustomers',
    '': 'redirect'
  },

  customers: function() {
    var self = this;
    var customers = new models.Customers();

    if (this.customersView) {
      this.customersView.remove();
    }

    customers
      .fetch({ data: { skip: 0, limit: 10 } })
      .done(function() {
        self.customersView = new views.CustomersView({ model: customers });
        self.customersView.render();
        Backbone.$('#content').html('');
        Backbone.$('#content').append(self.customersView.el);
      });
  },

  allCustomers: function(skip, limit) {
    this.navigate('', true);
  },

  customer: function(id) {
    var self = this;
    var customer = new models.Customer({ _id: id });

    if (self.customerView) {
      self.customerView.remove();
    }

    Backbone.$('#content').html('');
    customer.fetch().done(function() {
      self.customerView = new views.CustomerView({ model: customer });
      self.customerView.render();
      Backbone.$('#content').append(self.customerView.el);
    });
  },

  newCustomer: function() {
    var self = this;
    var customer = new models.Customer();
    var content;

    if (self.editCustomerView) {
      self.editCustomerView.remove();
    }

    content = document.getElementById('content');
    content.innerHTML = '';
    self.editCustomerView = new views.EditCustomerView({ model: customer });
    self.editCustomerView.render();
    content.appendChild(self.editCustomerView.el);
  },

  editCustomer: function(id) {
    var self = this;
    var customer = new models.Customer({ _id: id });

    if (self.editCustomerView) {
      self.editCustomerView.remove();
    }

    document.querySelector('#content').innerHTML = '';
    customer.fetch().done(function() {
      self.editCustomerView = new views.EditCustomerView({ model: customer });
      self.editCustomerView.render();
      document.querySelector('#content')
        .appendChild(self.editCustomerView.el);
    });
  },

  redirect: function() {
    this.navigate('customers?skip=0&limit=100', true);
  }
});

module.exports = new Router();
