'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ENUM = require('../../enum');

var SupplierSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  locations: [{
    address1: String,
    address2: String,
    city: String,
    county: String,
    country: String,
    postCode: String
  }],
  url: String,
  supportDetails: String
});

module.exports = mongoose.model('Supplier', SupplierSchema);
