'use strict';

angular.module('speechBubbleApp')
.controller('ProductRatingCtrl', function ($scope, ratings, Auth) {
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.ratings = ratings.data;
});
