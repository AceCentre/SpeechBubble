'use strict';

angular.module('speechBubbleApp')
  .controller('ProductsCtrl', function ($scope, $location, Product, growl) {

    $scope.limit = Number($location.search().limit) || 10;
    $scope.skip = Number($location.search().skip) || 0;
    $scope.page = ($scope.skip / $scope.limit) + 1;
    $scope.total = 0;

    $scope.$watch('page', function(page, lastPage) {
      $scope.skip = ($scope.page - 1) * $scope.limit;
      if(page !== lastPage) {
        $location.search({ limit: $scope.limit, skip: $scope.skip });
      }
      Product.query({
        skip: $scope.skip,
        limit: $scope.limit
      }, function(res) {
        $scope.products = res.products;
        $scope.total = res.total;
      }, function() {
        growl.error('Sorry a problem occurred.');
      });
    });

  });
