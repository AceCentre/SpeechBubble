'use strict';

angular.module('speechBubbleApp')
.controller('ProductsCompareCtrl', function ($scope, $modalInstance, products) {
  $scope.products = products;

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

});
