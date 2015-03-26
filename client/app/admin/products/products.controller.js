'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductsCtrl', function ($rootScope, $scope, $modal, ProductTemplate) {
    $scope.endpoint = '/api/product/:id';

    $scope.create = function() {
      var modalInstance = $modal.open({
        templateUrl: 'app/admin/products/create.html',
        controller: 'AdminProductCreateCtrl'
      });

      modalInstance.result.then(function() {
        $rootScope.$broadcast('resultsUpdated');
      }, function() {
        $rootScope.$broadcast('resultsUpdated');
      });
    };

    $scope.edit = function(product) {

      var modal = ProductTemplate(product);

      var modalInstance = $modal.open({
        templateUrl: modal.template,
        controller: modal.controller,
        size: 'lg',
        resolve: {
          current: function() {
            return product;
          }
        }
      });

      modalInstance.result.then(function() {
        $rootScope.$broadcast('resultsUpdated');
      }, function() {
        $rootScope.$broadcast('resultsUpdated');
      });
    };

  });
