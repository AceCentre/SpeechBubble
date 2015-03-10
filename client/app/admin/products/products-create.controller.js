'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductCreateCtrl', function($scope, $modalInstance, $modal) {

    $scope.product = {};

    $scope.create = function() {
      var template;
      var controller;

      switch($scope.product.type) {
        case 'HardwareSimple':
          controller = 'AdminProductEditCtrl';
          template = 'app/admin/products/types/simple.html';
          break;
        case 'HardwareAdvanced':
          controller = 'AdminProductEditCtrl';
          template = 'app/admin/products/types/advanced.html';
          break;
        case 'Vocabulary':
          controller = 'AdminProductEditCtrl';
          template = 'app/admin/products/types/vocabulary.html';
          break;
      };

      $modalInstance.close();

      $modal.open({
        templateUrl: template,
        controller: controller,
        size: 'lg'
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });
