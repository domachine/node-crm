var fs = require('fs');

var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({
  template: fs.readFileSync(__dirname + '/templates/customer.html', 'utf8'),

  render: function() {
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
