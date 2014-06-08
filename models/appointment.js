var mongoose = require('mongoose');

var Schema;

Schema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },

  title: String,
  description: String,

  from: Date,
  to: Date
});

module.exports = mongoose.model('appointment', Schema);
