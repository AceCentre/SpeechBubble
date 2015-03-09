'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
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
  supplier: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier'
  }
}, { collection: 'products' });

module.exports = {
  Schema: ProductSchema,
  Model: mongoose.model('Product', ProductSchema)
};
