'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GlossarySchema = new Schema({
  'title': {
    'type': String,
    'index': { 'unique': true },
    'required': true
  },
  'category': {
    'type': String,
    'maxLength': 1
  },
  'description': {
    'type': String,
    'required': true
  }
});

GlossarySchema.pre('save', function(next){
  this.category = this.title.charAt(0).toLowerCase();
  next();
});

module.exports = mongoose.model('Glossary', GlossarySchema);
