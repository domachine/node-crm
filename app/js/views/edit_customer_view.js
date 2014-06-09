var fs = require('fs');

var Backbone = require('backbone');

var PhoneItemView = Backbone.View.extend({
  tagName: 'li',
  parentView: null,

  events: {
    'keyup [data-value="number"]': 'updateString',
    'keyup [data-value="description"]': 'updateString',

    'click [data-action="destroy"]': 'destroy'
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

    this.el.querySelector('[data-value="number"]')
      .value = this.model.get('number');
    this.el.querySelector('[data-value="description"]')
      .value = this.model.get('description');
  },

  updateString: function(evt) {
    'use strict';

    var el = evt.target;
    this.model.set(el.getAttribute('data-value'), el.value);
  },

  destroy: function(evt) {
    'use strict';

    evt.preventDefault();
    this.model.collection.remove(this.model);
  }
});

var PhoneView = Backbone.View.extend({
  events: {
    'click [data-action="add"]': 'add'
  },

  initialize: function() {
    'use strict';

    this.el.innerHTML = fs.readFileSync(
      __dirname + '/templates/edit_customer_phone.html',
      'utf8'
    );

    // Build collection to track state of items.
    this.views = [];
    this.collection = new Backbone.Collection(this.model);
    this.listenTo(
      this.collection,
      'change add remove sort',
      this.serialize
    );
    this.listenTo(
      this.collection,
      'change add remove sort',
      this.render
    );
  },

  render: function() {
    'use strict';

    var self = this;

    // Remove old (if any) views.
    this.views.forEach(function(view) {
      view.remove();
    });
    this.views = [];
    this.collection.each(function(phone) {
      var itemView;

      itemView = new PhoneItemView({ model: phone });
      self.views.push(itemView);
      itemView.parentView = self;
      itemView.render();
      self.el.querySelector('ul').appendChild(itemView.el);
    });
  },

  //
  // Add a new phone item.
  //
  add: function(evt) {
    'use strict';

    var phone = { number: '', description: '' };

    evt.preventDefault();
    this.collection.push(phone);

    // Rerender view.
    this.render();
  },

  //
  // Serialize collection to real model which is represented as array.
  //
  serialize: function() {
    'use strict';

    var self = this;

    // Clear array.
    this.model.splice(0);
    this.collection.each(function(phone, index) {
      self.model[index] = phone.toJSON();
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

    phoneView = new PhoneView({ model: this.model.get('phone') });
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
