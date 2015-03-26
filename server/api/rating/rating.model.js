'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RatingReview = new Schema({
  user: {
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
  reviews: [RatingReview]
});

RatingSchema.pre('save', function(next) {
  var sum = 0;
  var totalReviews = this.reviews.length;
  this.reviews.forEach(function(review) {
    sum += review.rating;
  });
  this.averageRating = totalReviews && (sum / totalReviews);
  next();
});

module.exports = mongoose.model('Rating', RatingSchema);
