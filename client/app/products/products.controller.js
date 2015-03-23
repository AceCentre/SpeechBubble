'use strict';

angular.module('speechBubbleApp')

.controller('ProductsCtrl', function ($scope) {
  $scope.endpoint = '/api/product/:id';
})

.controller('ProductDetailCtrl', function($scope, product, $http, ProductTemplate, $modal) {
  $scope.product = product.data;
  $scope.comments = true;

  $http.get('/api/product/' + $scope.product._id + '/revisions')
  .success(function(revisions) {
    $scope.userRevisions = revisions;
  });

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
