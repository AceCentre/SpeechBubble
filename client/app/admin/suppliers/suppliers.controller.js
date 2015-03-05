'use strict';

angular.module('speechBubbleApp')
  .controller('AdminSupplierCtrl', function ($scope, $location, $modal, Modal, Supplier, growl) {
    $scope.limit = Number($location.search().limit) || 10;
    $scope.skip = Number($location.search().skip) || 0;
    $scope.term = $location.search().term;
    $scope.page = ($scope.skip / $scope.limit) + 1;
    $scope.total = 0;

    function updateResults() {
      $scope.skip = ($scope.page - 1) * $scope.limit;
      Supplier.query({
        skip: $scope.skip,
        limit: $scope.limit,
        term: $location.search().term
      }, function(res) {
        $scope.suppliers = res.suppliers;
        $scope.total = res.total;
        $('html, body').stop().animate({ scrollTop: 0 }, 400);
      }, function(err) {
        growl.error('Sorry an error occured.');
      });
    }

    $scope.$watch('page', updateResults);

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
