'use strict';

var _ = require('lodash');
var Supplier = require('./supplier.model');

// Get list of suppliers
exports.index = function(req, res) {
  Supplier.find(function (err, suppliers) {
    if(err) { return handleError(res, err); }
    return res.json(200, suppliers);
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
