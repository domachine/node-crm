var fs = require('fs');

var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  template: fs.readFileSync(
    __dirname + '/templates/edit_customer.html',
    'utf8'
  ),

  events: {
    'keyup [data-value="name"]': 'updateString',
    'keyup [data-value="email"]': 'updateString',
    'keyup [data-value="street_address"]': 'updateString',
    'keyup [data-value="zip_code"]': 'updateString',
    'keyup [data-value="location"]': 'updateString',

    'click [data-action="save"]': 'save'
  },

  initialize: function() {
    this.el.innerHTML = this.template;
  },

  render: function() {
    this.query('[data-text="name"]')
      .textContent = this.model.get('name') || 'Neuer Kunde';
    if (this.model.id) {
      this.query('[data-href="customer"]')
        .setAttribute('href', '#customers/' + this.model.id);
    }
    this.query('[data-value="name"]').value = this.model.get('name') || '';
    this.query('[data-value="email"]').value = this.model.get('email') || '';

    this.query('[data-value="street_address"]')
      .value = this.model.get('street_address') || '';
    this.query('[data-value="zip_code"]')
      .value = this.model.get('zip_code') || '';
    this.query('[data-value="location"]')
      .value = this.model.get('location') || '';
  },

  save: function(evt) {
    var self = this;
    this.model.save().done(function() {
      self.render();
    });
  },

  updateString: function(evt) {
    var el = evt.target;
    this.model.set(el.getAttribute('data-value'), el.value);
  },

  query: function() {
    return this.el.querySelector.apply(this.el, arguments);
  },

  queryAll: function() {
    return this.el.querySelectorAll.apply(this.el, arguments);
  }
});
