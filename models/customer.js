var mongoose = require('mongoose');

var Schema;

Schema = new mongoose.Schema({
  name: String,
  email: String,
  street_address: String,
  zip_code: String,
  location: String,
  phone: [{
    description: String,
    number: String
  }]
});

module.exports = mongoose.model('customer', Schema);
