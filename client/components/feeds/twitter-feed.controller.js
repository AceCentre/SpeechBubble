'use strict';

angular.module('speechBubbleApp')
  .controller('TwitterFeedCtrl', function ($scope, $http) {
    $scope.feed = [];

    $http({
      method: 'GET',
      url: '/api/feeds/twitter',
      params: { limit: 3 }
    })
    .success(function(res) {
      $scope.feed = res;
    })
    .error(function() {

    });
  });
