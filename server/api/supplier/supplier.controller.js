'use strict';

var _ = require('lodash');
var Supplier = require('./supplier.model');

// Get list of suppliers
exports.index = function(req, res) {
  var skip = req.query.skip || 0;
  var limit = req.query.limit || 10;
  var re = new RegExp(req.query.term, 'i');
  var query = [
    { name: re }
  ];

  Supplier
  .find()
  .or(query)
  .count(function(err, total) {
    if(err) { return handleError(res, err); }
    Supplier.find()
    .or(query)
    .skip(skip)
    .limit(limit)
    .exec(function (err, suppliers) {
      if(err) { return handleError(res, err); }
      return res.json(200, {
        total: total,
        suppliers: suppliers
      });
    });
  });
};

// Get a single supplier
exports.show = function(req, res) {
  Supplier.findById(req.params.id, function (err, supplier) {
    if(err) { return handleError(res, err); }
    if(!supplier) { return res.send(404); }
    return res.json(supplier);
  });
};

// Creates a new supplier in the DB.
exports.create = function(req, res) {
  Supplier.create(req.body, function(err, supplier) {
    if(err) { return handleError(res, err); }
    return res.json(201, supplier);
  });
};

// Updates an existing supplier in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Supplier.findById(req.params.id, function (err, supplier) {
    if (err) { return handleError(res, err); }
    if(!supplier) { return res.send(404); }
    var updated = _.merge(supplier, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, supplier);
    });
  });
};

// Deletes a supplier from the DB.
exports.destroy = function(req, res) {
  Supplier.findById(req.params.id, function (err, supplier) {
    if(err) { return handleError(res, err); }
    if(!supplier) { return res.send(404); }
    supplier.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
