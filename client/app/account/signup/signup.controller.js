'use strict';

angular.module('speechBubbleApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window, $timeout, growl) {
    $scope.requirePassword = true;
    $scope.user = {};
    $scope.errors = {};

    $scope.descriptions = ['professional', 'parent', 'aac user', 'other'];
    $scope.regions = ['UK', 'Europe', 'USA', 'Other'];

    $scope.save = function(form) {
      $scope.submitted = true;
      $scope.user.captcha = grecaptcha.getResponse();

      // allow resolution of user captcha for form validation
      $timeout(function() {
        if(form.$valid) {
          Auth.createUser({
            firstName: $scope.user.firstName,
            lastName: $scope.user.lastName,
            description: $scope.user.description,
            subscribe: $scope.user.subscribe,
            region: $scope.user.region,
            email: $scope.user.email,
            password: $scope.user.password,
            captcha: $scope.user.captcha,
            accept: $scope.user.accept
          })
          .then( function() {
            // Account created, redirect to home
            $location.path('/');
          })
          ['catch']( function(err) {
            grecaptcha.reset();

            if(typeof err.data === 'string') {
              growl.error(err.data);
            } else {
              err = err.data;
              $scope.errors = {};

              // Update validity of form fields that match the mongoose errors
              angular.forEach(err.errors, function(error, field) {
                form[field].$setValidity('mongoose', false);
                $scope.errors[field] = error.message;
              });
            }

          });
        }
      });


    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
