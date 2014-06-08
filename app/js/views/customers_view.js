var fs = require('fs');

var Backbone = require('backbone');

var CustomersItemView = Backbone.View.extend({
  tagName: 'tr',
  template: fs.readFileSync(
    __dirname + '/templates/customers_item.html',
    'utf-8'
  ),

  events: {
    'click [data-action="destroy"]': 'destroy'
  },

  initialize: function() {
    this.$el.html(this.template);
  },

  render: function() {
    this.el.querySelector('[data-text="name"]')
      .textContent = this.model.get('name') || '';
    this.$el.find('[data-href="customer"]')
      .attr('href', '#customers/' + this.model.id);
    this.el.querySelector('[data-text="email"]')
      .textContent = this.model.get('email') || '';
  },

  destroy: function() {
    var self = this;

    this.model.destroy().done(function() {
      self.remove();
    });
  }
});

module.exports = Backbone.View.extend({
  template: fs.readFileSync(
    __dirname + '/templates/customers.html',
    'utf8'
  ),

  initialize: function() {
    this.listenTo(this.model, 'add remove', this.render);
  },

  render: function() {
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
