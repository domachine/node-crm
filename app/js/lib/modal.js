var Backbone = require('backbone');

var Modal = Backbone.View.extend({
  el: '.modal.fade',
  yesNoTemplate: document
    .querySelector('.modal-footer script#yesno-template').innerHTML,
  okTemplate: document
    .querySelector('.modal-footer script#ok-template').innerHTML,
  state: null,

  states: {
    OK: 0,
    YES: 1,
    NO: 2
  },

  render: function(opts) {
    'use strict';

    var self = this;

    if (opts.title) {
      this.el.querySelector('h4.modal-title').textContent = opts.title;
    }

    if (opts.body) {
      this.el.querySelector('.modal-body').innerHTML = opts.body;
    }

    // Hackish solution to make the type of the dialog modifiable.  I
    // have to rework this thing!
    if (opts.type === 'yesno') {
      this.el.querySelector('.modal-footer').innerHTML = this.yesNoTemplate;
      this.$el.find('[data-action="yes"]').one('click', function() {
        self.setYes();
      });
      this.$el.find('[data-action="no"]').one('click', function() {
        self.setNo();
      });
    } else {
      this.el.querySelector('.modal-footer').innerHTML = this.okTemplate;
      this.$el.find('[data-action="ok"]').one('click', function() {
        self.setOk();
      });
    }

    // Attach to the close action once to track the result.
    this.$el.one('hidden.bs.modal', function() {
      self.trigger('closed');
    });
    this.state = null;
    this.$el.modal('show');
  },

  setNo: function() {
    'use strict';

    this.state = this.states.NO;
    this.$el.modal('hide');
  },

  setYes: function() {
    'use strict';

    this.state = this.states.YES;
    this.$el.modal('hide');
  },

  setOk: function() {
    'use strict';

    this.state = this.states.OK;
    this.$el.modal('hide');
  }
});

module.exports = new Modal();
