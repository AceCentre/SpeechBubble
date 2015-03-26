'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ENUM = require('../../enum');

var ProductBaseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ENUM.REVISION_STATUS
  },
  summary: String,
  description: {
    type: String,
    required: true
  },
  discontinued: {
    type: Boolean,
    default: false
  },
  suppliers: [{
    type: Schema.Types.ObjectId,
    ref: 'Supplier'
  }],
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
  features: Schema.Types.Mixed,
  note: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: Date,
  updatedAt: Date
});

ProductBaseSchema.pre('save', function(next) {
  var now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  next();
});

module.exports = ProductBaseSchema;
