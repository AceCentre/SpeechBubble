'use strict';

var _ = require('lodash');
var Glossary = require('./glossary.model');

// Get list of glossarys
exports.index = function(req, res) {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var skip = (page - 1) * limit;
  Glossary.find().count(function(err, total) {
    Glossary.find().sort('title').limit(limit).skip(skip).exec(function (err, items) {
      if(err) { return handleError(res, err); }
      return res.json(200, {
        total: total,
        items: items
      });
    });
  });
};

// Get a single glossary
exports.show = function(req, res) {
  Glossary.findById(req.params.id, function (err, glossary) {
    if(err) { return handleError(res, err); }
    if(!glossary) { return res.send(404); }
    return res.json(glossary);
  });
};

// Creates a new glossary in the DB.
exports.create = function(req, res) {
  Glossary.create(req.body, function(err, glossary) {
    if(err) { return handleError(res, err); }
    return res.json(201, glossary);
  });
};

// Updates an existing glossary in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Glossary.findById(req.params.id, function (err, glossary) {
    if (err) { return handleError(res, err); }
    if(!glossary) { return res.send(404); }
    var updated = _.merge(glossary, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, glossary);
    });
  });
};

// Deletes a glossary from the DB.
exports.destroy = function(req, res) {
  Glossary.findById(req.params.id, function (err, glossary) {
    if(err) { return handleError(res, err); }
    if(!glossary) { return res.send(404); }
    glossary.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
