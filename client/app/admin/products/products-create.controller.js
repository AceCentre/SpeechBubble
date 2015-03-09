'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductCreateCtrl', function($scope, $modalInstance, $modal, templates) {

    $scope.product = {};

    $scope.create = function() {
      var template;

      switch($scope.product.type) {
      case 'HardwareSimple':
          template = templates.simple;
          break;
        case 'HardwareAdvanced':
          template = templates.advanced;
          break;
        case 'Vocabulary':
          template = templates.vocabulary;
          break;
      }

      $modalInstance.close();

      $modal.open({
        templateUrl: template,
        controller: 'AdminProductEditCtrl',
        size: 'lg',
        resolve: {
          templates: function() {
            return templates;
          }
        }
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });
