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
        Rating.update($scope.review,
          function() {
            $modalInstance.close();
            $rootScope.$broadcast('resultsUpdated');
            growl.success('Review Submitted.');
          },
          function() {
            growl.error('Could not create review.');
          }
        );
      }

    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });
