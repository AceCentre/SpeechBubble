'use strict';

angular.module('speechBubbleApp')
.controller('ProductsCompareCtrl', function ($scope, $modalInstance, $sce, products) {
  $scope.products = products;

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  $scope.getThumbnail = function(item) {
    return $sce.trustAsResourceUrl( item.images.length && item.images[0].url || '/assets/images/products/default-thumbnail.png' );
  };

});
