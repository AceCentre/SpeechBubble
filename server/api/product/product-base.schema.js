var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductBaseSchema = new Schema({
  name: {
    type: String,
    required: true
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
  features: Schema.Types.Mixed
});

module.exports = ProductBaseSchema;
