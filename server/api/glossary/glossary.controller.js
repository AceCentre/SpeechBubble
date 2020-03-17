'use strict';

var _ = require('lodash');
var Glossary = require('./glossary.model');
const {handleError,intFromQuery} = require('../apiutil');

// Get list of glossarys
exports.index = function(req, res) {
  var page = intFromQuery(req.query.page, 0);
  var limit = intFromQuery(req.query.limit, 0);
  var skip = 0;
  if(page) {
     skip = (page - 1) * limit;
  }
  Glossary.find().count(function(err, total) {
    Glossary.find().sort('title').limit(limit).skip(skip)
      .then((items) => {
        return res.json(200, {
          total: total,
          items: items
        });
      })
      .catch(handleError.bind(this, res));
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
