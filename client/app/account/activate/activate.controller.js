'use strict';

angular.module('speechBubbleApp')
  .controller('ActivateCtrl', function ($scope, PageTitle, User, $stateParams) {

    PageTitle('Account verification');
    
    $scope.showMessage = false;

    User.activate({
      controller: $stateParams.id
    }, function() {
      $scope.verified = true;
      $scope.showMessage = true;
    }, function() {
      $scope.verified = false;
      $scope.showMessage = true;
    });
  });
