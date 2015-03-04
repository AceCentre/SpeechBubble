'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
  supplier: {
    type: Schema.Types.ObjectId;
    ref: 'Supplier'
  }
}, { collection: 'products' });

module.exports = {
  Schema: ProductSchema,
  Model: mongoose.model('Product', ProductSchema)
};
