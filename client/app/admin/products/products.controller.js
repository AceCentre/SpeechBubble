'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductsCtrl', function ($scope, $modal) {
    $scope.endpoint = '/api/product/:id';

    $scope.create = function() {
      $modal.open({
        templateUrl: 'app/admin/products/create.html',
        controller: 'AdminProductCreateCtrl'
      });
    };
  });
