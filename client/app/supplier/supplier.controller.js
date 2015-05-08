'use strict';

angular.module('speechBubbleApp')
.controller('SupplierCtrl', function ($scope, PageTitle) {
  PageTitle('Suppliers');
  $scope.endpoint = '/api/supplier/:id';
})

.controller('SupplierDetailCtrl', function($scope, supplier, PageTitle) {
  $scope.supplier = supplier.data;
  PageTitle('Supplier ' + $scope.supplier.name);
});

