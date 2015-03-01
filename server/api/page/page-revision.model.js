'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageRevisionSchema = Schema({
  title: String,
  content: String,
  published: {
    type: Boolean,
    default: false
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'revisions' });

module.exports = mongoose.model('PageRevision', PageRevisionSchema);
