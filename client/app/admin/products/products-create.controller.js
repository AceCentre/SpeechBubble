'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductCreateCtrl', function($scope, $modalInstance, $modal, templates) {

    $scope.productTypes = [
      'Simple',
      'Advanced',
      'Low-tech',
      'Accessory',
      'Software',
      'Vocabulary'
    ];

    $scope.product = {};

    $scope.create = function() {
      var template;

      switch($scope.type) {
        case 'Simple':
          template = templates.simple;
          break;
        case 'Advanced':
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
