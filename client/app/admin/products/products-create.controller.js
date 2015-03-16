'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductCreateCtrl', function($scope, $modalInstance, $modal, ProductTemplate) {

    $scope.product = {};

    $scope.create = function() {

      var modal = ProductTemplate($scope.product);

      $modalInstance.close();

      $modal.open({
        templateUrl: modal.template,
        controller: modal.controller,
        size: 'lg',
        resolve: {
          current: function() {
            return $scope.product;
          }
        }
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });
