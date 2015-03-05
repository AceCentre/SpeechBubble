'use strict';

angular.module('speechBubbleApp')
  .controller('MainCtrl', function ($scope, $location, $http) {
    $scope.search = {
      text: $location.search().search || ''
    };
  });
