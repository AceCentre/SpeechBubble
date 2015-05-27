'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ENUM = require('../../enum');
var ProductBaseSchema = require('./product-base.schema');
var extend = require('mongoose-schema-extend');
var _ = require('lodash');

var ProductSchema = ProductBaseSchema.extend({
  type: {
    type: String,
    enum: ENUM.PRODUCT_TYPES,
    required: true
  },
  currentRevision: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductRevision'
  },
  slug: {
    type: String,
    index: { unique: true, sparse: true }
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  awaitingModeration: Boolean,
  _revisions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductRevision'
  }]
}, { collection: 'products' });

ProductSchema.pre('validate', function(next) {
  this.slug = this.name.split(' ').join('-').toLowerCase();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
