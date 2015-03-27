'use strict';

angular.module('speechBubbleApp')
.controller('ProductRatingCtrl', function ($scope, Rating, Auth, $modal, $stateParams) {
  var productId = $stateParams.id;
  $scope.isLoggedIn = Auth.isLoggedIn;

  function updateResults() {
    Rating.get({ id: productId }, function(res) {
      $scope.product = res.product;
      $scope.ratings = res;
    });
  }

  updateResults();

  $scope.create = function() {
    $modal.open({
      templateUrl: 'app/rating/create.html',
      controller: 'ProductRatingCreateCtrl',
      size: 'lg',
      resolve: {
        product: function() {
          return $scope.ratings.product;
        }
      }
    });
  };

  $scope.$on('resultsUpdated', updateResults);
});
