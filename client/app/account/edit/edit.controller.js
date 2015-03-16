'use strict';

angular.module('speechBubbleApp')
  .controller('EditCtrl', function ($scope, User, $location, growl) {
    $scope.requirePassword = false;
    $scope.user = {};

    $scope.descriptions = ['professional', 'parent', 'aac user', 'other'];
    $scope.regions = ['UK', 'Europe', 'USA', 'Other'];

    $scope.save = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        User.update($scope.user).$promise
        .then(function() {
          growl.success('Details updated successfully.');
        })
        ['catch']( function(err) {
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

    User.get(function(user) {
      $scope.user.email = user.email;
      $scope.user.firstName = user.firstName;
      $scope.user.lastName = user.lastName;
      $scope.user.description = user.description;
      $scope.user.region = user.region;
      $scope.user.subscribe = user.subscribe;
    });
  });
