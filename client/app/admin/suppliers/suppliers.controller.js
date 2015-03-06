'use strict';

angular.module('speechBubbleApp')
  .controller('AdminSupplierCtrl', function ($scope, $location, $modal, Modal, Supplier, growl) {

    $scope.endpoint = '/api/supplier/:id';

    $scope.current = {
      supplier: null
    };

    $scope.create = function() {
      $scope.edit({});
    };

    $scope.edit = function(supplier) {
      $modal.open({
        templateUrl: 'app/admin/suppliers/edit.html',
        controller: 'AdminSupplierEditCtrl',
        size: 'lg',
        resolve: {
          suppliers: function() {
            return $scope.items;
          },
          supplier: function() {
            return supplier;
          }
        }
      });
    };

    $scope['delete'] = Modal.confirm['delete'](function(supplier) { // callback when modal is confirmed
      Supplier.remove({ id: supplier._id });
      angular.forEach($scope.items, function(s, i) {
        if (s === supplier) {
          $scope.items.splice(i, 1);
        }
      });
    });

  });
