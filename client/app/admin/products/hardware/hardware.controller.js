'use strict';

angular.module('speechBubbleApp')
.controller('AdminProductHardwareEditCtrl', function($scope, $modalInstance, Product, Supplier, current, ProductOptions, ProductLinks, growl) {

  $scope.product = current;
  $scope.devices = ProductOptions.devices;
  $scope.speechOptions = ProductOptions.speech;
  $scope.productLinks = ProductLinks($scope);
  $scope.supplierOptions = [];
  $scope.vocabularyOptions = [];

  $scope.refreshSuppliers = function(term) {
    Supplier.query({ term: term, limit: 0, skip: 0 }, function(res) {
      $scope.supplierOptions = res.items;
    });
  };

  $scope.refreshVocabularies = function(term) {
    Product.query({ type: 'ProductVocabulary', term: term, limit: 0, skip: 0 }, function(res) {
      $scope.vocabularyOptions = res.items;
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
