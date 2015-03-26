'use strict';

var _ = require('lodash');
var Rating = require('./rating.model');
var Product = require('../product/product.model');

// Get a single rating
exports.show = function(req, res) {
  var productId = req.params.id;
  Rating
  .findOne({ product: productId })
  .populate('product')
  .exec(function(err, ratings) {
    if(err) { return handleError(res, err); }
    if(!ratings) {
      Product.findById(req.params.id, function(err, product) {
        if(err) { return handleError(res, err); }
        if(!product) { return res.send(404); }
        Rating.create({
          product: productId
        }, function(err, ratings) {
          if(err) { return handleError(res, err); }
          Rating.populate(ratings, { path: 'product', model: 'Product' }, function(err, ratings) {
            if(err) { return handleError(res, err); }
            return res.send(200, ratings);
          });
        });
      });
    } else {
      return res.send(200, ratings);
    }
  });

};

// Creates a new rating in the DB.
exports.create = function(req, res) {
  Rating.create(req.body, function(err, rating) {
    if(err) { return handleError(res, err); }
    return res.json(201, rating);
  });
};

// Updates an existing rating in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Rating.findById(req.params.id, function (err, rating) {
    if (err) { return handleError(res, err); }
    if(!rating) { return res.send(404); }
    var updated = _.merge(rating, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, rating);
    });
  });
};

// Deletes a rating from the DB.
exports.destroy = function(req, res) {
  Rating.findById(req.params.id, function (err, rating) {
    if(err) { return handleError(res, err); }
    if(!rating) { return res.send(404); }
    rating.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
