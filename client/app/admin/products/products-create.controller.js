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

    $scope.create = function() {
      var template;

      console.log(templates, $scope.type);

      switch($scope.type) {
        case 'Simple':
          template = templates.simple;
          break;
      }

      $modalInstance.close();

      $modal.open({
        templateUrl: template,
        controller: 'AdminProductEditCtrl',
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
