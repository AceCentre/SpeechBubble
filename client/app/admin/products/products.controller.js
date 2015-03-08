'use strict';

angular.module('speechBubbleApp')
  .controller('AdminProductsCtrl', function ($scope, $modal) {
    $scope.endpoint = '/api/product/:id';
    // Create/Edit
    var templates = {
      create: 'app/admin/products/create.html',
      simple: 'app/admin/products/types/simple.html',
      advanced: 'app/admin/products/types/advanced.html',
      vocabulary: 'app/admin/products/types/vocabulary.html'
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
