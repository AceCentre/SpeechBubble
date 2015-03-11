'use strict';

angular.module('speechBubbleApp')
.controller('AdminProductEditCtrl', function($scope, $modalInstance, Product, current, ProductOptions, ProductSelect2Options, growl) {

  $scope.product = current;
  $scope.synthetisedSpeechOptions = ProductOptions.speech;
  $scope.select2VocabularyOptions = ProductSelect2Options.vocabulary;
  $scope.select2Options = ProductSelect2Options.supplier;

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
