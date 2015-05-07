'use strict';

angular.module('speechBubbleApp')
.controller('MainCtrl', function ($rootScope, $scope, $state, $location, $http, ProductOptions, ProductSearch) {
  $scope.endpoint = '/api/product/:id';
  $scope.search = ProductSearch;
  $scope.devices = ProductOptions.devices;

  $scope.clearSearchFilters = function() {
    angular.forEach($scope.search, function(value, key) {
      if(key !== 'term') {
        delete $scope.search[key];
      }
    });
  };

  // Clear search filters when type is changed
  $scope.clearSearchRetainType = function() {
    angular.forEach($scope.search, function(value, key) {
      if(key !== 'term' && key !== 'type') {
        delete $scope.search[key];
      }
    });
  };

  $scope.viewAll = function() {
    $state.go('products');
  };

});
