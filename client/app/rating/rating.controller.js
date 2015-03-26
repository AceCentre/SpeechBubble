'use strict';

angular.module('speechBubbleApp')
.controller('ProductRatingCtrl', function ($scope, ratings) {
  $scope.ratings = ratings.data;
});
