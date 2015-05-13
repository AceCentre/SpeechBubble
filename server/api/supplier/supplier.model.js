'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SupplierSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  locations: [{
    address1: String,
    address2: String,
    city: String,
    county: String,
    country: String,
    postcode: String,
    telephone: String
  }],
  url: String,
  supportDetails: String
});

module.exports = mongoose.model('Supplier', SupplierSchema);
