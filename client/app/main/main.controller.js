'use strict';

angular.module('speechBubbleApp')
.controller('MainCtrl', function ($rootScope, $scope, $state, $location, $http, ProductOptions, ProductSearch) {
  $scope.endpoint = '/api/product/:id';
  $scope.search = angular.copy(ProductSearch);
  $scope.devices = ProductOptions.devices;
  $scope.filters = {};
  
  $scope.step = function(step) {
    return $scope.state.step = step || $scope.state.step;
  };
  
  $scope.options = {
    'access': [{
      'name': 'touch',
      'facet': 'access-types-touch'
    }]
  };
  
  $scope.remove = function(key) {
    console.log(key);
    console.log($scope);
    delete $scope.filters[key];
  };

  $scope.clearSearchFilters = function() {
    angular.forEach($scope.search, function(value, key) {
      if(key !== 'term') {
        delete $scope.search[key];
      }
    });
    $scope.search.type = '';
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
