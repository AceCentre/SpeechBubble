'use strict';

angular.module('speechBubbleApp')
  .controller('ProductsCtrl', function ($scope, $modal, Product) {
    $scope.products = Product.query();

    // pagination
    $scope.productsPerPage = 10;
    $scope.currentPage = 1;

    var templates = {
      create: 'app/admin/products/create.html',
      simple: 'app/admin/products/types/simple.html',
      advanced: 'app/admin/products/types/advanced.html'
    };

    $scope.create = function() {
      $modal.open({
        templateUrl: templates.create,
        controller: 'AdminProductCreateCtrl',
        resolve: {
          templates: function() {
            return templates;
          }
        }
      });
    };

  });
