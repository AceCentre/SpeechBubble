'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
  var sum = 0;
  var totalReviews = this.reviews.length;
  this.reviews.forEach(function(review) {
    sum += review.rating;
  });
  this.averageRating = totalReviews && (sum / totalReviews);
  console.log(this);
  next();
});

module.exports = {
  Rating: mongoose.model('Rating', RatingSchema),
  RatingReview: mongoose.model('RatingReview', RatingReviewSchema)
};
