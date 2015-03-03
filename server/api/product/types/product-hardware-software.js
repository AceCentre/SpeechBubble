var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var extend = require('mongoose-schema-extend');
var ProductSchema = require('../product.model').Schema;
var Schema = mongoose.Schema;

var SoftwareSchema = ProductSchema.extend({

});

module.exports = mongoose.model('ProductSoftware', SoftwareSchema);
