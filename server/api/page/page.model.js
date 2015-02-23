'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PageSchema = new Schema({
  slug: {
    type: String,
    required: true
  },
  title: String,
  content: String,
  isActive: {
    type: Boolean,
    default: false
  },
  enableComments: {
    type: Boolean,
    default: false
  },
  registrationRequired: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Page', PageSchema);
