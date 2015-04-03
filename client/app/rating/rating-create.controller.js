'use strict';

angular.module('speechBubbleApp')
  .controller('ProductRatingCreateCtrl', function($scope, $rootScope, $modalInstance, growl, Rating, $stateParams) {

    var productId = $stateParams.id;

    $scope.review = {
      '_id': productId
    };

    $scope.save = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        $http.post('/api/rating/' + $scope.review._id, {
          rating: $scope.review.rating,
          comment: $scope.review.comment
        })
        .success(function() {
            $modalInstance.close();
            $rootScope.$broadcast('resultsUpdated');
            growl.success('Review submitted for moderation.');
        })
        .error(function() {
            growl.error('Could not create review.');
        });
      }

    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });
