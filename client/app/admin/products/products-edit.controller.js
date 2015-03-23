'use strict';

angular.module('speechBubbleApp')
.controller('AdminProductEditCtrl', function($scope, $modalInstance, Product, Supplier, current, ProductOptions, growl) {

  $scope.product = current;

  $scope.revisions = current._revisions;
  $scope.revisionsPerPage = 5;
  $scope.currentPage = 1;

  $scope.revert = function(revision) {
    $scope.product = revision;
  };

  $scope.suppliers = ProductOptions.suppliers;
  $scope.supplierOptions = [];

  $scope.refreshSuppliers = function(term) {
    Supplier.query({ term: term, limit: 0, skip: 0 }, function(res) {
      $scope.supplierOptions = res.items;
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  $scope.save = function(form) {
    $scope.submitted = true;
    if($scope.product && form.$valid) {
      if($scope.product._id) {
        Product.update($scope.product,
          function(res) {
            $modalInstance.close();
            growl.success('Product updated.');
          },
          function(res) {
            growl.error('An error occurred.');
          });
      } else {
        Product.create($scope.product,
          function(res) {
            angular.copy(res.toJSON(), $scope.product);
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
