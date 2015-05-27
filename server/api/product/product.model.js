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
  currentRevision: Schema.Types.ObjectId,
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
  revisions: [ProductBaseSchema]
}, { collection: 'products' });

ProductSchema.pre('save', function(next) {
  this.slug = this.name.split(' ').join('-').toLowerCase();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
