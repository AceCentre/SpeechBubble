'use strict';

angular.module('speechBubbleApp')
  .controller('ProductsCtrl', function ($scope, Product) {
    $scope.products = Product.query();

    // pagination
    $scope.productsPerPage = 10;
    $scope.currentPage = 1;
  });
