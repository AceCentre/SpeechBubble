'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductCreateCtrl', function($http, $timeout, $scope, $modalInstance, $modal, ProductTemplate, Product, growl) {
    $scope.isSaving = false;
    $scope.product = $scope.product || {};

    $scope.hideSimilarProducts = true;
    $scope.similarProducts = [];

    // Get similar products every 2 seconds
    var getSimilarProducts = _.debounce(function() {
      if(!$scope.product.name) {
        $timeout(function() {
          $scope.similarProducts.length = 0;
        });
        return;
      }
      $http({
        method: 'GET',
        url: '/api/product',
        params: {
          limit: 10,
          skip: 0,
          term: $scope.product.name
        }
      })
      .success(function(res) {
        $scope.similarProducts = res.items;
      });
    }, 300);

    $scope.$watch('product.name', getSimilarProducts);

    $scope.create = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        $scope.isSaving = true;
        Product.create($scope.product, function(res) {
          $scope.isSaving = false;
          $scope.product = res.toJSON();

          var modal = ProductTemplate($scope.product);

          $modalInstance.close();

          $modal.open({
            templateUrl: modal.template,
            controller: modal.controller,
            size: 'lg',
            resolve: {
              current: function () {
                return $scope.product;
              }
            }
          });
        }, function() {
          $scope.isSaving = false;
          growl.error('Could not create product.');
        });
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });
