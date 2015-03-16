'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductSoftwareEditCtrl', function($scope, $modalInstance, Product, Supplier, current, ProductOptions, growl) {

    $scope.product = current;
    $scope.devices = ProductOptions.devices;
    $scope.speechOptions = ProductOptions.speech;
    $scope.symbols = ProductOptions.symbols;
    $scope.supplierOptions = [];
    $scope.vocabularyOptions = [];
    $scope.deviceOptions = [];

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

    $scope.refreshDevices = function(term) {
      Product.query({ type: 'ProductHardwareAdvanced', term: term, limit: 0, skip: 0 }, function(res) {
        $scope.deviceOptions = res.items;
      });
    };

    $scope.$watch('product.features.dedicated', function() {
      $scope.refreshDevices();
    });

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

    $scope.addMoreInformation = function(form) {
      if(form.$valid) {
        $scope.product.features = $scope.product.features || {};
        $scope.product.features.moreInformationLinks = $scope.product.features.moreInformationLinks || [];
        $scope.temp = $scope.temp || {};

        $scope.product.features.moreInformationLinks.push({
          label: $scope.temp.moreInformationLabel,
          url: $scope.temp.moreInformationUrl
        });
        $scope.temp.moreInformationLabel = '';
        $scope.temp.moreInformationUrl = '';
      }
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
