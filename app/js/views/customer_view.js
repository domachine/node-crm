var fs = require('fs');

var Backbone = require('backbone');
var _ = require('underscore');
var moment = require('moment');

var CustomerAppointmentsItemView = Backbone.View.extend({
  tagName: 'li',
  template: fs.readFileSync(
    __dirname + '/templates/customer_appointments_item.html'
  ),

  initialize: function() {
    'use strict';

    this.el.innerHTML = this.template;
  },

  render: function() {
    'use strict';

    var appointmentLink = this.el.querySelector('[data-href="appointment"]');
    appointmentLink.setAttribute('href', '#appointments/' + this.model.id);
    this.el.querySelector('[data-text="from"]')
      .textContent = moment(this.model.get('from')).format('DD.MM.YYYY');
    this.el.querySelector('[data-text="title"]')
      .textContent = this.model.get('title');
  }
});

var CustomerAppointmentsView = Backbone.View.extend({
  tagName: 'ul',

  render: function() {
    'use strict';

    var self = this;

    if (this.model) {
      this.model.each(function(appointment) {
        var itemView = new CustomerAppointmentsItemView({ model: appointment });

        itemView.render();
        self.el.appendChild(itemView.el);
      });
    }
  }
});

module.exports = Backbone.View.extend({
  template: fs.readFileSync(__dirname + '/templates/customer.html', 'utf8'),

  render: function() {
    'use strict';

    var appointmentsView;
    var phoneTemplate;

    this.$el.html(this.template);
    this.el.querySelector('[data-href="edit"]')
      .setAttribute('href', '#customers/' + this.model.id + '/edit');
    this.$el.find('[data-text="name"]').text(this.model.get('name') || '');
    if (this.model.get('email')) {
      this.$el.find('[data-text="email"]').text(this.model.get('email'));
    }

    this.el.querySelector('[data-text="street_address"]')
      .textContent = this.model.get('street_address') || '';
    this.el.querySelector('[data-text="zip_code"]')
      .textContent = this.model.get('zip_code') || '';
    this.el.querySelector('[data-text="location"]')
      .textContent = this.model.get('location') || '';

    appointmentsView = new CustomerAppointmentsView({
      model: this.model.appointments
    });

    appointmentsView.render();
    this.el.querySelector('.jumbotron').appendChild(appointmentsView.el);

    phoneTemplate = _.template(
      this.el
        .querySelector('[data-value="phone"] > script')
        .innerHTML
    );
    for (var i = 0; i < this.model.get('phone').length; ++i) {
      var phoneEl = document.createElement('li');
      phoneEl.innerHTML = phoneTemplate(this.model.get('phone')[i]);

      this.el
        .querySelector('[data-value="phone"]')
        .appendChild(phoneEl);
    }
  }
});
