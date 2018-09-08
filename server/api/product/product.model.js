'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ENUM = require('../../enum');
const ProductBase = require('./product-base.model');
var _ = require('lodash');
var facets = require('fancy-facets');

var ProductSchema = new Schema({
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
  // revisions: [ProductBaseSchema],
  facets: [{
    type: String,
    index: true
  }]
});

ProductSchema.pre('save', function(next) {
  this.slug = this.name.split(' ').join('-').split('/').join('-').toLowerCase();
  next();
});

ProductSchema.pre('save', function(next) {
  this.facets = facets(this.features);
  next();
});

ProductSchema.pre('save', function(next) {
  if(this.features && this.features.supportedDevices) {
    this.features.supportedDevices = _.map(this.features.supportedDevices, function(item) {
      return item._id || item;
    });
  }
  next();
})

/**
 * Cleanup pre-save
 */
ProductSchema.pre('save', function(next) {
  if(this.features && this.features.price) {
    for(var prop in this.features.price) {
      var price = this.features.price[prop];
      if(price) {
        this.features.price[prop] = parseFloat(price);
      }
    }
  }
  next();
});

module.exports = ProductBase.discriminator('Product', ProductSchema);
