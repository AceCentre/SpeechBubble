'use strict';

angular.module('speechBubbleApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {
      description: '',
      region: ''
    };
    $scope.errors = {};

    $scope.descriptions = ['', 'professional', 'parent', 'aac user', 'other'];
    $scope.regions = ['', 'UK', 'Europe', 'USA', 'Other'];

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          description: $scope.user.description,
          subscribe: $scope.user.subscribe,
          region: $scope.user.region,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
