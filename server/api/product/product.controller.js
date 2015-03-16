'use strict';

var _ = require('lodash');
var Product = require('./product.model').Model;

// Get list of products
exports.index = function(req, res) {
  var skip = req.query.skip || 0;
  var limit = req.query.limit || 10;
  var type = req.query.type;

  var re = new RegExp(req.query.term, 'i');
  var orQuery = [
    { name: re },
    { description: re }
  ];
  var query = {};

  if(type) {
    query.type = type;
  }

  Product
  .find(query)
  .or(orQuery)
  .count(function(err, total) {
    if(err) { return handleError(res, err); }
    Product
    .find(query)
    .or(orQuery)
    .sort({ name: 'asc' })
    .skip(skip)
    .limit(limit)
    .populate('suppliers')
    .exec(function (err, products) {
      if(err) { return handleError(res, err); }
      return res.json(200, {
        total: total,
        items: products
      });
    });
  });
};

// Get a single product
exports.show = function(req, res) {
  Product.findById(req.params.id, function (err, product) {
    if(err) { return handleError(res, err); }
    if(!product) { return res.send(404); }
    return res.json(product);
  });
};

// Creates a new product in the DB.
exports.create = function(req, res) {
  req.body.suppliers = req.body.suppliers.map(function(supplier) {
    return _.isString(supplier) ? supplier: supplier._id;
  });
  Product.create(req.body, function(err, product) {
    if(err) { return handleError(res, err); }
    return res.json(201, product);
  });
};

// Updates an existing product in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  req.body.suppliers = req.body.suppliers.map(function(supplier) {
    return _.isString(supplier) ? supplier: supplier._id;
  });
  Product.findByIdAndUpdate(req.params.id, req.body, { overwrite: true }, function (err, product) {
    if (err) { return handleError(res, err); }
    if(!product) { return res.send(404); }
    return res.json(200, product);
  });
};

// Deletes a product from the DB.
exports.destroy = function(req, res) {
  Product.findById(req.params.id, function (err, product) {
    if(err) { return handleError(res, err); }
    if(!product) { return res.send(404); }
    product.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
