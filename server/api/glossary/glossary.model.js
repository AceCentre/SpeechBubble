'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GlossarySchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Glossary', GlossarySchema);