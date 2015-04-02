'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductCreateCtrl', function($scope, $modalInstance, $modal, ProductTemplate, Product, growl) {

    $scope.isSaving = false;
    $scope.product = {};

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
