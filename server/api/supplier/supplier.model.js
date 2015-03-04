'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ENUM = require('../../enum');

var SupplierSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: String,
  supportDetails: String,
  regions: {
    type: [String],
    enum: ENUM.REGION
  }
});

module.exports = mongoose.model('Supplier', SupplierSchema);
