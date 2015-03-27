'use strict';

angular.module('speechBubbleApp')
.controller('SupplierCtrl', function ($scope) {
  $scope.endpoint = '/api/supplier/:id';
})

.controller('SupplierDetailCtrl', function($scope, supplier) {
 $scope.supplier = supplier.data;
});

