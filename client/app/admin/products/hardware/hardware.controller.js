'use strict';

angular.module('speechBubbleApp')
.controller('AdminProductHardwareEditCtrl', function($scope, $http, $modal, $modalInstance, $upload, Product, Supplier, current, ProductOptions, ProductImages, ProductVideos, ProductLinks, growl) {

  $scope.product = current;
  $scope.devices = ProductOptions.devices;
  $scope.speechOptions = ProductOptions.speech;
  $scope.productLinks = ProductLinks($scope);
  $scope.supplierOptions = [];
  $scope.vocabularyOptions = [];
  $scope.images = ProductImages($scope);
  $scope.videos = ProductVideos($scope);

  $scope.revisions = [];
  $scope.revisionsPerPage = 5;
  $scope.currentPage = 1;

  $http.get('/api/product/' + current._id + '/revisions')
  .success(function(res) {
    $scope.revisions = res;
  });

  $scope.$watch('imagesToUpload', $scope.images.add);

  $scope.revert = function(revision) {
    var type = current.type;
    angular.copy(revision, $scope.product);
    $scope.product.type = type;
    console.log($scope.product);
  };

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
