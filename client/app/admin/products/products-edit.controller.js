'use strict';

angular.module('speechBubbleApp')
.controller('AdminProductEditCtrl', function($scope, $modalInstance, Product, growl) {

  $scope.select2Options = {
    multiple: true,
    ajax: {
      delay: 250,
      url: '/api/supplier/',
      data: function(term) {
        return {
          term: term,
          limit: 0,
          skip: 0
        };
      },
      results: function(res) {
        return {
          results: res.items.map(function(item) {
            return {
              id: item._id,
              text: item.name
            }
          })
        }
      }
    }
  };

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  $scope.save = function(form) {
    $scope.submitted = true;
    if($scope.product && form.$valid) {
      $scope.product.suppliers = $scope.selectedSuppliers.map(function(item) {
        return item.id;
      });
      if($scope.product._id) {
        Product.update($scope.product,
          function(res) {
            angular.copy(res, $scope.product);
            $modalInstance.close();
            growl.success('Product updated.');
          },
          function(res) {
            growl.error('An error occurred.');
          });
      } else {
        Product.create($scope.product,
          function(res) {
            angular.copy(res, $scope.product);
            $modalInstance.close();
            growl.success('Product created.');
          },
          function(res) {
            growl.error('An error occurred.');
          });
      }
    }
  };

});
