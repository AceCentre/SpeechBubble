'use strict';

angular.module('speechBubbleApp')
.controller('AdminProductHardwareEditCtrl', function($scope, $modalInstance, Product, current, ProductOptions, ProductSelect2Options, growl) {

  $scope.product = current;
  $scope.devices = ProductOptions.devices;
  $scope.synthetisedSpeechOptions = ProductOptions.speech;
  $scope.select2VocabularyOptions = ProductSelect2Options.vocabulary;
  $scope.select2Options = ProductSelect2Options.supplier;

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
    console.log(form);
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
