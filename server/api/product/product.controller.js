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

  console.log(query);

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
  Product.create(req.body, function(err, product) {
    if(err) { return handleError(res, err); }
    return res.json(201, product);
  });
};

// Updates an existing product in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Product.findById(req.params.id, function (err, product) {
    if (err) { return handleError(res, err); }
    if(!product) { return res.send(404); }
    var updated = _.merge(product, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, product);
    });
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
