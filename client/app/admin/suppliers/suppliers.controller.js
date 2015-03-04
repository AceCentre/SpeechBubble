'use strict';

angular.module('speechBubbleApp')
  .controller('AdminSuppliersCtrl', function ($scope, Supplier) {
    $scope.suppliers = Supplier.query();
  });
