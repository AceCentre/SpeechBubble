'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageRevisionSchema = Schema({
  title: String,
  content: String,
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
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
