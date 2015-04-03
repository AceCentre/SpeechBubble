'use strict';

angular.module('speechBubbleApp')
.controller('AdminRatingEditCtrl', function(Auth, $http, $rootScope, $scope, Rating, $modalInstance, Modal, current, growl) {

  $scope.isAdmin = Auth.isAdmin;
  $scope.isSaving = false;
  $scope.current = current;

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  var remove = Modal.confirm['delete'](function(review) { // callback when modal is confirmed
    $scope.isSaving = true;
    $http.delete('/api/rating/' + $scope.current._id + '/' + review._id)
    .success(function() {
      angular.forEach($scope.current.reviews, function(r, i) {
        if (r === review) {
          $scope.current.reviews.splice(i, 1);
        }
      });
      $scope.isSaving = false;
      growl.success('Rating deleted.');
    })
    .error(function() {
      $scope.isSaving = false;
      growl.error('Could not delete rating.');
    });
  });

  $scope['delete'] = function(review) {
    var message = 'rating by ' + review.author.firstName + (review.author.lastName ? ' ' + review.author.lastName: '');
    remove(message, review);
  };

  $scope.save = function(form) {
    $scope.isSaving = true;
    Rating.update($scope.current, function() {
      $scope.isSaving = false;
      growl.success('Rating updated.');
      $modalInstance.close();
    }, function() {
      $scope.isSaving = false;
      growl.error('Could not save rating.');
    });
  };

});
