'use strict';

angular.module('speechBubbleApp')
  .controller('SupplierCtrl', function ($scope) {
    $scope.endpoint = '/api/supplier/:id';
  });
