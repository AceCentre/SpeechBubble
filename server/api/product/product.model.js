'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ENUM = require('../../enum');

var ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ENUM.PRODUCT_TYPES
  },
  features: Schema.Types.Mixed,
  images: [{
    url: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    }
  }],
  videos: [{
    url: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    }
  }],
  discontinued: {
    type: Boolean,
    default: false
  },
  suppliers: [{
    type: Schema.Types.ObjectId,
    ref: 'Supplier'
  }]
}, { collection: 'products' });

module.exports = {
  Schema: ProductSchema,
  Model: mongoose.model('Product', ProductSchema)
};
