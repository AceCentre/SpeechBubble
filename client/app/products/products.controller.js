'use strict';

angular.module('speechBubbleApp')

.controller('ProductsCtrl', function ($scope) {
  $scope.endpoint = '/api/product/:id';
})

.controller('ProductDetailCtrl', function($scope, product, ProductTemplate, $modal, Auth) {
  $scope.isLoggedIn = Auth.isLoggedIn;

  $scope.product = product.data;
  $scope.comments = true;

  $scope.edit = function(product) {

    var modal = ProductTemplate(product);

    $modal.open({
      templateUrl: modal.template,
      controller: modal.controller,
      size: 'lg',
      resolve: {
        current: function() {
          return product;
        }
      }
    });
  };

});
