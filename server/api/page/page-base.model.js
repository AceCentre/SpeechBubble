'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageBaseSchema = Schema({
  title: String,
  content: String,
  slug: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  },
  comments: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    required: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: Date,
  updatedAt: Date
}, { collection: 'pages' });

PageBaseSchema.pre('save', function(next) {
  var now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  next();
});

module.exports = mongoose.model('BasePage', PageBaseSchema);
