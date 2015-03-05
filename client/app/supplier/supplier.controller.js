'use strict';

angular.module('speechBubbleApp')
  .controller('SupplierCtrl', function ($scope, $location, Supplier) {
    $scope.limit = Number($location.search().limit) || 10;
    $scope.skip = Number($location.search().skip) || 0;
    $scope.page = ($scope.skip / $scope.limit) + 1;
    $scope.total = 0;

    Supplier.query(function(res) {
      $scope.items = res.suppliers;
      $scope.total = res.total;
    });
  });
