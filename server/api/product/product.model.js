'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({

}, { collection: 'products' });

module.exports = {
  Schema: ProductSchema,
  Model: mongoose.model('Product', ProductSchema)
};
