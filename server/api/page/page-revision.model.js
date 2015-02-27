'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageRevisionSchema = Schema({
  title: String,
  content: String,
  status: {
    type: String,
    enum: ['draft', 'published']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Page allow comments
  comments: {
    type: Boolean,
    default: false
  },
  // Page only to be displayed to authenticated users
  registration: {
    type: Boolean,
    default: false
  }
}, { collection: 'revisions' });

module.exports = mongoose.model('PageRevision', PageRevisionSchema);
