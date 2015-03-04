'use strict';

angular.module('speechBubbleApp')
  .controller('AdminSupplierCtrl', function ($scope, $modal, Modal, Supplier) {
    $scope.suppliers = Supplier.query();
    $scope.suppliersPerPage = 10;
    $scope.currentPage = 1;

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
        resolve: {
          suppliers: function() {
            return $scope.suppliers;
          },
          supplier: function() {
            return supplier;
          }
        }
      });
    };

    $scope['delete'] = Modal.confirm['delete'](function(supplier) { // callback when modal is confirmed
      Supplier.remove({ id: supplier._id });
      angular.forEach($scope.suppliers, function(s, i) {
        if (s === supplier) {
          $scope.suppliers.splice(i, 1);
        }
      });
    });

  });
