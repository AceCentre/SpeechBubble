'use strict';

var _ = require('lodash');
var Rating = require('./rating.model').Rating;
var RatingReview = require('./rating.model').RatingReview;
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
          Rating
          .populate(ratings, { path: 'product', model: 'Product' })
          .exec(function(err, ratings) {
            RatingReview
            .populate(ratings, { path: 'reviews.author', model: 'User' }, function(err, ratings) {
              if(err) { return handleError(res, err); }
              return res.send(200, ratings);
            });
          });
        });
      });
    } else {
      RatingReview
      .populate(ratings, { path: 'reviews.author', model: 'User' }, function(err, ratings) {
        if(err) { return handleError(res, err); }
        res.send(200, ratings);
      });
    }
  });

};

// Updates an existing rating in the DB.
exports.update = function(req, res) {
  Rating.findOne({ product: req.params.id }, function (err, rating) {
    if (err) { return handleError(res, err); }
    if(!rating) { return res.send(404); }
    rating.reviews.push({
      author: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    });
    rating.save(function(err, rating) {
      if (err) { return handleError(res, err); }
      res.send(200);
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
