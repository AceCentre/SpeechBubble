'use strict';

angular.module('speechBubbleApp')
  .controller('ProductsCtrl', function ($scope, $location, Product) {
    console.log($location.search);
    $scope.products = Product.query({
      skip: $location.search().skip || 0,
      limit: $location.search().limit || 10
    });

    // pagination
    $scope.productsPerPage = 10;
    $scope.currentPage = 1;
  });
