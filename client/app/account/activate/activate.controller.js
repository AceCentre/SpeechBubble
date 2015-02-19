'use strict';

angular.module('speechBubbleApp')
  .controller('ActivateCtrl', function ($scope, User, $stateParams) {
    $scope.message = '';
    User.activate({
      controller: $stateParams.id
    }, function() {
      $scope.message = 'Account Verified.';
    }, function() {
      $scope.message = 'Account could not be found.';
    });
  });
