'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProductBaseSchema = require('./product-base.schema');
var extend = require('mongoose-schema-extend');

var ProductRevisionSchema = ProductBaseSchema.extend({

}, { collection: 'revisions' });

module.exports = mongoose.model('ProductRevision', ProductRevisionSchema);
