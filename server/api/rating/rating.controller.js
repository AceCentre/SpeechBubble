'use strict';

var _ = require('lodash');
var Rating = require('./rating.model').Rating;
var RatingReview = require('./rating.model').RatingReview;
var Product = require('../product/product.model');
const {handleError} = require('../apiutil');

exports.list = function(req, res) {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var skip = (page - 1) * limit;
  var query = { 'reviews.visible': false };

  Rating.find(query).count(function(err, total) {
    Rating
    .find(query)
    .sort({ updatedAt: 'desc' })
    .skip(skip)
    .limit(limit)
    .populate('product')
    .then((ratings) => {
      Rating
      .populate(ratings, { path: 'reviews.author', model: 'User', select: 'firstName' }, function(err, ratings) {
        if(err) { return handleError(res, err); }
        if(!ratings) { return res.send(404); }
        res.send(200, {
          total: total,
          items: ratings
        });
      });
    })
    .catch(handleError.bind(this, res));
  });
};

// Get a single rating
exports.show = function(req, res) {
  var productId = req.params.id;
  Rating
  .findOne({ product: productId })
  .populate('product')
  .then((ratings) => {
    if(!ratings) {
      Product.findById(req.params.id, function(err, product) {
        if(err) { return handleError(res, err); }
        if(!product) { return res.send(404); }
        Rating.create({
          product: productId
        }, function(err, ratings) {
          if(err) { return handleError(res, err); }
          Rating
          .populate(ratings, { path: 'product', model: 'Product' }, function(err, ratings) {
            RatingReview
            .populate(ratings, { path: 'reviews.author', model: 'User', select: 'firstName' }, function(err, ratings) {
              if(err) { return handleError(res, err); }
              ratings.reviews = _.filter(ratings.reviews, function(review) {
                return review.visible;
              });
              return res.send(200, ratings);
            });
          });
        });
      });
    } else {
      RatingReview
      .populate(ratings, { path: 'reviews.author', model: 'User', select: 'firstName' }, function(err, ratings) {
        if(err) { return handleError(res, err); }
        ratings.reviews = _.filter(ratings.reviews, function(review) {
          return review.visible;
        });
        res.send(200, ratings);
      });
    }
  })
  .catch(handleError.bind(this, res));

};

// Updates an existing rating in the DB.
exports.create = function(req, res) {
  Rating.findOne({ product: req.params.id }, function (err, rating) {
    if (err) { return handleError(res, err); }
    if(!rating) { return res.send(404); }
    rating.reviews.push({
      author: req.user._id,
      ratings: req.body.ratings,
      comment: req.body.comment
    });
    rating.save(function(err, rating) {
      if (err) { return handleError(res, err); }
      res.send(200);
    });
  });
};

// Updates a rating.
exports.update = function(req, res) {
  req.body.product = req.body.product._id;
  req.body.reviews = req.body.reviews.map(function(review) {
    review.author = review.author._id;
    return review;
  });
  Rating.findById(req.params.id, function(err, rating) {
    if (err) { return handleError(res, err); }
    if(!rating) { return res.send(404); }
    _.extend(rating, req.body);
    rating.save(function(err, rating) {
      if (err) { return handleError(res, err); }
      res.send(200, rating);
    });
  });
};

// Deletes a rating from the DB.
exports.remove = function(req, res) {
  Rating.findById(req.params.id, function (err, rating) {
    if(err) { return handleError(res, err); }
    if(!rating) { return res.send(404); }
    rating.reviews.pull({ _id: req.params.ratingId });
    rating.save(function(err, rating) {
      if(err) { return handleError(res, err); }
      res.send(200, rating);
    });
  });
};

