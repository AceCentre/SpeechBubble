'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductsCtrl', function ($scope, $modal, Product) {
    // Create/Edit
    var templates = {
      create: 'app/admin/products/create.html',
      simple: 'app/admin/products/types/simple.html',
      advanced: 'app/admin/products/types/advanced.html'
    };

    $scope.create = function() {
      $modal.open({
        templateUrl: templates.create,
        controller: 'AdminProductCreateCtrl',
        resolve: {
          templates: function() {
            return templates;
          }
        }
      });
    };
  });
