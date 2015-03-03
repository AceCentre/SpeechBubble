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
  note: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: Date,
  updatedAt: Date
}, { collection: 'revisions' });

PageRevisionSchema.path('note').validate(function(value, respond) {
  if(this.published) {
    respond(!!value);
  }
  respond(true);
}, 'Please provide a commit note');

PageRevisionSchema.pre('save', function(next) {
  var now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  next();
});

module.exports = mongoose.model('PageRevision', PageRevisionSchema);
