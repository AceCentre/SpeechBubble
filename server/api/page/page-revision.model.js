'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PageBaseSchema = require('./page-base.schema');
var extend = require('mongoose-schema-extend');

var PageRevisionSchema = PageBaseSchema.extend({

}, { collection: 'revisions' });

module.exports = mongoose.model('PageRevision', PageRevisionSchema);
