'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ENUM = require('../../enum');
var ProductBaseSchema = require('./product-base.schema');
var extend = require('mongoose-schema-extend');

var ProductSchema = ProductBaseSchema.extend({
  type: {
    type: String,
    enum: ENUM.PRODUCT_TYPES
  },
  currentRevision: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductRevision'
  },
  _revisions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductRevision'
  }]
}, { collection: 'products' });

module.exports = mongoose.model('Product', ProductSchema);
