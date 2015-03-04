'use strict';

angular.module('speechBubbleApp')
  .controller('ProductsCtrl', function ($scope, Product) {
    $scope.products = Product.query();
  });
