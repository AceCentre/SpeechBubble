'use strict';

angular.module('speechBubbleApp')
  .controller('AdminRatingsCtrl', function ($rootScope, $scope, $modal) {
    $scope.endpoint = '/api/rating/:id';

    $scope.edit = function(rating) {

      var modalInstance = $modal.open({
        templateUrl: 'app/admin/ratings/edit.html',
        controller: 'AdminRatingEditCtrl',
        size: 'lg',
        resolve: {
          current: function() {
            return rating;
          }
        },
        backdrop: 'static'
      });

      modalInstance.result.then(function() {
        $rootScope.$broadcast('resultsUpdated');
      }, function() {
        $rootScope.$broadcast('resultsUpdated');
      });
    };

    $scope.awaitingModeration = function(reviews) {
      var awaiting = reviews.filter(function(review) {
        return !review.visible;
      });
      return awaiting.length;
    };

  });
