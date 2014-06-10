/* global i18n */

var Backbone = require('backbone');
Backbone.$ = $;

var models = require('./models');
var router = require('./router');

var user = new models.User();

i18n.init(function() {

  // Render GUI.
  document.querySelector('.navbar a[href="#customers"]')
    .textContent = i18n.t('Customers');
  user.fetch().done(function() {
    router.user = user;
    document.querySelector('[data-text="user"]')
      .textContent = user.get('username');
    Backbone.history.start();
  });
});
