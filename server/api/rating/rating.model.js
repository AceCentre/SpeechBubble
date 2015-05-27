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
  ratings: Schema.Types.Mixed,
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
    required: true,
    index: true
  },
  average: {
    type: Number,
    default: 0
  },
  reviews: [RatingReviewSchema],
  createdAt: Date,
  updatedAt: Date
});

RatingSchema.pre('save', function(next) {
  // only include approved ratings
  var reviews = _.filter(this.reviews, function(review) {
    return review.visible;
  });

  var sum = 0;
  var totalReviews = 0;

  reviews.forEach(function(review) {
    _.each(review.ratings, function(key, value) {
      totalReviews += 1;
      sum += key;
    });
  });

  this.average = totalReviews && (sum / totalReviews);

  next();
});

RatingSchema.pre('save', function(next) {
  var now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  next();
});

RatingSchema.post('save', function(next) {
  var self = this;
  Product.findByIdAndUpdate(self.product, {
    ratings: {
      average: self.average,
      total: self.reviews.length
    }
  }, function(err, product) {
  });
});

module.exports = {
  Rating: mongoose.model('Rating', RatingSchema),
  RatingReview: mongoose.model('RatingReview', RatingReviewSchema)
};
