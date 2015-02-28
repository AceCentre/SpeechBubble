'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageSchema = Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  visibility: {
    type: String,
    enum: ['hidden', 'public'],
    default: 'hidden'
  },
  comments: {
    type: Boolean,
    default: false
  },
  registration: {
    type: Boolean,
    default: false
  },
  _revisions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PageRevision'
  }]
});

module.exports = mongoose.model('Page', PageSchema);
