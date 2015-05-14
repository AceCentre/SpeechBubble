'use strict';

angular.module('speechBubbleApp')
.controller('ProductRatingCtrl', function ($scope, $location, Rating, PageTitle, Auth, $modal, $stateParams) {
  PageTitle('Rating');
  var initial = true;
  var productId = $stateParams.id;
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.ratings = {
    reviews: []
  };

  function updateResults() {
    Rating.get({ id: productId }, function(res) {
      $scope.product = res.product;
      $scope.ratings = res;
      if(initial) {
        initial = false;
        if( $location.search().create ) {
          $scope.create();
        }
      }
    });
  }

  updateResults();

  $scope.create = function() {
    if($scope.isLoggedIn()) {
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
    }
  };

  $scope.$on('resultsUpdated', updateResults);
});
