var fs = require('fs');

var Backbone = require('backbone');
var _ = require('underscore');

var modal = require('../lib/modal');

//
// The view for one item in the list of customers.
//
var CustomersItemView = Backbone.View.extend({
  tagName: 'tr',
  template: fs.readFileSync(
    __dirname + '/templates/customers_item.html',
    'utf-8'
  ),

  events: {
    'click [data-action="destroy"]': 'destroy'
  },

  //
  // Initialize it by loading the html template.
  //
  initialize: function() {
    'use strict';

    this.$el.html(this.template);
  },

  //
  // Map the model's values onto the html template.
  //
  render: function() {
    'use strict';

    this.el.querySelector('[data-text="name"]')
      .textContent = this.model.get('name') || '';
    this.$el.find('[data-href="customer"]')
      .attr('href', '#customers/' + this.model.id);
    this.el.querySelector('[data-text="email"]')
      .textContent = this.model.get('email') || '';
  },

  //
  // Destroy the model.
  //
  destroy: function() {
    'use strict';

    var self = this;

    modal.render({
      title: 'Kunde löschen?',
      body: [
        'Soll der Kunde',
        _.escape(this.model.get('name')),
        'wirklich gelöscht werden?'
      ].join(' '),
      type: 'yesno'
    });
    modal.once('closed', function() {
      if (modal.state === modal.states.YES) {
        self.model.destroy().done(function() {
          self.remove();
        });
      }
    });
  }
});

module.exports = Backbone.View.extend({
  template: fs.readFileSync(
    __dirname + '/templates/customers.html',
    'utf8'
  ),

  initialize: function() {
    'use strict';

    this.listenTo(this.model, 'add remove', this.render);
  },

  render: function() {
    'use strict';

    var self = this;

    this.$el.html(this.template);
    this.$el.find('.jumbotron [data-value="customers-count"]').text(
      this.model.length === 1 ? '1 Kunde' : this.model.length + ' Kunden'
    );
    this.model.each(function(customer) {
      var view = new CustomersItemView({ model: customer });
      self.$el.find('.table').append(view.el);
      view.render();
    });
  }
});
