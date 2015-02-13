'use strict';

angular.module('speechBubbleApp')
  .controller('ContactCtrl', function ($scope, Auth, User, $location, $http) {
    $scope.message = {};

    if( Auth.isLoggedIn() ) {
      User.get(function(data) {
        $scope.message.firstName = data.firstName;
        $scope.message.lastName = data.lastName;
        $scope.message.email = data.email;
      });
    }

    $scope.send = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $http.post('/api/contact', $scope.message)
        .success(function() {
          $location.path('/contact/success');
        })
        .error(function() {
          $location.path('/contact/failure');
        });
      }
    }

  });
