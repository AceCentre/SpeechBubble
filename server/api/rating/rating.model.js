'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('../product/product.model');
var _ = require('lodash');

var RatingReviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
});

var RatingSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviews: [RatingReviewSchema]
});

RatingSchema.pre('save', function(next) {
  // only include approved ratings
  var reviews = _.filter(this.reviews, function(review) {
    return review.visible;
  });
  var sum = 0;
  var totalReviews = reviews.length;

  reviews.forEach(function(review) {
    sum += review.rating;
  });

  this.averageRating = totalReviews && (sum / totalReviews);
  next();
});

RatingSchema.post('save', function(next) {
  var self = this;
  Product.findByIdAndUpdate(self.product, {
    ratings: {
      average: self.averageRating,
      total: self.reviews.length
    }
  }, function(err, product) {
  });
});

module.exports = {
  Rating: mongoose.model('Rating', RatingSchema),
  RatingReview: mongoose.model('RatingReview', RatingReviewSchema)
};
