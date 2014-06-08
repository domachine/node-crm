var fs = require('fs');

var Backbone = require('backbone');

var EditCustomerPhoneItemView = Backbone.View.extend({
  tagName: 'li',
  parentView: null,

  events: {
    'keyup [data-value="number"]': 'updateString',
    'keyup [data-value="description"]': 'updateString'
  },

  initialize: function() {
    'use strict';

    this.el.innerHTML = fs.readFileSync(
      __dirname + '/templates/edit_customer_phone_item.html',
      'utf8'
    );
  },

  render: function() {
    'use strict';

    this.el.querySelector('[data-value="number"]').value = this.model.number;
    this.el.querySelector('[data-value="description"]')
      .value = this.model.description;
  },

  updateString: function(evt) {
    'use strict';

    var el = evt.target;
    this.model[el.getAttribute('data-value')] = el.value;
  }
});

var EditCustomerPhoneView = Backbone.View.extend({
  initialize: function() {
    'use strict';

    this.el.innerHTML = fs.readFileSync(
      __dirname + '/templates/edit_customer_phone.html',
      'utf8'
    );
  },

  render: function() {
    'use strict';

    var self = this;

    this.model.forEach(function(phone) {
      var itemView;

      itemView = new EditCustomerPhoneItemView({ model: phone });
      itemView.parentView = self;
      itemView.render();
      self.el.querySelector('ul').appendChild(itemView.el);
    });
  }
});

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
    'use strict';

    this.el.innerHTML = this.template;
  },

  render: function() {
    'use strict';

    var phoneView;

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

    phoneView = new EditCustomerPhoneView({ model: this.model.get('phone') });
    phoneView.render();
    this.query('[data-value="phone"]').appendChild(phoneView.el);
  },

  save: function() {
    'use strict';

    var self = this;
    this.model.save().done(function() {
      self.render();
    });
  },

  updateString: function(evt) {
    'use strict';

    var el = evt.target;
    this.model.set(el.getAttribute('data-value'), el.value);
  },

  query: function() {
    'use strict';

    return this.el.querySelector.apply(this.el, arguments);
  },

  queryAll: function() {
    'use strict';

    return this.el.querySelectorAll.apply(this.el, arguments);
  }
});
