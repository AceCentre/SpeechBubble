'use strict';

angular.module('speechBubbleApp')
.controller('AdminRatingEditCtrl', function(Auth, $rootScope, $scope, Rating, $modalInstance, current, growl) {

  $scope.isAdmin = Auth.isAdmin;
  $scope.isSaving = false;
  $scope.current = current;

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

});
